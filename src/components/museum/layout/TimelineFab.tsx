"use client";

import { HelpCircle, Clock, Map as MapIcon, Network } from "lucide-react";
import { useMuseum } from "@/lib/store";

export function TimelineFab({ onQuiz }: { onQuiz: () => void }) {
  const stage = useMuseum((s) => s.stage);
  const setTimelineOpen = useMuseum((s) => s.setTimelineOpen);
  const setConnectionsOpen = useMuseum((s) => s.setConnectionsOpen);
  const setStage = useMuseum((s) => s.setStage);

  if (stage !== "room" && stage !== "map") return null;

  const actions: { icon: React.ReactNode; label: string; onClick: () => void; color: string }[] = [
    {
      icon: <Clock className="h-4 w-4" />,
      label: "Dòng thời gian",
      onClick: () => setTimelineOpen(true),
      color: "#00d4aa",
    },
    {
      icon: <Network className="h-4 w-4" />,
      label: "Mạch liên kết",
      onClick: () => setConnectionsOpen(true),
      color: "#e879f9",
    },
    {
      icon: <MapIcon className="h-4 w-4" />,
      label: "Sơ đồ",
      onClick: () => setStage("map"),
      color: "#4ade80",
    },
  ];
  if (stage === "room") {
    actions.push({
      icon: <HelpCircle className="h-4 w-4" />,
      label: "Trắc nghiệm",
      onClick: onQuiz,
      color: "#e8b53a",
    });
  }

  return (
    <div data-onboarding="fab" className="fixed bottom-20 left-4 z-20 flex flex-col gap-2 sm:bottom-24 sm:left-6">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          title={a.label}
          aria-label={a.label}
          className="group flex items-center gap-2 rounded-full border border-foreground/12 bg-card/90 p-2.5 backdrop-blur-md transition hover:border-foreground/30"
          style={{ ["--c" as string]: a.color }}
        >
          <span style={{ color: a.color }}>{a.icon}</span>
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium text-foreground/75 transition-all duration-300 group-hover:max-w-[140px] sm:inline">
            {a.label}
          </span>
        </button>
      ))}
    </div>
  );
}
