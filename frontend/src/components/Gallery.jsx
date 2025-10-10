import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { fetchTimelineEvents } from "../redux/timelineThunks"; // Import the new thunk
import "./Gallery.css";
import Navbar from "./shared/Navbar";
import TreeBranch from "./ui/TreeBranch";
import Spinner from "./shared/Spinner"; // Import a loading spinner component

export default function Gallery() {
  const dispatch = useDispatch();
  // Get data from the new timelineSlice
  const { events, loading } = useSelector((state) => state.timeline);

  const [petals, setPetals] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mediaIndex, setMediaIndex] = useState(0);

  // Fetch data when the component mounts
  useEffect(() => {
    dispatch(fetchTimelineEvents({ sort: sortOrder }));
  }, [dispatch, sortOrder]);

  useEffect(() => {
    // Generate petals only once on mount
    const petalsArray = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 10 + Math.random() * 8, // Slower, more graceful fall
      delay: Math.random() * 10,
      size: 10 + Math.random() * 8,
    }));
    setPetals(petalsArray);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Navbar />
      <div className="timeline-container">
        <div className="flex justify-end items-center gap-2 px-4 py-2">
          <label className="text-sm text-rose-700">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-rose-200 rounded-lg bg-white/80 text-rose-800"
          >
            <option value="asc">Oldest → Recent</option>
            <option value="desc">Recent → Oldest</option>
          </select>
        </div>
        {/* Sakura Petal Animations */}
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="sakura-petal"
            initial={{ y: -50, x: 0, opacity: 0 }}
            animate={{
              y: "100vh",
              x: [0, 40, -40, 0], // Adds swaying motion
              rotate: [0, 180, 360], // Adds tumbling motion
              opacity: [0.8, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          />
        ))}

        {/* The Sakura Tree Trunk */}
        <TreeBranch className="timeline-trunk" />

        {/* Events blooming from the trunk */}
        <div className="timeline-events">
          {/* Map over the REAL data from Redux */}
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={event._id}
                className={`timeline-event ${isLeft ? "left" : "right"}`}
                onClick={() => setSelectedEvent(event)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                <div className="event-icon">{event.icon}</div>
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p>{event.year}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Modal for Event Details */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              className="modal-backdrop"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="modal-icon">{"🗓️"}</span>
                <h2>{selectedEvent.title}</h2>
                <h4>{new Date(selectedEvent.date).toLocaleDateString()}</h4>

                {/* Media Viewer */}
                {Array.isArray(selectedEvent.mediaURLs) &&
                  selectedEvent.mediaURLs.length > 0 && (
                    <div className="modal-media">
                      {(() => {
                        const media = selectedEvent.mediaURLs || [];
                        const current = media[mediaIndex] || null;
                        if (!current) return null;
                        if (current.type === "video") {
                          return (
                            <video
                              key={mediaIndex}
                              src={current.url}
                              controls
                              className="modal-media-el"
                            />
                          );
                        }
                        return (
                          <img
                            key={mediaIndex}
                            src={current.url}
                            alt={`media-${mediaIndex}`}
                            className="modal-media-el"
                          />
                        );
                      })()}

                      {/* Nav buttons if multiple */}
                      {selectedEvent.mediaURLs.length > 1 && (
                        <>
                          <button
                            className="nav-btn left"
                            aria-label="Prev"
                            onClick={() =>
                              setMediaIndex(
                                (i) =>
                                  (i - 1 + selectedEvent.mediaURLs.length) %
                                  selectedEvent.mediaURLs.length
                              )
                            }
                          >
                            ‹
                          </button>
                          <button
                            className="nav-btn right"
                            aria-label="Next"
                            onClick={() =>
                              setMediaIndex(
                                (i) => (i + 1) % selectedEvent.mediaURLs.length
                              )
                            }
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                  )}

                {/* Thumbnails */}
                {Array.isArray(selectedEvent.mediaURLs) &&
                  selectedEvent.mediaURLs.length > 1 && (
                    <div className="modal-thumbs">
                      {selectedEvent.mediaURLs.map((m, i) => (
                        <button
                          key={i}
                          onClick={() => setMediaIndex(i)}
                          className={`modal-thumb ${
                            i === mediaIndex ? "active" : ""
                          }`}
                          aria-label={`Go to media ${i + 1}`}
                        >
                          {m.type === "image" ? (
                            <img src={m.url} alt={`thumb-${i}`} />
                          ) : (
                            <div className="thumb-video">▶</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                {/* Meta & Story */}
                <div className="modal-meta">
                  {selectedEvent.author?.fullName && (
                    <div className="byline">
                      By {selectedEvent.author.fullName}
                    </div>
                  )}
                  {Array.isArray(selectedEvent.tags) &&
                    selectedEvent.tags.length > 0 && (
                      <div className="tag-list">
                        {selectedEvent.tags.map((t) => (
                          <span className="tag-chip" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
                <p>{selectedEvent.story}</p>
                <button onClick={() => setSelectedEvent(null)}>Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
