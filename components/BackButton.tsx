"use client";

import { useRouter } from "next/navigation";
import DiamondButton from "./DiamondButton";

type BackButtonProps = {
  className?: string;
  fallbackHref?: string;
};

export default function BackButton({
  className = "",
  fallbackHref = "/",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <DiamondButton
      type="button"
      className={`back-button ${className}`}
      onClick={handleBack}
    >
      BACK
    </DiamondButton>
  );
}
