import { cn } from "@/lib/utils";

export default function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M14.5 12.5 10 8" />
      <path d="M12 14V4" />
      <path d="M8 14V9" />
      <path d="M16 14V9" />
      <path d="M5 19v-4.34a1 1 0 0 1 .55-.89l3-1.74a1 1 0 0 1 1.1 0l3 1.74a1 1 0 0 1 .55.89V19a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z" />
      <path d="M5 19h14" />
    </svg>
  );
}
