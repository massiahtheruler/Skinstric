"use client";

import { useRouter } from "next/navigation";
import DiamondButton from "./DiamondButton";
import Rectangle from "./Rectangle";

export default function ThankYouPanel() {
  const router = useRouter();

  return (
    <>
      <main className="testing__main" aria-labelledby="testing-title">
        <span className="testing__diamond" aria-hidden="true">
          <Rectangle
            className="testing__diamond-line testing__diamond-line--one"
            dashed
            dashPattern="4 8"
          />
          <Rectangle
            className="testing__diamond-line testing__diamond-line--two"
            dashed
            dashPattern="4 8"
          />
          <Rectangle
            className="testing__diamond-line testing__diamond-line--three"
            dashed
            dashPattern="4 8"
          />
        </span>
        <div className="testing__copy">
          <h1 id="testing-title">Thank you!</h1>
          <p>Proceed for the next step</p>
        </div>
      </main>

      <DiamondButton
        type="button"
        className="testing__proceed-button"
        iconSide="right"
        onClick={() => router.push("/results")}
      >
        PROCEED
      </DiamondButton>
    </>
  );
}
