import { useState, useEffect, RefObject } from 'react';

type AnimationType = 'fadeIn' | 'fadeOut' | 'alert' | 'showAlarm' | 'closeAlarm';

interface Props {
  type: AnimationType;
  time?: number;
}

const useAnimate = ({ type, time = 2000 }: Props) => {
  const [animation, setAnimation] = useState({ ...ANIMATE_TYPE[type], animationDuration: time });
  const handleAnimation = (newType: AnimationType, newTime?: number) => {
    setAnimation({ ...ANIMATE_TYPE[newType], animationDuration: newTime ? newTime : time });
  };

  return [animation, handleAnimation];
};

const ANIMATE_TYPE = {
  fadeOut: { opacity: [1, 0], transform: ['translateY(0)', 'translateY(10px)'] },
  fadeIn: { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0)'] },
  alert: {
    opacity: [0, 1, 1, 0],
    transform: ['translateY(-10px)', 'translateY(0)', 'translateY(0)', 'translateY(-10px)'],
    offset: [0, 0.05, 0.95, 1.0],
  },
  showAlarm: { opacity: [0, 1], transform: ['translateY(-50px)', 'translateY(0px)'] },
  closeAlarm: { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-50px)'] },
};

export default useAnimate;
