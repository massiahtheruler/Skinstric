import { forwardRef, type ButtonHTMLAttributes } from "react";
import TriangleIcon from "./TriangleIcon";

type DiamondButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconSide?: "left" | "right";
};

const DiamondButton = forwardRef<HTMLButtonElement, DiamondButtonProps>(
  function DiamondButton(
    { children, className = "", iconSide = "left", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={`diamond-button diamond-button--icon-${iconSide} ${className}`}
        {...props}
      >
        {iconSide === "left" && <TriangleIcon direction="left" />}
        <span className="diamond-button__text">{children}</span>
        {iconSide === "right" && <TriangleIcon direction="right" />}
      </button>
    );
  },
);

export default DiamondButton;
