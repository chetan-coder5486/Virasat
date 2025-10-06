import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Gallery.css";
import Navbar from "./shared/Navbar";
import TreeBranch from "./ui/TreeBranch";

// Sample data with more details for the modal
const initialEvents = [
  {
    id: 1,
    title: "Grandma Clara Born",
    icon: "🎂",
    year: "1950",
    description: "The matriarch of our family begins her journey.",
  },
  {
    id: 2,
    title: "Parents' Wedding",
    icon: "💍",
    year: "1985",
    description: "A beautiful union that started a new chapter.",
  },
  {
    id: 3,
    title: "You Were Born",
    icon: "👶",
    year: "2004",
    description: "And then you came along, bringing so much joy!",
  },
  {
    id: 4,
    title: "Graduated University",
    icon: "🎓",
    year: "2026",
    description: "A proud day marking years of hard work and dedication.",
  },
  {
    id: 5,
    title: "First Home",
    icon: "🏡",
    year: "2032",
    description: "Putting down roots and building a future.",
  },
];

export default function Gallery() {
  const [petals, setPetals] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  return (
    <>
      <Navbar />
      <div className="timeline-container">
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
        <TreeBranch className="timeline-trunk"/>

        {/* Events blooming from the trunk */}
        <div className="timeline-events">
          {initialEvents.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={event.id}
                className={`timeline-event ${isLeft ? "left" : "right"}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                onClick={() => setSelectedEvent(event)}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <span className="modal-icon">{selectedEvent.icon}</span>
                <h2>{selectedEvent.title}</h2>
                <h4>{selectedEvent.year}</h4>
                <p>{selectedEvent.description}</p>
                <button onClick={() => setSelectedEvent(null)}>Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
