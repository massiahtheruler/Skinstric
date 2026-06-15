"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Rectangle from "../components/Rectangle";
import DiamondButton from "@/components/DiamondButton";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleLineOneRef = useRef<HTMLSpanElement>(null);
  const titleLineTwoRef = useRef<HTMLSpanElement>(null);
  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);
  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (
      !heroRef.current ||
      !titleRef.current ||
      !titleLineOneRef.current ||
      !titleLineTwoRef.current ||
      !leftStackRef.current ||
      !rightStackRef.current ||
      !leftButtonRef.current ||
      !rightButtonRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const title = titleRef.current;
      const lineOne = titleLineOneRef.current;
      const lineTwo = titleLineTwoRef.current;
      const leftStack = leftStackRef.current;
      const rightStack = rightStackRef.current;
      const leftButton = leftButtonRef.current;
      const rightButton = rightButtonRef.current;

      if (
        !title ||
        !lineOne ||
        !lineTwo ||
        !leftStack ||
        !rightStack ||
        !leftButton ||
        !rightButton
      ) {
        return;
      }

      const leftLines = gsap.utils.toArray<SVGElement>(
        ".home__diamond-stack--left .diamond-stack__line",
      );
      const rightLines = gsap.utils.toArray<SVGElement>(
        ".home__diamond-stack--right .diamond-stack__line",
      );
      const leftExtraLines = leftLines.slice(1);
      const rightExtraLines = rightLines.slice(1);

      gsap.set([leftExtraLines, rightExtraLines], { autoAlpha: 0 });
      gsap.set([leftStack, rightStack, leftButton, rightButton], {
        autoAlpha: 1,
      });
      gsap.set(title, { x: 0, autoAlpha: 0 });
      gsap.set([lineOne, lineTwo], { x: 0 });

      gsap.to(title, {
        autoAlpha: 1,
        delay: 0.8,
        duration: 2.2,
        ease: "sine.out",
      });

      const reset = () => {
        gsap.to([leftExtraLines, rightExtraLines], {
          autoAlpha: 0,
          duration: 0.22,
          overwrite: true,
        });
        gsap.to([leftStack, rightStack, leftButton, rightButton], {
          autoAlpha: 1,
          duration: 0.24,
          overwrite: true,
        });
        gsap.to(title, {
          x: 0,
          duration: 0.55,
          ease: "sine.inOut",
          overwrite: true,
        });
        gsap.to([lineOne, lineTwo], {
          x: 0,
          duration: 0.42,
          ease: "sine.inOut",
          stagger: 0.06,
          overwrite: true,
        });
      };

      const showLeft = () => {
        gsap.to([rightStack, rightButton], {
          autoAlpha: 0,
          duration: 0.24,
          overwrite: true,
        });
        gsap.to(leftExtraLines, {
          autoAlpha: (index) => (index === 0 ? 0.45 : 0.24),
          duration: 0.26,
          stagger: 0.08,
          overwrite: true,
        });
        gsap.to(title, {
          x: 400,
          duration: 0.72,
          ease: "sine.inOut",
          overwrite: true,
        });
        gsap.to(lineOne, {
          x: 24,
          duration: 0.5,
          ease: "sine.inOut",
          delay: 0.05,
          overwrite: true,
        });
        gsap.to(lineTwo, {
          x: 160,
          duration: 0.55,
          ease: "sine.inOut",
          delay: 0.12,
          overwrite: true,
        });
      };

      const showRight = () => {
        gsap.to([leftStack, leftButton], {
          autoAlpha: 0,
          duration: 0.24,
          overwrite: true,
        });
        gsap.to(rightExtraLines, {
          autoAlpha: (index) => (index === 0 ? 0.45 : 0.24),
          duration: 0.26,
          stagger: 0.08,
          overwrite: true,
        });
        gsap.to(title, {
          x: -400,
          duration: 0.72,
          ease: "sine.inOut",
          overwrite: true,
        });
        gsap.to(lineOne, {
          x: -24,
          duration: 0.5,
          ease: "sine.inOut",
          delay: 0.05,
          overwrite: true,
        });
        gsap.to(lineTwo, {
          x: -160,
          duration: 0.55,
          ease: "sine.inOut",
          delay: 0.12,
          overwrite: true,
        });
      };

      leftButton.addEventListener("mouseenter", showLeft);
      leftButton.addEventListener("focus", showLeft);
      leftButton.addEventListener("mouseleave", reset);
      leftButton.addEventListener("blur", reset);

      rightButton.addEventListener("mouseenter", showRight);
      rightButton.addEventListener("focus", showRight);
      rightButton.addEventListener("mouseleave", reset);
      rightButton.addEventListener("blur", reset);

      return () => {
        leftButton.removeEventListener("mouseenter", showLeft);
        leftButton.removeEventListener("focus", showLeft);
        leftButton.removeEventListener("mouseleave", reset);
        leftButton.removeEventListener("blur", reset);

        rightButton.removeEventListener("mouseenter", showRight);
        rightButton.removeEventListener("focus", showRight);
        rightButton.removeEventListener("mouseleave", reset);
        rightButton.removeEventListener("blur", reset);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <main className="home">
        <Header showCodeButton={true} />

        <section className="home__hero relative" ref={heroRef}>
          <div
            className="diamond-stack home__diamond-stack home__diamond-stack--left"
            ref={leftStackRef}
          >
            <Rectangle
              className="diamond-stack__line diamond-stack__line--one"
              dashed
            />
            <Rectangle
              className="diamond-stack__line diamond-stack__line--two"
              dashed
            />
            <Rectangle
              className="diamond-stack__line diamond-stack__line--three"
              dashed
            />
          </div>
          <DiamondButton
            className="home__cta home__cta--left"
            ref={leftButtonRef}
          >
            DISCOVER A.I.
          </DiamondButton>
          <h1 className="home__title" ref={titleRef}>
            <span
              className="home__title-line home__title-line--one"
              ref={titleLineOneRef}
            >
              Sophisticated
            </span>
            <span
              className="home__title-line home__title-line--two"
              ref={titleLineTwoRef}
            >
              skincare
            </span>
          </h1>
          <div
            className="diamond-stack home__diamond-stack home__diamond-stack--center"
            aria-hidden="true"
          >
            <Rectangle
              className="diamond-stack__line diamond-stack__line--center-one"
              dashed
            />
            <Rectangle
              className="diamond-stack__line diamond-stack__line--center-two"
              dashed
            />
          </div>
          <div
            className="diamond-stack home__diamond-stack home__diamond-stack--right"
            ref={rightStackRef}
          >
            <Rectangle
              className="diamond-stack__line diamond-stack__line--one"
              dashed
            />
            <Rectangle
              className="diamond-stack__line diamond-stack__line--two"
              dashed
            />
            <Rectangle
              className="diamond-stack__line diamond-stack__line--three"
              dashed
            />
          </div>
          <DiamondButton
            className="home__cta home__cta--right"
            iconSide="right"
            ref={rightButtonRef}
            onClick={() => router.push("/submit")}
          >
            TAKE TEST
          </DiamondButton>
          <DiamondButton
            className="home__cta home__cta--center"
            iconSide="right"
            onClick={() => router.push("/submit")}
          >
            ENTER EXPERIENCE
          </DiamondButton>
          <p className="home__description">
            Skinstric developed an A.I. that creates a highly-personalised
            routine tailored to what your skin needs.
          </p>
        </section>
      </main>
    </div>
  );
}
