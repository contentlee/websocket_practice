import { ChangeEvent, HTMLAttributes, useRef } from "react";
import { palette } from "@utils/palette";

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea = ({ label, ...props }: Props) => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const handleResize = (e: ChangeEvent) => {
    e.preventDefault();
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = textarea.current.scrollHeight + "px";
    }
  };
  return (
    <div
      css={{
        position: "relative",
        display: "flex",
        width: "100%",
        maxWidth: "350px",
        boxSizing: "border-box",
        border: `1.5px solid ${palette.main.blk}`,
        backgroundColor: palette.background,
        color: palette.main.blk,
      }}
    >
      <textarea
        ref={textarea}
        rows={1}
        css={{
          minHeight: "42px",
          padding: "20px",
          outline: "none",
          border: "none",
          boxSizing: "border-box",
          fontSize: "14px",
          fontFamily: "pretendard",
          resize: "none",
          background: palette.background,
        }}
        {...props}
        onChange={handleResize}
      ></textarea>
      <label
        css={{
          position: "absolute",

          left: "10px",
          top: "-7px",
          padding: "0 4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          background: palette.background,
        }}
      >
        {label}
      </label>
    </div>
  );
};

export default TextArea;
