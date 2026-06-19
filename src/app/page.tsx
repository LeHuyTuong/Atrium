"use client";

import { useEffect, useState, Suspense } from "react";
import { useMuseum } from "@/lib/store";
import { LandingPage } from "@/components/museum/layout/LandingPage";
import { PortalEntry } from "@/components/museum/layout/PortalEntry";
import { MuseumMap } from "@/components/museum/layout/MuseumMap";
import { PhaseRoom } from "@/components/museum/layout/PhaseRoom";
import { ExitSummary } from "@/components/museum/layout/ExitSummary";
import { StickyFooter } from "@/components/museum/layout/brand";
import { ExhibitModal } from "@/components/museum/panels/ExhibitModal";
import { SearchPalette } from "@/components/museum/panels/SearchPalette";
import { BookmarksPanel } from "@/components/museum/panels/BookmarksPanel";
import { CompareModal } from "@/components/museum/panels/CompareModal";
import { ConnectionsWeb } from "@/components/museum/panels/ConnectionsWeb";
import { Guestbook } from "@/components/museum/panels/Guestbook";
import { Achievements } from "@/components/museum/panels/Achievements";
import { AnalyticsDashboard } from "@/components/museum/panels/AnalyticsDashboard";
import { TourBuilderModal } from "@/components/museum/panels/TourBuilderModal";
import { HistoricalTimeline } from "@/components/museum/panels/HistoricalTimeline";
import { QuizModal } from "@/components/museum/panels/QuizBox";
import { DailySpotlight } from "@/components/museum/panels/DailySpotlight";
import { TimelineFab } from "@/components/museum/layout/TimelineFab";

export default function Home() {
  const stage = useMuseum((s) => s.stage);
  const setSearchOpen = useMuseum((s) => s.setSearchOpen);
  const setBookmarksPanelOpen = useMuseum((s) => s.setBookmarksPanelOpen);
  const setTimelineOpen = useMuseum((s) => s.setTimelineOpen);
  const [quizOpen, setQuizOpen] = useState(false);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (typing) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key.toLowerCase() === "b" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setBookmarksPanelOpen(true);
      } else if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setTimelineOpen(true);
      } else if (e.key.toLowerCase() === "q" && !e.metaKey && !e.ctrlKey && stage === "room") {
        e.preventDefault();
        setQuizOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stage, setSearchOpen, setBookmarksPanelOpen, setTimelineOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col">
        {stage === "landing" && <LandingPage />}
        {stage === "portal" && <PortalEntry />}
        {stage === "map" && <MuseumMap />}
        {stage === "room" && <PhaseRoom />}
        {stage === "exit" && <ExitSummary />}
      </main>

      {/* Sticky footer (hidden on landing for cinematic full-bleed) */}
      {stage !== "landing" && stage !== "exit" && <StickyFooter />}

      {/* Global panels / modals */}
      <ExhibitModal />
      <SearchPalette />
      <BookmarksPanel />
      <CompareModal />
      <ConnectionsWeb />
      <Guestbook />
      <Achievements />
      <AnalyticsDashboard />
      <TourBuilderModal />
      <HistoricalTimeline />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />

      {/* Floating helpers */}
      <DailySpotlight />
      <TimelineFab onQuiz={() => setQuizOpen(true)} />
    </div>
  );
}
