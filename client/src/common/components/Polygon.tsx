import { palette } from "@utils/palette";

const Polygon = () => {
  return (
    <div
      css={{
        width: "0",
        height: "0",
        border: "9px solid transparent",
        borderTop: "none",
        borderBottom: "15px solid" + palette.point.red,
        boxSizing: "border-box",
      }}
    ></div>
  );
};

export default Polygon;
