import { useState, useEffect, useRef } from 'react';

import { keyframes } from '@emotion/react';

type RefType<T> = T | null;

type AnimationType = 'fadeIn' | 'fadeOut' | 'alert' | 'showAlarm' | 'closeAlarm';
type Animation = [AnimationType, () => void, number];

type Return<T> = [
  React.MutableRefObject<RefType<T>>,
  (type: AnimationType, callback?: () => void, time?: number) => void,
];

const useAnimate = <T extends HTMLElement>(): Return<T> => {
  const ref = useRef<RefType<T>>(null);
  const [animation, setAnimation] = useState<Animation>();

  const handleChangeAnimationState = (type: AnimationType, callback = () => {}, time = 300) => {
    setAnimation([type, callback, time]);
  };

  const handleChangeElementStyle = (type: AnimationType, time: number) => {
    const str = ANIMATE_TYPE[type] + `${time - 100 / 1000}s forwards ease-out`;
    if (ref.current) ref.current.style.animation = str;
  };

  useEffect(() => {
    if (animation) {
      const [type, callback, time] = animation;

      handleChangeElementStyle(type, time);

      const timer = setTimeout(callback, time);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [animation]);

  return [ref, handleChangeAnimationState];
};

const ANIMATE_TYPE = {
  fadeOut: keyframes`
  0%{
   opacity: 1;
   transform: translateY(0);
  }
  100%{
   opacity: 0;
   transform: translateY(10px);
  }
 `,
  fadeIn: keyframes`
  0%{
   opacity: 0;
   transform: translateY(-10px);
  }
  100%{
   opacity: 1;
   transform: translateY(0);
  }
`,
  alert: keyframes`
  0%{
    opacity: 0;
    transform: translateY(-10px)
  }
  5%{
    opacity: 1;
    transform: translateY(0)
  }
  95%{
    opacity: 1;
    transform: translateY(0)
  }
  100%{
    opacity: 0;
    transform: translateY(-10px)
  }
`,
  showAlarm: keyframes`
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`,
  closeAlarm: keyframes`
0% {
  opacity: 1;
  transform: translateY(0px);
}
100% {
  opacity: 0;
  transform: translateY(-50px);
}
`,
};

export default useAnimate;
