"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

type AuctionTimerProps = {
  endDate: string;
};

export default function AuctionTimer({ endDate }: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isEndingSoon, setIsEndingSoon] = useState(false);

  useEffect(() => {
    const targetDate = parseISO(endDate);

    const interval = setInterval(() => {
      const now = new Date();
      if (now > targetDate) {
        setTimeLeft("Auction Ended");
        clearInterval(interval);
        return;
      }

      const distance = formatDistanceToNow(targetDate, { addSuffix: true });
      setTimeLeft(distance.replace("about ", ""));

      const secondsLeft = (targetDate.getTime() - now.getTime()) / 1000;
      setIsEndingSoon(secondsLeft < 60 * 5); // 5 minutes
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-lg border p-4 transition-colors",
        isEndingSoon
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : "border-primary/50 bg-primary/10 text-primary"
      )}
    >
      <Hammer className="h-6 w-6" />
      <div className="text-center">
        <div className="text-sm font-medium uppercase tracking-wider">
          {isEndingSoon ? "Ending Soon" : "Auction Ends"}
        </div>
        <div className="text-2xl font-bold tabular-nums">
          {timeLeft}
        </div>
      </div>
    </div>
  );
}
