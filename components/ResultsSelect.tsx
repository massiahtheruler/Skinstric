"use client";

import { useRouter } from "next/navigation";
import DiamondButton from "./DiamondButton";

const resultTiles = [
  {
    label: "DEMOGRAPHICS",
    className: "results-select__tile--top",
    enabled: true,
  },
  {
    label: "COSMETIC CONCERNS",
    className: "results-select__tile--left",
    enabled: false,
  },
  {
    label: "SKIN TYPE DETAILS",
    className: "results-select__tile--right",
    enabled: false,
  },
  {
    label: "WEATHER",
    className: "results-select__tile--bottom",
    enabled: false,
  },
];

export default function ResultsSelect() {
  const router = useRouter();

  return (
    <section className="results-select" aria-labelledby="results-select-title">
      <div className="results-select__copy">
        <h1 id="results-select-title">A.I. ANALYSIS</h1>
        <p>A.I. HAS ESTIMATED THE FOLLOWING.</p>
        <p>FIX ESTIMATED INFORMATION IF NEEDED.</p>
      </div>

      <div className="results-select__grid" aria-label="Analysis categories">
        <span className="results-select__outline" aria-hidden="true" />
        {resultTiles.map((tile) => (
          <button
            key={tile.label}
            type="button"
            className={`results-select__tile ${tile.className} ${
              tile.enabled ? "results-select__tile--enabled" : ""
            }`}
            aria-disabled={!tile.enabled}
            onClick={() => {
              if (tile.enabled) router.push("/results/demographics");
            }}
          >
            <span>{tile.label}</span>
          </button>
        ))}
      </div>

      <DiamondButton
        type="button"
        className="results-select__summary-button"
        iconSide="right"
        onClick={() => router.push("/summary")}
      >
        GET SUMMARY
      </DiamondButton>
    </section>
  );
}
