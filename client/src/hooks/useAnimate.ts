import { useState, useEffect } from 'react';

import { keyframes, Keyframes } from '@emotion/react';

export interface Animation {
  type: 'fadeIn' | 'fadeOut' | 'alert' | 'showAlarm' | 'closeAlarm';
  callback?: () => void;
  time?: number;
}
type Return = [Keyframes | undefined, React.Dispatch<React.SetStateAction<Animation | undefined>>];

const useAnimate = (): Return => {
  const [animation, setAnimation] = useState<Animation>();

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(
        () => {
          if (animation.callback) animation.callback();
        },
        animation.time ? animation.time : 300,
      );

      return () => {
        clearTimeout(timer);
      };
    }
  }, [animation]);
  return [animation?.type ? ANIMATE_TYPE[animation.type] : undefined, setAnimation];
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
