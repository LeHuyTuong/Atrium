"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PhaseId } from "./museum-data";

export type JourneyMode = "guided" | "free";

export interface ActiveTour {
  slug: string;
  title: string;
  author: string;
  exhibitIds: string[];
  currentStep: number;
}

export type Stage =
  | "landing"
  | "portal"
  | "map"
  | "room"
  | "photo-wall"
  | "quiz"
  | "scene-lab"
  | "connections"
  | "guestbook"
  | "analytics"
  | "tours"
  | "timeline"
  | "exit"
  | "library-entrance"
  | "library"
  | "library-lesson"
  | "library-quiz"
  | "library-history";

export interface MuseumState {
  // journey
  stage: Stage;
  mode: JourneyMode;
  visitorId: string;
  visitId: string | null;
  startedAt: number | null;

  // navigation
  currentPhase: PhaseId | null;
  seenExhibits: string[];
  bookmarks: string[];
  phasesEntered: PhaseId[];
  quizzesPassed: number;

  // ui
  openExhibitId: string | null;
  compareIds: string[];
  searchOpen: boolean;
  bookmarksPanelOpen: boolean;
  connectionsOpen: boolean;
  tourBuilderOpen: boolean;
  guestbookOpen: boolean;
  analyticsOpen: boolean;
  achievementsOpen: boolean;
  tourPlayerOpen: boolean;
  timelineOpen: boolean;
  minimapOpen: boolean;
  onboardingOpen: boolean;
  onboardingCompleted: boolean;
  sceneLabOpen: boolean;

  // tour playback
  activeTour: ActiveTour | null;

  // audio preferences
  audioMuted: boolean;
  ambientOn: boolean;

  // ephemeral UI overlays
  photoWallPhase: PhaseId | null;
  lightboxImageId: string | null;

  // ephemeral
  lastAchievement: string | null;

  // actions
  setStage: (s: Stage) => void;
  setMode: (m: JourneyMode) => void;
  startVisit: () => void;
  endVisit: () => void;
  enterPhase: (p: PhaseId) => void;
  setCurrentPhase: (p: PhaseId | null) => void;
  openExhibit: (id: string) => void;
  closeExhibit: () => void;
  markSeen: (id: string) => void;
  toggleBookmark: (id: string) => void;
  addCompare: (id: string) => void;
  clearCompare: () => void;
  recordQuizPass: () => void;
  setSearchOpen: (v: boolean) => void;
  setBookmarksPanelOpen: (v: boolean) => void;
  setConnectionsOpen: (v: boolean) => void;
  setTourBuilderOpen: (v: boolean) => void;
  setGuestbookOpen: (v: boolean) => void;
  setAnalyticsOpen: (v: boolean) => void;
  setAchievementsOpen: (v: boolean) => void;
  setTourPlayerOpen: (v: boolean) => void;
  setTimelineOpen: (v: boolean) => void;
  setMinimapOpen: (v: boolean) => void;
  setOnboardingOpen: (v: boolean) => void;
  completeOnboarding: () => void;
  setSceneLabOpen: (v: boolean) => void;
  setLastAchievement: (id: string | null) => void;

  // knowledge library
  completedLessons: string[];
  bookmarkedLessons: string[];
  currentLessonId: string | null;
  knowledgeQuizScore: number | null;
  knowledgeQuizCompleted: boolean;
  completeLesson: (lessonId: string) => void;
  toggleLessonBookmark: (lessonId: string) => void;
  setCurrentLessonId: (id: string | null) => void;
  recordKnowledgeQuiz: (score: number) => void;
  setAudioMuted: (v: boolean) => void;
  setAmbientOn: (v: boolean) => void;
  setActiveTour: (tour: {
    slug: string;
    title: string;
    author: string;
    exhibitIds: string[];
    currentStep?: number;
  }) => void;
  advanceTourStep: () => void;
  retreatTourStep: () => void;
  clearActiveTour: () => void;
  setPhotoWallPhase: (p: PhaseId | null) => void;
  setLightboxImageId: (id: string | null) => void;
  reset: () => void;
}

function uid() {
  return "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const useMuseum = create<MuseumState>()(
  persist(
    (set, get) => ({
      stage: "landing",
      mode: "free",
      visitorId: uid(),
      visitId: null,
      startedAt: null,

      currentPhase: null,
      seenExhibits: [],
      bookmarks: [],
      phasesEntered: [],
      quizzesPassed: 0,

      openExhibitId: null,
      compareIds: [],
      searchOpen: false,
      bookmarksPanelOpen: false,
      connectionsOpen: false,
      tourBuilderOpen: false,
      guestbookOpen: false,
      analyticsOpen: false,
      achievementsOpen: false,
      tourPlayerOpen: false,
      timelineOpen: false,
      minimapOpen: false,
      onboardingOpen: false,
      onboardingCompleted: false,
      sceneLabOpen: false,

      // tour playback
      activeTour: null,

      // audio preferences — start muted to avoid surprise audio
      audioMuted: true,
      ambientOn: false,

      // ephemeral UI overlays
      photoWallPhase: null,
      lightboxImageId: null,

      lastAchievement: null,

      // knowledge library
      completedLessons: [],
      bookmarkedLessons: [],
      currentLessonId: null,
      knowledgeQuizScore: null,
      knowledgeQuizCompleted: false,

      setStage: (s) => set({ stage: s }),
      setMode: (m) => set({ mode: m }),
      startVisit: () =>
        set({
          visitId: "visit_" + Math.random().toString(36).slice(2, 10),
          startedAt: Date.now(),
        }),
      endVisit: () => set({ visitId: null, startedAt: null }),

      enterPhase: (p) =>
        set((s) => ({
          currentPhase: p,
          phasesEntered: s.phasesEntered.includes(p)
            ? s.phasesEntered
            : [...s.phasesEntered, p],
        })),
      setCurrentPhase: (p) => set({ currentPhase: p }),

      openExhibit: (id) => {
        set({ openExhibitId: id });
        get().markSeen(id);
      },
      closeExhibit: () => set({ openExhibitId: null }),
      markSeen: (id) =>
        set((s) =>
          s.seenExhibits.includes(id)
            ? s
            : { seenExhibits: [...s.seenExhibits, id] }
        ),

      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((b) => b !== id)
            : [...s.bookmarks, id],
        })),

      addCompare: (id) =>
        set((s) => {
          if (s.compareIds.includes(id)) {
            return { compareIds: s.compareIds.filter((c) => c !== id) };
          }
          const next = [...s.compareIds, id].slice(-2);
          return { compareIds: next };
        }),
      clearCompare: () => set({ compareIds: [] }),

      recordQuizPass: () => set((s) => ({ quizzesPassed: s.quizzesPassed + 1 })),

      setSearchOpen: (v) => set({ searchOpen: v }),
      setBookmarksPanelOpen: (v) => set({ bookmarksPanelOpen: v }),
      setConnectionsOpen: (v) => set({ connectionsOpen: v }),
      setTourBuilderOpen: (v) => set({ tourBuilderOpen: v }),
      setGuestbookOpen: (v) => set({ guestbookOpen: v }),
      setAnalyticsOpen: (v) => set({ analyticsOpen: v }),
      setAchievementsOpen: (v) => set({ achievementsOpen: v }),
      setTourPlayerOpen: (v) => set({ tourPlayerOpen: v }),
      setTimelineOpen: (v) => set({ timelineOpen: v }),
      setMinimapOpen: (v) => set({ minimapOpen: v }),
      setOnboardingOpen: (v) => set({ onboardingOpen: v }),
      completeOnboarding: () => set({ onboardingCompleted: true, onboardingOpen: false }),
      setSceneLabOpen: (v) => set({ sceneLabOpen: v }),
      setLastAchievement: (id) => set({ lastAchievement: id }),

      completeLesson: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),
      toggleLessonBookmark: (lessonId) =>
        set((s) => ({
          bookmarkedLessons: s.bookmarkedLessons.includes(lessonId)
            ? s.bookmarkedLessons.filter((b) => b !== lessonId)
            : [...s.bookmarkedLessons, lessonId],
        })),
      setCurrentLessonId: (id) => set({ currentLessonId: id }),
      recordKnowledgeQuiz: (score) =>
        set((s) => ({
          knowledgeQuizScore: s.knowledgeQuizScore === null ? score : Math.max(s.knowledgeQuizScore, score),
          knowledgeQuizCompleted: true,
        })),
      setAudioMuted: (v) => set({ audioMuted: v }),
      setAmbientOn: (v) => set({ ambientOn: v }),

      setActiveTour: (tour) =>
        set({
          activeTour: {
            slug: tour.slug,
            title: tour.title,
            author: tour.author,
            exhibitIds: tour.exhibitIds,
            currentStep: tour.currentStep ?? 0,
          },
        }),
      advanceTourStep: () =>
        set((s) => {
          if (!s.activeTour) return {};
          const max = Math.max(0, s.activeTour.exhibitIds.length - 1);
          const next = Math.min(max, s.activeTour.currentStep + 1);
          return { activeTour: { ...s.activeTour, currentStep: next } };
        }),
      retreatTourStep: () =>
        set((s) => {
          if (!s.activeTour) return {};
          const prev = Math.max(0, s.activeTour.currentStep - 1);
          return { activeTour: { ...s.activeTour, currentStep: prev } };
        }),
      clearActiveTour: () => set({ activeTour: null }),
      setPhotoWallPhase: (p) => set({ photoWallPhase: p }),
      setLightboxImageId: (id) => set({ lightboxImageId: id }),

      reset: () =>
        set({
          stage: "landing",
          mode: "free",
          visitId: null,
          startedAt: null,
          currentPhase: null,
          seenExhibits: [],
          bookmarks: [],
          phasesEntered: [],
          quizzesPassed: 0,
          openExhibitId: null,
          compareIds: [],
          activeTour: null,
          ambientOn: false,
        } as Partial<MuseumState>),
    }),
    {
      name: "atrium-museum",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        visitorId: s.visitorId,
        seenExhibits: s.seenExhibits,
        bookmarks: s.bookmarks,
        phasesEntered: s.phasesEntered,
        quizzesPassed: s.quizzesPassed,
        mode: s.mode,
        onboardingCompleted: s.onboardingCompleted,
        activeTour: s.activeTour,
        audioMuted: s.audioMuted,
        ambientOn: s.ambientOn,
        completedLessons: s.completedLessons,
        bookmarkedLessons: s.bookmarkedLessons,
        knowledgeQuizScore: s.knowledgeQuizScore,
        knowledgeQuizCompleted: s.knowledgeQuizCompleted,
      }),
    }
  )
);

// Selectors
export const selectProgress = (s: MuseumState) => s.seenExhibits.length;
export const selectPhaseProgress = (phase: PhaseId) => (s: MuseumState) =>
  s.seenExhibits.length;
