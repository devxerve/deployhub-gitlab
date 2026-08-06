"use client";

import { useEffect, useRef } from "react";


export function useInterval(fn: () => void, ms: number) {
  const ref = useRef<() => void>(fn);
  useEffect(() => { ref.current = fn; }, [fn]);
  useEffect(() => {
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}