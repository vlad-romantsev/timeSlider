import React from "react";

const LeftArrow = () => {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "rotate(180deg)" }}
    >
      <path d="M1 1L6 6L1 11" stroke="#3877EE" strokeWidth="2" />
    </svg>
  );
};

export default LeftArrow;