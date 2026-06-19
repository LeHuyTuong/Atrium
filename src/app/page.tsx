"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { toast } from "sonner";
import { useMuseum } from "@/lib/store";
import { exhibitById } from "@/lib/museum-data";
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
import { OnboardingOverlay } from "@/components/museum/panels/OnboardingOverlay";
import { TourPlayerBar } from "@/components/museum/panels/TourPlayerBar";
import { SceneLabModal } from "@/components/museum/panels/SceneLabModal";
import { PhotoWall } from "@/components/museum/panels/PhotoWall";
import { Lightbox } from "@/components/museum/panels/Lightbox";

export default function Home() {
  const stage = useMuseum((s) => s.stage);
  const setSearchOpen = useMuseum((s) => s.setSearchOpen);
  const setBookmarksPanelOpen = useMuseum((s) => s.setBookmarksPanelOpen);
  const setTimelineOpen = useMuseum((s) => s.setTimelineOpen);
  const [quizOpen, setQuizOpen] = useState(false);

  // tour playback actions
  const setActiveTour = useMuseum((s) => s.setActiveTour);
  const enterPhase = useMuseum((s) => s.enterPhase);
  const setCurrentPhase = useMuseum((s) => s.setCurrentPhase);
  const setStage = useMuseum((s) => s.setStage);
  const openExhibit = useMuseum((s) => s.openExhibit);

  // On mount: if ?tour=<slug> is in the URL, fetch the tour, activate it,
  // jump to the room of its first exhibit and auto-open that exhibit.
  const tourBootstrapped = useRef(false);
  useEffect(() => {
    if (tourBootstrapped.current) return;
    tourBootstrapped.current = true;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("tour");
    if (!slug) return;
    fetch(`/api/tours/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.tour) return;
        setActiveTour({
          slug: data.tour.slug,
          title: data.tour.title,
          author: data.tour.author,
          exhibitIds: data.tour.exhibitIds,
          currentStep: 0,
        });
        const firstId = data.tour.exhibitIds?.[0];
        if (firstId) {
          const firstExhibit = exhibitById(firstId);
          if (firstExhibit) {
            enterPhase(firstExhibit.phase);
            setCurrentPhase(firstExhibit.phase);
            setStage("room");
            window.setTimeout(() => openExhibit(firstExhibit.id), 500);
          }
        }
      })
      .catch(() => {
        toast.error("Không tải được tour này. Có thể liên kết đã hết hạn.");
      });
  }, [setActiveTour, enterPhase, setCurrentPhase, setStage, openExhibit]);

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

      {/* First-visit onboarding (auto-shows on the room stage) */}
      <OnboardingOverlay />

      {/* Tour playback bar (renders only when a tour is active) */}
      <TourPlayerBar />

      {/* Photo wall + lightbox (open via store) */}
      <PhotoWall />
      <Lightbox />

      {/* Scene Lab — exploded 3D view of the Watt steam engine */}
      <SceneLabModal />
    </div>
  );
}
