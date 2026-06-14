"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ANALYSIS_STORAGE_KEY,
  type AnalysisCategory,
  type AnalysisResult,
  formatAnalysisLabel,
  sampleAnalysis,
} from "@/lib/skinstricAnalysis";

type CategoryId = AnalysisCategory;

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

const CATEGORY_LABELS: Record<CategoryId, string> = {
  race: "RACE",
  age: "AGE",
  sex: "SEX",
};

const CATEGORY_ORDER: CategoryId[] = ["race", "age", "sex"];

function buildCategoryData(analysis: AnalysisResult): CategoryConfig[] {
  return CATEGORY_ORDER.map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
    options: Object.entries(analysis[id]).map(([optionId, value]) => ({
      id: optionId,
      label: formatAnalysisLabel(optionId),
      value,
    })),
  }));
}

function getInitialSelections(categories: CategoryConfig[]) {
  return categories.reduce(
    (selections, category) => {
      const highest = [...category.options].sort((a, b) => b.value - a.value)[0];
      selections[category.id] = highest.id;
      return selections;
    },
    {} as Record<CategoryId, string>,
  );
}

function formatPercent(value: number, decimals = 0) {
  return `${(value * 100).toFixed(decimals)}%`;
}

function getHeroTitle(categoryId: CategoryId, label: string) {
  if (categoryId === "age") {
    return `${label} y.o.`;
  }

  return label;
}

const fallbackCategoryData = buildCategoryData(sampleAnalysis);

export default function SummaryDemographics() {
  const router = useRouter();
  const [categoryData, setCategoryData] =
    useState<CategoryConfig[]>(fallbackCategoryData);
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("race");
  const [selections, setSelections] = useState<Record<CategoryId, string>>(() =>
    getInitialSelections(fallbackCategoryData),
  );

  useEffect(() => {
    let isMounted = true;
    const storedAnalysis = localStorage.getItem(ANALYSIS_STORAGE_KEY);
    if (!storedAnalysis) return undefined;

    queueMicrotask(() => {
      if (!isMounted) return;

      try {
        const parsedAnalysis = JSON.parse(storedAnalysis) as AnalysisResult;
        const nextCategoryData = buildCategoryData(parsedAnalysis);

        setCategoryData(nextCategoryData);
        setSelections(getInitialSelections(nextCategoryData));
        setActiveCategoryId("race");
      } catch {
        localStorage.removeItem(ANALYSIS_STORAGE_KEY);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategory = categoryData.find(
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
    setSelections(getInitialSelections(categoryData));
  };

  return (
    <>
      <main className="summary__main">
        <section className="summary__tiles" aria-label="Demographic groups">
          {categoryData.map((category) => {
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
                  <span>{formatPercent(option.value, 2)}</span>
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
      <button
        className="confirm"
        id="confirm__button"
        type="button"
        onClick={() => router.push("/")}
      >
        RESTART
      </button>
    </>
  );
}
