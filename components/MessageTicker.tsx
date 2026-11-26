
"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Good morning. Thanks for being here.",
  "Every conversation makes a difference.",
  "A little encouragement goes a long way.",
  "Thanks for taking the time to connect.",
  "Your time and effort are appreciated.",
  "One day at a time. Keep it going.",
];

const HOLD_MS = 3000;
const SLIDE_MS = 600;

export default function MessageTicker() {
  const slides = [...MESSAGES, MESSAGES[0]];
  const lastIndex = slides.length - 1;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => current + 1);
    }, HOLD_MS + SLIDE_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (index !== lastIndex) return;

    const timer = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [index, lastIndex]);

  useEffect(() => {
    if (animate) return;

    let inner = 0;

    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimate(true));
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="mb-3 text-base font-semibold text-black sm:text-lg">
        Message for You ^^
      </h3>

      <div className="h-16 overflow-hidden rounded-md border border-gray-200 bg-white sm:h-20">
        <div
          className={`ticker-track flex h-full ${
            animate
              ? "transition-transform duration-[600ms] ease-in-out"
              : ""
          }`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((message, slideIndex) => (
            <div
              key={slideIndex}
              aria-hidden={slideIndex !== index}
              className="flex h-full w-full shrink-0 items-center justify-start px-5 text-left text-sm font-medium text-black sm:px-6 sm:text-base"
            >
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
