
"use client";

import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type CircularAuctionTimerProps = {
  endDate: string;
};

const COUNTDOWN_FROM = 24 * 60 * 60; // 24 hours in seconds
const STROKE_WIDTH = 8;
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * (RADIUS - STROKE_WIDTH / 2);

export default function CircularAuctionTimer({ endDate }: CircularAuctionTimerProps) {
  const [totalDuration, setTotalDuration] = useState(COUNTDOWN_FROM);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_FROM);

  useEffect(() => {
    const targetDate = parseISO(endDate);

    const updateTimerState = () => {
      const now = new Date();
      const duration = (targetDate.getTime() - now.getTime()) / 1000;
      
      // Set the total duration for the progress ring calculation.
      // If the auction is longer than 24h, we cap the visual progress at 24h.
      setTotalDuration(Math.min(duration, COUNTDOWN_FROM));

      if (now > targetDate) {
        setSecondsLeft(0);
        return;
      }
      setSecondsLeft(duration);
    };

    updateTimerState(); // Initial call
    const interval = setInterval(updateTimerState, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const isEndingSoon = secondsLeft <= 60 && secondsLeft > 0;
  const isFinished = secondsLeft <= 0;

  const percentage = (secondsLeft / totalDuration) * 100;
  const strokeDashoffset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  const days = Math.floor(secondsLeft / (24 * 60 * 60));
  const hours = Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
  const seconds = Math.floor(secondsLeft % 60);
  
  let statusText = "Tiempo restante";
  let colorClass = "text-green-500";
  
  if (secondsLeft <= 60 * 60) { // Under 1 hour
      statusText = "Termina pronto";
      colorClass = "text-yellow-500";
  }
  if (secondsLeft <= 60) { // Under 1 minute
      statusText = "Últimos segundos";
      colorClass = "text-red-500";
  }
  if (isFinished) {
      statusText = "Lote Cerrado";
      colorClass = "text-muted-foreground";
  }


  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg">
      <div className={cn("text-lg font-medium tracking-wide", colorClass)}>
        {statusText}
      </div>
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 176 176">
          <circle
            cx="88"
            cy="88"
            r={RADIUS - STROKE_WIDTH / 2}
            fill="transparent"
            stroke="hsl(var(--muted))"
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx="88"
            cy="88"
            r={RADIUS - STROKE_WIDTH / 2}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isFinished ? CIRCUMFERENCE : strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 88 88)"
            className={cn(
              "transition-all duration-1000 ease-linear",
              colorClass
            )}
          />
        </svg>
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            isEndingSoon && "animate-pulse"
          )}
        >
          {isFinished ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          ) : (
            <>
              {secondsLeft > 24 * 60 * 60 ? (
                 <div className="text-center">
                    <span className="text-4xl font-bold font-mono tracking-tighter">{days}d</span>
                    <span className="text-2xl font-bold font-mono tracking-tighter ml-1">{hours}h</span>
                 </div>
              ) : (
                <span className="text-4xl font-bold font-mono tracking-tighter">
                  {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
