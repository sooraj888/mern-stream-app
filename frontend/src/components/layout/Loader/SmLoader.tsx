import React from "react";
import "./loader.css";
export default function SmLoader({
  style,
  loaderStyle,
}: {
  style?: React.CSSProperties | undefined;
  loaderStyle?: React.CSSProperties | undefined;
}) {
  return (
    <div className="smLoader" style={style}>
      <div style={loaderStyle}></div>
    </div>
  );
}
