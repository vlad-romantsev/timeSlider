import React, { useRef, useEffect, useCallback } from "react";
import { TimeSegment } from "../../types";
import gsap from "gsap";

interface SegmentProps {
    index: number;
    segment: TimeSegment;
    activeIndex: number;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
    setActiveIndex: (index: number) => void;
    setClickedIndex: (index: number | null) => void;
    x: number;
    y: number;
    clickedIndex: number | null;
    sliderId?: string;
}

const Segment: React.FC<SegmentProps> = ({
    index,
    segment,
    activeIndex,
    hoveredIndex,
    setHoveredIndex,
    setActiveIndex,
    setClickedIndex,
    x,
    y,
    clickedIndex,
    sliderId = "",
}) => {
    const isActive = activeIndex === index;
    const isHovered = hoveredIndex === index;
    const isClicked = clickedIndex === index;

    const dotRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dotRef.current || !circleRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(dotRef.current, 
                { 
                    opacity: isHovered || isActive ? 0 : 1, 
                    duration: 0.3 
                });
            gsap.to(circleRef.current, 
                { 
                    scale: isHovered || isActive ? 1 : 0, 
                    opacity: isHovered || isActive ? 1 : 0, duration: 0.3 
                });
        });

        return () => ctx.revert(); 
    }, [isHovered, isActive]);

    const handleMouseEnter = useCallback(() => setHoveredIndex(index), [setHoveredIndex, index]);
    const handleMouseLeave = useCallback(() => setHoveredIndex(null), [setHoveredIndex]);
    const handleClick = useCallback(() => {
        setActiveIndex(index);
        setClickedIndex(isClicked ? null : index);
    }, [setActiveIndex, setClickedIndex, index, isClicked]);

    const popupPadding = isClicked ? 40 : 0;

    return (
        <button
            className={`segment ${isActive ? "active" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
            }
            }}
            style={{ left: x, top: y }}
            aria-label={`Сегмент ${segment.id}, годы ${segment.startYear}–${segment.endYear}`}
            aria-current={isActive ? "true" : "false"}
            role="radio"
            aria-checked={isActive}
            data-slider-id={sliderId}
        >
            <div 
                ref={dotRef} 
                className="dot" 
                style={{ opacity: isActive ? 0 : 0.5 }} 
                aria-hidden="true" 
            />
            <div 
                ref={circleRef} 
                className="circle-outline" 
                aria-hidden="true" 
            />

            {(isActive || isHovered) && (
                <div 
                    className="popup-wrapper" 
                    style={{ paddingLeft: popupPadding }}
                >
                    <div 
                        style={{ 
                            position: 'relative', 
                            display: 'flex', 
                            alignItems: 'center' 
                        }}
                    >
                        <div className="popup-id">{segment.id}</div>
                        {isClicked && 
                            <div 
                                className="category-label" 
                                style={{ marginLeft: 20 }}
                            >
                                {segment.category}
                            </div>
                        }
                    </div>
                </div>
            )}
        </button>
    );
};

export default React.memo(Segment, (prev, next) => {
    return (
        prev.index === next.index &&
        prev.activeIndex === next.activeIndex &&
        prev.hoveredIndex === next.hoveredIndex &&
        prev.clickedIndex === next.clickedIndex &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.segment.id === next.segment.id &&
        prev.segment.category === next.segment.category &&
        prev.segment.startYear === next.segment.startYear &&
        prev.segment.endYear === next.segment.endYear &&
        prev.sliderId === next.sliderId
    );
});
