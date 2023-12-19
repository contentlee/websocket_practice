import { useState, useEffect } from 'react';

type AnimationType = 'fadeIn' | 'fadeOut' | 'alert' | 'showAlarm' | 'closeAlarm';
type Animation = [AnimationType, () => void, number];

type Return = [
  (ref: React.MutableRefObject<HTMLElement>) => void,
  (type: AnimationType, callback?: () => void, time?: number) => void,
];

const useAnimate = (): Return => {
  const [ref, setRef] = useState<React.MutableRefObject<HTMLElement>>();

  const handleChangeRef = (ref: React.MutableRefObject<HTMLElement>) => {
    setRef(ref);
  };

  const [animation, setAnimation] = useState<Animation>();

  const handleChangeAnimationState = (type: AnimationType, callback = () => {}, time = 300) => {
    setAnimation([type, callback, time]);
  };

  const handleChangeElementStyle = (type: AnimationType, time: number = 300) => {
    const keyframe: PropertyIndexedKeyframes = ANIMATE_TYPE[type];
    const timeline: KeyframeAnimationOptions = {
      duration: time - 100 / 1000,
      fill: 'forwards',
      easing: 'ease-out',
    };
    if (!!ref!.current) ref!.current.animate(keyframe, timeline);
  };

  useEffect(() => {
    if (ref && animation) {
      const [type, callback, time] = animation;
      handleChangeElementStyle(type, time);

      const timer = setTimeout(callback, time);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [ref, animation]);

  return [handleChangeRef, handleChangeAnimationState];
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
