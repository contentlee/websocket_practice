import { keyframes } from '@emotion/react';

const mkBorderColor = (p: number, c: number[], op: number[]) => {
  return `${p}% { border-color: rgba(${c[0]},${c[1]},${c[2]},${op[0]}) rgba(${c[0]},${c[1]},${c[2]},${op[1]}) rgba(${c[0]},${c[1]},${c[2]},${op[2]}) rgba(${c[0]},${c[1]},${c[2]},${op[3]})} `;
};

const mkKeyframes = (color: number[][]) => {
  const set = Math.floor(100 / color.length);
  const per = Math.ceil(set / 4);

  const part = (p: number, c: number[], gr: number) =>
    mkBorderColor(p, c, [0.15, 0.25, 0.35, 0.75]) +
    mkBorderColor(p + gr, c, [0.75, 0.15, 0.25, 0.35]) +
    mkBorderColor(p + gr * 2, c, [0.35, 0.75, 0.15, 0.25]) +
    mkBorderColor(p + gr * 3, c, [0.25, 0.35, 0.75, 0.15]);

  return color.reduce((prev, cur, i) => {
    return prev + part(set * i, cur, per);
  }, '');
};

const animate = keyframes`${mkKeyframes([
  [229, 208, 21],
  [195, 0, 0],
  [18, 126, 0],
  [0, 46, 214],
  [0, 0, 0],
])}`;

const Spinner = () => {
  return (
    <span
      css={{
        border: '24px solid',
        borderColor:
          'rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.25) rgba(0, 0, 0, 0.35) rgba(0, 0, 0, 0.75)',
        borderRadius: '50%',
        display: 'inline-block',
        boxSizing: 'border-box',
        animation: `${animate} 4s linear infinite`,
      }}
    ></span>
  );
};
export default Spinner;
