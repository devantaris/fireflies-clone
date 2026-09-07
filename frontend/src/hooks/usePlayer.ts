"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface PlayerControls {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  speed: number;
  seek: (t: number) => void;
  togglePlay: () => void;
  setSpeed: (s: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
}

export function usePlayer(duration: number): PlayerControls {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);

  // Use refs so the interval callback never captures stale values
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const durationRef = useRef(duration);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { durationRef.current = duration; }, [duration]);

  useEffect(() => {
    if (!isPlaying || duration <= 0) return;

    const id = setInterval(() => {
      setCurrentTime(t => {
        const next = Math.round((t + 0.1 * speedRef.current) * 10) / 10;
        if (next >= durationRef.current) {
          setIsPlaying(false);
          return durationRef.current;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(id);
  }, [isPlaying, duration]);

  const seek = useCallback(
    (time: number) => setCurrentTime(Math.max(0, Math.min(time, durationRef.current))),
    []
  );

  const togglePlay = useCallback(() => {
    if (durationRef.current <= 0) return;
    setIsPlaying(p => !p);
  }, []);

  const setSpeed = useCallback((s: number) => setSpeedState(s), []);

  const skipForward = useCallback(
    () => setCurrentTime(t => Math.min(t + 10, durationRef.current)),
    []
  );

  const skipBackward = useCallback(
    () => setCurrentTime(t => Math.max(t - 10, 0)),
    []
  );

  return { currentTime, duration, isPlaying, speed, seek, togglePlay, setSpeed, skipForward, skipBackward };
}
