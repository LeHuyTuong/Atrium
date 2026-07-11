"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useMuseum } from "@/lib/store";
import SceneLoader from "@/components/pc-monitor/SceneLoader";

export function SceneLabModalPC() {
  const open = useMuseum((s) => s.sceneLabOpen);
  const setOpen = useMuseum((s) => s.setSceneLabOpen);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const setStage = useMuseum((s) => s.setStage);

  const openFullExhibit = () => {
    setOpen(false);
    window.setTimeout(() => {
      openExhibit("pc-monitor");
    }, 200);
  };

  const backToRoom = () => {
    setOpen(false);
    window.setTimeout(() => {
      setStage("room");
    }, 200);
  };

  return (
    <DialogContent className="!max-w-[95vw] sm:!max-w-7xl h-[90vh] gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-neutral-950 p-0">
      <DialogTitle className="sr-only">3D Scene Lab · IBM PC</DialogTitle>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full w-full"
          >
            {/* The interactive Scene occupies the entire modal */}
            <SceneLoader />

            {/* Float action buttons on top of the Scene */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
              <button
                onClick={backToRoom}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-medium text-neutral-300 backdrop-blur transition hover:bg-black/80 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay về phòng
              </button>
              <button
                onClick={openFullExhibit}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 text-xs font-medium text-emerald-300 backdrop-blur transition hover:bg-emerald-500/30"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Mở hiện vật đầy đủ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  );
}
