import React from "react";
import LeftArrow from "../EventSlider/icons/LeftArrow";
import RightArrow from "../EventSlider/icons/RightArrow";

interface NavigationButtonsProps {
  activeIndex: number;
  length: number;
  onNext: () => void;
  onPrev: () => void;
  onDotClick: (index: number) => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activeIndex,
  length,
  onNext,
  onPrev,
  onDotClick
}) => {
  const opacityLeftArrow = activeIndex !== 0 ? 1 : 0.5;
  const opacityRightArrow = activeIndex !== length - 1 ? 1 : 0.5;

  return (
    <>
      <div className="buttons-wrapper">
        <button
          className="prev"
          onClick={onPrev}
          disabled={activeIndex === 0}
          aria-label="Предыдущий сегмент"
          style={{
            opacity: opacityLeftArrow,
            cursor: opacityLeftArrow === 1 ? "pointer" : "auto",
          }}
        >
          <LeftArrow />
        </button>
        <button
          className="next"
          onClick={onNext}
          disabled={activeIndex === length - 1}
          aria-label="Следующий сегмент"
          style={{
            opacity: opacityRightArrow,
            cursor: opacityRightArrow === 1 ? "pointer" : "auto",
          }}
        >
          <RightArrow />
        </button>
      </div>
      <div className="mobile-nav-wrapper">
          <div className="arrows-block">
            <button
              className="nav-arrow"
              onClick={onPrev}
              disabled={activeIndex === 0}
              aria-label="Предыдущий"
            >
              <LeftArrow />
            </button>
            <button
              className="nav-arrow"
              onClick={onNext}
              disabled={activeIndex === length - 1}
              aria-label="Следующий"
            >
              <RightArrow />
            </button>
          </div>
          <div className="dots-block">
            {Array.from({ length }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => onDotClick(index)}
                aria-label={`Go to segment ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
      </div>
    </>

  );
};

export default NavigationButtons;
