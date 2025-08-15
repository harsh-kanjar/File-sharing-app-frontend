import React from "react";

export default function Card({ children }) {
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const resetTransform = () => {
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      className="w-full max-w-md rounded-3xl shadow-lg p-8 relative border border-white/20 transition-transform duration-150 ease-out will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        background: "rgba(216, 213, 213, 0.4)", // dark transparent background for readability
        backdropFilter: "blur(8px)", // soft blur only for the glass effect
        color: "white" // ensures text stays readable
      }}
    >
      {children}
    </div>
  );
}