const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const moment = require('moment');
const { MeiliSearch } = require('meilisearch');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/virasat';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const photoSchema = new mongoose.Schema({
  filename: String,
  description: String,
  tags: [String],
  takenOn: Date,
  uploader: String,
  url: String, // in real setup: link to cloud storage
  createdAt: { type: Date, default: Date.now },
});

const Photo = mongoose.model('Photo', photoSchema);

const searchClient = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_MASTER_KEY || '',
});

const INDEX_NAME = 'family_archive';
const index = searchClient.index(INDEX_NAME);

(async () => {
  try {
    await index.updateSettings({
      searchableAttributes: ['description', 'tags', 'uploader'],
      filterableAttributes: ['tags'],
      sortableAttributes: ['takenOn', 'createdAt'],
    });
  } catch (err) {
    console.error('Error initializing Meilisearch index:', err.message);
  }
})();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    const { description, tags, takenOn, uploader } = req.body;
    const tagArray = tags ? tags.split(',').map(t => t.trim().toLowerCase()) : [];

    const photoDoc = new Photo({
      filename: req.file.filename,
      description,
      tags: tagArray,
      takenOn: takenOn ? moment(takenOn).toDate() : null,
      uploader,
      url: `/uploads/${req.file.filename}`,
    });

    await photoDoc.save();

    await index.addDocuments([
      {
        id: photoDoc._id.toString(),
        description,
        tags: tagArray,
        uploader,
        takenOn: photoDoc.takenOn,
        createdAt: photoDoc.createdAt,
        type: 'photo',
      },
    ]);

    res.json({
      message: 'Photo uploaded & indexed successfully!',
      photo: photoDoc,
    });
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).json({ error: err.message });
  }
});

// for searching:
app.get('/search', async (req, res) => {
  try {
    const { q, tag, limit } = req.query;

    const searchParams = {
      q: q || '',
      filter: tag ? `tags = "${tag.toLowerCase()}"` : undefined,
      limit: parseInt(limit || 10),
      sort: ['takenOn:desc'],
    };

    const searchResults = await index.search(searchParams.q, searchParams);
    res.json({
      total: searchResults.estimatedTotalHits,
      hits: searchResults.hits,
    });
  } catch (err) {
    console.error('Error searching the archive:', err);
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
