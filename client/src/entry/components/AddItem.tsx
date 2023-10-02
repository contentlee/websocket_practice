import { HTMLAttributes } from "react";

import AddIcon from "@assets/add_circle_icon.svg";

import { Icon } from "@components";
import { palette } from "@utils/palette";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AddItem = ({ ...props }: Props) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
      {...props}
    >
      <hr
        css={{
          display: "flex",
          flex: "auto",
          height: "0.5px",
          background: palette.gray.gray83,
          border: "none",
        }}
      />
      <Icon src={AddIcon}></Icon>
      <hr
        css={{
          display: "flex",
          flex: "auto",
          height: "0.5px",
          background: palette.gray.gray83,
          border: "none",
        }}
      />
    </div>
  );
};

export default AddItem;
