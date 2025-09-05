import React from 'react';
import './styles/main.scss'
import TimeSlider from './components/TimeSlider/TimeSlider';
import { timeSegments } from './context';

const App = () => {
  return (
    <div>
      <TimeSlider segments={timeSegments} id="slider1"/>
    </div>
  );
};

export default App;