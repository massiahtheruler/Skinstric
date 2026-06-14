"use client";

import { type CSSProperties, useMemo, useState } from "react";

type CategoryId = "race" | "age" | "sex";

type DemographicOption = {
  id: string;
  label: string;
  value: number;
};

type CategoryConfig = {
  id: CategoryId;
  label: string;
  options: DemographicOption[];
};

const DEMOGRAPHIC_DATA: CategoryConfig[] = [
  {
    id: "race",
    label: "RACE",
    options: [
      { id: "black", label: "Black", value: 0.11956584717786628 },
      { id: "white", label: "White", value: 0.1280179046276461 },
      {
        id: "southeast-asian",
        label: "Southeast Asian",
        value: 0.06297961651829671,
      },
      { id: "south-asian", label: "South Asian", value: 0.1425984353728242 },
      {
        id: "latino-hispanic",
        label: "Latino Hispanic",
        value: 0.0619650872094126,
      },
      { id: "east-asian", label: "East Asian", value: 0.2525825951799374 },
      {
        id: "middle-eastern",
        label: "Middle Eastern",
        value: 0.23229411391401664,
      },
    ],
  },
  {
    id: "age",
    label: "AGE",
    options: [
      { id: "20-29", label: "20-29", value: 0.031678993030692736 },
      { id: "30-39", label: "30-39", value: 0.14951751927400894 },
      { id: "40-49", label: "40-49", value: 0.21423285073736906 },
      { id: "10-19", label: "10-19", value: 0.060884420054723574 },
      { id: "50-59", label: "50-59", value: 0.14185781411091578 },
      { id: "3-9", label: "3-9", value: 0.11754071465957916 },
      { id: "60-69", label: "60-69", value: 0.0640062076182385 },
      { id: "70+", label: "70+", value: 0.10014548458462194 },
      { id: "0-2", label: "0-2", value: 0.12013599592985022 },
    ],
  },
  {
    id: "sex",
    label: "SEX",
    options: [
      { id: "male", label: "Male", value: 0.520499217733165 },
      { id: "female", label: "Female", value: 0.47950078226683496 },
    ],
  },
];

const INITIAL_SELECTIONS: Record<CategoryId, string> = {
  race: "east-asian",
  age: "20-29",
  sex: "female",
};

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getHeroTitle(categoryId: CategoryId, label: string) {
  if (categoryId === "age") {
    return `${label} y.o.`;
  }

  return label;
}

export default function SummaryDemographics() {
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("race");
  const [selections, setSelections] =
    useState<Record<CategoryId, string>>(INITIAL_SELECTIONS);

  const activeCategory = DEMOGRAPHIC_DATA.find(
    (category) => category.id === activeCategoryId,
  )!;

  const sortedOptions = useMemo(
    () => [...activeCategory.options].sort((a, b) => b.value - a.value),
    [activeCategory],
  );

  const activeOption =
    activeCategory.options.find(
      (option) => option.id === selections[activeCategoryId],
    ) ?? sortedOptions[0];

  const meterValue = Math.round(activeOption.value * 100);
  const circumference = 2 * Math.PI * 174;
  const strokeOffset = circumference * (1 - meterValue / 100);

  const handleReset = () => {
    setActiveCategoryId("race");
    setSelections(INITIAL_SELECTIONS);
  };

  return (
    <>
      <main className="summary__main">
        <section className="summary__tiles" aria-label="Demographic groups">
          {DEMOGRAPHIC_DATA.map((category) => {
            const selectedOption = category.options.find(
              (option) => option.id === selections[category.id],
            )!;
            const isActive = category.id === activeCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                className={`demo__tile ${category.id}__tile ${
                  isActive ? "demo__tile--active" : ""
                }`}
                onClick={() => setActiveCategoryId(category.id)}
              >
                <span>{selectedOption.label.toUpperCase()}</span>
                <span>{category.label}</span>
              </button>
            );
          })}
        </section>

        <section className="demo__hero" aria-live="polite">
          <h2 className="demo__hero-title">
            {getHeroTitle(activeCategoryId, activeOption.label)}
          </h2>
        </section>

        <div
          className="summary__meter"
          style={
            {
              "--meter-circumference": circumference,
              "--meter-offset": strokeOffset,
            } as CSSProperties
          }
          aria-label={`${activeOption.label} confidence ${formatPercent(
            activeOption.value,
          )}`}
        >
          <svg
            className="summary__meter-ring"
            width="384"
            height="384"
            viewBox="0 0 384 384"
            aria-hidden="true"
          >
            <circle
              className="summary__meter-track"
              cx="192"
              cy="192"
              r="174"
            />
            <circle
              className="summary__meter-progress"
              cx="192"
              cy="192"
              r="174"
            />
          </svg>
          <span className="summary__meter-value">
            {formatPercent(activeOption.value)}
          </span>
        </div>

        <section
          className="demo__options"
          aria-label={`${activeCategory.label} options`}
        >
          <div className="demo__options-header">
            <span>{activeCategory.label}</span>
            <span>A.I. CONFIDENCE</span>
          </div>

          <div className="demo__option-list">
            {sortedOptions.map((option) => {
              const isActive = option.id === activeOption.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`demo__option ${
                    isActive ? "demo__option--active" : ""
                  }`}
                  onClick={() =>
                    setSelections((current) => ({
                      ...current,
                      [activeCategoryId]: option.id,
                    }))
                  }
                >
                  <span className="demo__option-name">
                    <span className="demo__option-diamond" aria-hidden="true" />
                    {option.label}
                  </span>
                  <span>{formatPercent(option.value)}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <div className="summary__statement">
        If A.I. estimate is wrong, select the correct one.
      </div>
      <button
        className="reset"
        id="reset__button"
        type="button"
        onClick={handleReset}
      >
        RESET
      </button>
      <button className="confirm" id="confirm__button" type="button">
        HOME
      </button>
    </>
  );
}
