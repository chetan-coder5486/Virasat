import React from 'react';

const TreeBranch = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 1000"
      preserveAspectRatio="none" // This is crucial to allow vertical stretching
    >
      <path
        d="M25 0 C20 150, 30 250, 25 350 S20 450, 25 550 C30 650, 20 750, 25 850 S30 950, 25 1000"
        fill="currentColor" // Use currentColor to be styled by CSS
        stroke="#4d3b32"    // A slightly darker stroke for definition
        strokeWidth="2"
      />
    </svg>
  );
};

export default TreeBranch;