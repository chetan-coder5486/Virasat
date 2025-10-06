import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Family.css"; // Dedicated CSS for Family Tree layout
import Navbar from "./shared/Navbar";

// Placeholder for profile images
const getProfileImage = (name) => {
  const seed = name.split(" ").join(""); // Simple unique seed
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&backgroundColor=c0a1b6,d1d1d1`;
};

// Sample Family Data (Hierarchical structure)
const familyData = [
  // Generation 1 (Grandparents)
  {
    id: "clara",
    name: "Clara Johnson",
    dob: "1950",
    relation: "Grandmother",
    spouse: "robert",
    parents: [],
    children: ["michael"],
    memoriesCount: 15,
  },
  {
    id: "robert",
    name: "Robert Johnson",
    dob: "1948",
    relation: "Grandfather",
    spouse: "clara",
    parents: [],
    children: ["michael"],
    memoriesCount: 12,
  },

  // Generation 2 (Parents)
  {
    id: "michael",
    name: "Michael Johnson",
    dob: "1975",
    relation: "Father",
    spouse: "sarah",
    parents: ["clara", "robert"],
    children: ["lily", "you"],
    memoriesCount: 20,
  },
  {
    id: "sarah",
    name: "Sarah Miller",
    dob: "1978",
    relation: "Mother",
    spouse: "michael",
    parents: [],
    children: ["lily", "you"],
    memoriesCount: 18,
  },

  // Generation 3 (Children)
  {
    id: "lily",
    name: "Lily Johnson",
    dob: "2002",
    relation: "Daughter",
    parents: ["michael", "sarah"],
    children: [],
    memoriesCount: 8,
  },
  {
    id: "you",
    name: "You (User)",
    dob: "2004",
    relation: "You",
    parents: ["michael", "sarah"],
    children: [],
    memoriesCount: 25,
  },
];

const Family = () => {
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const selectedPerson = familyData.find((p) => p.id === selectedPersonId);

  // Function to render connections (simplified, visually only)
  const renderConnections = () => {
    const connections = [];
    familyData.forEach((person) => {
      // Parents to Children
      person.children?.forEach((childId) => {
        connections.push({ from: person.id, to: childId, type: "child" });
      });
      // Spouse to Spouse (only once per couple)
      if (person.spouse && person.id < person.spouse) {
        // Prevent duplicate lines for spouses
        connections.push({
          from: person.id,
          to: person.spouse,
          type: "spouse",
        });
      }
    });

    // In a real implementation, you'd calculate precise SVG line coordinates.
    // Here, it's illustrative and visually handled by CSS positioning of nodes.
    return (
      <div className="connection-lines">
        {/* Placeholder for actual SVG lines if using a true diagram library */}
      </div>
    );
  };

  return (
    <>
    <Navbar/>
      <div className="family-tree-page-container">
        {/* Page Title */}
        <h1 className="page-title">Our Family Tree</h1>
        <p className="page-subtitle">
          Explore the roots and branches of our shared history.
        </p>

        {/* Tree Management Controls */}
        <div className="tree-controls">
          <button className="btn-add-member">
            <span className="text-xl mr-2">+</span> Add New Member
          </button>
        </div>

        {/* Main Family Tree Diagram Area */}
        <div className="family-tree-diagram">
          {renderConnections()} {/* Visually represents connections */}
          {/* Grandparents (Generation 1) */}
          <div className="generation generation-1">
            <motion.div
              className="person-node"
              onClick={() => setSelectedPersonId("clara")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={getProfileImage("Clara Johnson")}
                alt="Clara"
                className="profile-img"
              />
              <span className="person-name">Clara</span>
            </motion.div>
            <div className="spouse-line"></div>
            <motion.div
              className="person-node"
              onClick={() => setSelectedPersonId("robert")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img
                src={getProfileImage("Robert Johnson")}
                alt="Robert"
                className="profile-img"
              />
              <span className="person-name">Robert</span>
            </motion.div>
          </div>
          <div className="gen-connector"></div>{" "}
          {/* Visual connector between generations */}
          {/* Parents (Generation 2) */}
          <div className="generation generation-2">
            <motion.div
              className="person-node"
              onClick={() => setSelectedPersonId("michael")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <img
                src={getProfileImage("Michael Johnson")}
                alt="Michael"
                className="profile-img"
              />
              <span className="person-name">Michael</span>
            </motion.div>
            <div className="spouse-line"></div>
            <motion.div
              className="person-node"
              onClick={() => setSelectedPersonId("sarah")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <img
                src={getProfileImage("Sarah Miller")}
                alt="Sarah"
                className="profile-img"
              />
              <span className="person-name">Sarah</span>
            </motion.div>
          </div>
          <div className="gen-connector"></div>
          {/* Children (Generation 3) */}
          <div className="generation generation-3">
            <motion.div
              className="person-node"
              onClick={() => setSelectedPersonId("lily")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <img
                src={getProfileImage("Lily Johnson")}
                alt="Lily"
                className="profile-img"
              />
              <span className="person-name">Lily</span>
            </motion.div>
            <motion.div
              className="person-node"
              onClick={() => setSelectedPersonId("you")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <img
                src={getProfileImage("You (User)")}
                alt="You"
                className="profile-img"
              />
              <span className="person-name">You</span>
            </motion.div>
          </div>
        </div>

        {/* Sidebar for Person Details */}
        <AnimatePresence>
          {selectedPerson && (
            <motion.div
              className="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
            >
              <button
                className="sidebar-close-btn"
                onClick={() => setSelectedPersonId(null)}
              >
                &times;
              </button>
              <img
                src={getProfileImage(selectedPerson.name)}
                alt={selectedPerson.name}
                className="sidebar-profile-img"
              />
              <h2 className="sidebar-title">{selectedPerson.name}</h2>
              <p className="sidebar-detail">Born: {selectedPerson.dob}</p>
              <p className="sidebar-detail">
                Relation: {selectedPerson.relation}
              </p>
              <p className="sidebar-detail">
                Tagged in {selectedPerson.memoriesCount} memories.
              </p>

              <motion.button
                className="btn-view-memories"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  alert(`Navigating to memories for ${selectedPerson.name}...`)
                }
              >
                View All Memories
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Family;
