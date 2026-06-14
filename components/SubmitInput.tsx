"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DiamondButton from "./DiamondButton";

const submitSteps = [
  { label: "CLICK TO TYPE", placeholder: "Introduce Yourself" },
  { label: "WHERE ARE YOU FROM?", placeholder: "your city name" },
];

export default function SubmitInput() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"typing" | "processing" | "complete">(
    "typing",
  );
  const answersRef = useRef<string[]>([]);

  const currentStep = submitSteps[step];

  useEffect(() => {
    if (status !== "processing") return;

    const processingTimer = window.setTimeout(() => {
      setStatus("complete");
    }, 1600);

    return () => window.clearTimeout(processingTimer);
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const answer = inputValue.trim();
    if (!answer || status !== "typing") return;

    answersRef.current[step] = answer;
    setInputValue("");

    if (step === submitSteps.length - 1) {
      setStatus("processing");
      return;
    }

    setStep((prevStep) => prevStep + 1);
  };

  if (status === "processing") {
    return (
      <div className="submit__input-processing" aria-live="polite">
        <p className="submit__processing-text">Processing submission</p>
        <div className="submit__processing-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (status === "complete") {
    return (
      <div className="submit__input-complete" aria-live="polite">
        <p className="input__eyebrow">THANK YOU!</p>
        <h1 className="submit__input-message">Proceed for the next step</h1>
        <DiamondButton
          type="button"
          className="submit__proceed-button"
          iconSide="right"
          onClick={() => router.push("/analyzing")}
        >
          PROCEED
        </DiamondButton>
      </div>
    );
  }

  return (
    <form className="submit__input-form" onSubmit={handleSubmit}>
      <p className="input__eyebrow">{currentStep.label}</p>
      <h1 className="submit__input-heading">
        <input
          key={step}
          className="submit__input"
          type="text"
          value={inputValue}
          placeholder={currentStep.placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          aria-label={currentStep.placeholder}
        />
      </h1>
    </form>
  );
}
