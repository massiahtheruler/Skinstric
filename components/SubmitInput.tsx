"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROFILE_STORAGE_KEY } from "@/lib/skinstricAnalysis";

const submitSteps = [
  { label: "CLICK TO TYPE", placeholder: "Introduce Yourself" },
  { label: "WHERE ARE YOU FROM?", placeholder: "your city name" },
];

export default function SubmitInput() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<"typing" | "processing">("typing");
  const [errorMessage, setErrorMessage] = useState("");
  const answersRef = useRef<string[]>([]);

  const currentStep = submitSteps[step];

  const isValidAnswer = (answer: string) =>
    answer.length > 0 && !/\d/.test(answer) && /^[a-zA-Z\s'.-]+$/.test(answer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const answer = inputValue.trim();
    if (status !== "typing") return;

    if (!isValidAnswer(answer)) {
      setErrorMessage("Use letters only here.");
      return;
    }

    answersRef.current[step] = answer;
    setInputValue("");
    setErrorMessage("");

    if (step === submitSteps.length - 1) {
      setStatus("processing");
      const [name, location] = answersRef.current;

      try {
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, location }),
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error ?? "Profile submission failed.");
        }

        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify({ name, location, response: data }),
        );

        window.setTimeout(() => {
          router.push("/analysis");
        }, 1200);
      } catch (error) {
        setStatus("typing");
        setStep(submitSteps.length - 1);
        setInputValue(location ?? "");
        setErrorMessage(
          error instanceof Error ? error.message : "Profile submission failed.",
        );
      }
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
      {errorMessage && (
        <p className="submit__input-error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
