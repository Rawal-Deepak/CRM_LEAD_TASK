"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring } from "framer-motion";

export function useAnimatedCounter(target: number, duration = 0.4) {
  const spring = useSpring(target, { stiffness: 120, damping: 25, mass: 0.5 });
  const [display, setDisplay] = useState(Math.round(target));

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return display;
}

export function useElapsedTimer(isRunning: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    startRef.current = Date.now();
    const interval = setInterval(() => {
      if (startRef.current) {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return elapsed;
}
