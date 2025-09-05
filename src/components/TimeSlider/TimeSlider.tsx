import React, { useState, useEffect, useRef, useReducer } from "react";
import EventSlider from "../EventSlider/EventSlider";
import "./TimeSlider.scss";
import gsap from "gsap";
import Segment from "./Segment";
import NavigationButtons from "./NavigationButtons";
import { TimeSegment } from "../../types";
import { SLIDER_RADIUS_X, SLIDER_RADIUS_Y, SLIDER_CENTER } from "../../config/constants";

interface TimeSliderProps {
  segments: TimeSegment[];
  id?: string;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ 
  segments = [], 
  id = "time-slider" 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const count = segments.length;
  const angleStep = 360 / count;
  const initialBaseAngleDeg = -90 + angleStep / 2;
  const baseAngleRef = useRef({ current: initialBaseAngleDeg });
  const circleRef = useRef<HTMLDivElement>(null);

  const centerX = SLIDER_CENTER.x;
  const centerY = SLIDER_CENTER.y;
  const radiusX = SLIDER_RADIUS_X;
  const radiusY = SLIDER_RADIUS_Y;

  const activeSegment = segments[activeIndex];
  const startYear = segments[activeIndex]?.startYear;
  const endYear = segments[activeIndex]?.endYear;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
    setClickedIndex(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    setClickedIndex(null);
  };

  useEffect(() => {
    if (circleRef.current) {
      gsap.fromTo(
        circleRef.current.querySelector(".segment.active"),
        { scale: 0.5 },
        { scale: 1, duration: 0.3 }
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    const newBaseAngle = initialBaseAngleDeg - activeIndex * angleStep;

    gsap.to(baseAngleRef.current, {
      current: newBaseAngle,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        forceUpdate();
      },
    });
  }, [activeIndex, angleStep, initialBaseAngleDeg]);

  if (segments.length === 0) {
    return <div>No segments provided</div>;
  }

  return (
    <div className="time-slider-wrapper">
      <div className="axis-y"></div>
      <div className="horizontal-line"></div>
      <div className="border-wrapper"/>
      <div className="time-slider">
        <div className="time-slider-row">
          <div className="date-with-buttons-wrapper">
            <div className="historical-date-title">
              <p>Исторические даты</p>
            </div>
          </div>
          <div className="segment-with-buttons-wrapper">
            <p className="segment-on-buttons-title">
              0{activeIndex + 1}/0{count}
            </p>
            <NavigationButtons 
              activeIndex={activeIndex} 
              length={segments.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onDotClick={(i) => {
                setActiveIndex(i);
                setClickedIndex(null);
              }}
            />
          </div>
          <div 
            className="time-circle" 
            ref={circleRef}
            role="radiogroup"
            aria-label="Выбор временного сегмента"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                setActiveIndex((prev) => (prev + 1) % count);
                setClickedIndex(null);
                e.preventDefault();
              } else if (e.key === "ArrowLeft") {
                setActiveIndex((prev) => (prev - 1 + count) % count);
                setClickedIndex(null);
                e.preventDefault();
              }
            }}
          >
            <div className="circle-line" />
            <div className="circle-years">
              <span className="year-left">{startYear}</span>
              <span className="year-right">{endYear}</span>
            </div>

            {segments.map((segment, i) => {
              const angleDeg = baseAngleRef.current.current + i * angleStep;
              const angleRad = (angleDeg * Math.PI) / 180;

              const x = centerX + radiusX * Math.cos(angleRad);
              const y = centerY + radiusY * Math.sin(angleRad);

              return (
                <Segment 
                  key={segment.id}
                  index={i} 
                  segment={segment} 
                  activeIndex={activeIndex} 
                  hoveredIndex={hoveredIndex} 
                  setActiveIndex={setActiveIndex} 
                  setHoveredIndex={setHoveredIndex}
                  clickedIndex={clickedIndex}
                  setClickedIndex={setClickedIndex}
                  x={x}
                  y={y}
                  sliderId={id}
                />
              );
            })}
          </div>
        </div>

        <EventSlider events={activeSegment.events} />
      </div>
    </div>
  );
};

export default TimeSlider;
