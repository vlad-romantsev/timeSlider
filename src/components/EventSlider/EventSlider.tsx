import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./EventSlider.scss";
import { HistoricalEvent } from "../../types";
import React, { useRef, useState } from "react";
import RightArrow from "./icons/RightArrow";
import LeftArrow from "./icons/LeftArrow";

interface EventSliderProps {
  events: HistoricalEvent[];
}

const EventSlider = ({ events }: EventSliderProps) => {
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [spaceBetween, setSpaceBetween] = useState(80);
  const [isEnd, setIsEnd] = useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setSpaceBetween(mql.matches ? 20 : 80);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  
  return (
    <div className="event-slider-container">
      <button 
        className="custom-nav prev" 
        ref={prevRef} 
        aria-label="Предыдущий слайд"
      >
        <LeftArrow />
      </button>
      <button 
        className="custom-nav next" 
        ref={nextRef} 
        aria-label="Следующий слайд"
      >
        <RightArrow />
      </button>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          const navigation = swiper.params.navigation;
          if (navigation && typeof navigation !== 'boolean') {
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
          }
        }}
        spaceBetween={spaceBetween}
        slidesPerView={"auto"}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          setIsEnd(swiper.isEnd);
        }}
      >
        {sortedEvents.map((event, index) => {
          const isActive =
            index === activeIndex || (isEnd && index === sortedEvents.length - 1);

          return (
            <SwiperSlide key={event.id}>
              <div className={`event-card ${isActive ? "active-slide" : "inactive-slide"}`}>
                <p className="year">{event.year}</p>
                <p className="description">{event.description}</p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default EventSlider;
