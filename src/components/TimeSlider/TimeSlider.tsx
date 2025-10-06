import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  const [baseAngle, setBaseAngle] = useState(-90 + (360 / segments.length) / 2);
  const [animatedStartYear, setAnimatedStartYear] = useState(segments[0]?.startYear || 0);
  const [animatedEndYear, setAnimatedEndYear] = useState(segments[0]?.endYear || 0);
  const baseAngleRef = useRef({ current: -90 + (360 / segments.length) / 2 });
  const startYearRef = useRef({ current: segments[0]?.startYear || 0 });
  const endYearRef = useRef({ current: segments[0]?.endYear || 0 });

  const count = segments.length;
  const angleStep = 360 / count;
  const initialBaseAngleDeg = -90 + angleStep / 2;
  const circleRef = useRef<HTMLDivElement>(null);

  const centerX = SLIDER_CENTER.x;
  const centerY = SLIDER_CENTER.y;
  const radiusX = SLIDER_RADIUS_X;
  const radiusY = SLIDER_RADIUS_Y;

  const activeSegment = segments[activeIndex];

  const segmentPositions = useMemo(() => {
    return segments.map((_, i) => {
      const angleDeg = baseAngle + i * angleStep;
      const angleRad = (angleDeg * Math.PI) / 180;
      return {
        x: centerX + radiusX * Math.cos(angleRad),
        y: centerY + radiusY * Math.sin(angleRad)
      };
    });
  }, [segments, baseAngle, angleStep, centerX, centerY, radiusX, radiusY]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
    setClickedIndex(null);
  }, [count]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    setClickedIndex(null);
  }, [count]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
    setClickedIndex(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      setActiveIndex((prev) => (prev + 1) % count);
      setClickedIndex(null);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      setActiveIndex((prev) => (prev - 1 + count) % count);
      setClickedIndex(null);
      e.preventDefault();
    }
  }, [count]);

  const animateYears = useCallback((newStartYear: number, newEndYear: number) => {
    gsap.to(startYearRef.current, {
      current: newStartYear,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        setAnimatedStartYear(Math.round(startYearRef.current.current));
      },
    });

    gsap.to(endYearRef.current, {
      current: newEndYear,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        setAnimatedEndYear(Math.round(endYearRef.current.current));
      },
    });
  }, []);

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
        setBaseAngle(baseAngleRef.current.current);
      },
    });
  }, [activeIndex, angleStep, initialBaseAngleDeg]);

  useEffect(() => {
    const activeSegment = segments[activeIndex];
    if (activeSegment) {
      animateYears(activeSegment.startYear, activeSegment.endYear);
    }
  }, [activeIndex, segments, animateYears]);

  if (segments.length === 0) {
    return <div>No segments provided</div>;
  }
  
  if (segments.length < 2 || segments.length > 6) {
    return <div>Invalid number of segments. Must be between 2 and 6.</div>;
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
              onDotClick={handleDotClick}
            />
          </div>
          <div 
            className="time-circle" 
            ref={circleRef}
            role="radiogroup"
            aria-label="Выбор временного сегмента"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div className="circle-line" />
            <div className="circle-years">
              <span className="year-left">{animatedStartYear}</span>
              <span className="year-right">{animatedEndYear}</span>
            </div>

            {segments.map((segment, i) => {
              const position = segmentPositions[i];

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
                  x={position.x}
                  y={position.y}
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
