"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Library, Sparkles } from "lucide-react";
import { useMuseum } from "@/lib/store";
import { BrandMark } from "@/components/museum/layout/brand";

const LibraryRoom3D = dynamic(() => import("./LibraryRoom3D").then((m) => m.LibraryRoom3D), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-12 w-12 animate-pulse rounded-full border-2 border-foreground/20 border-t-foreground/60" />
    </div>
  ),
});

export function LibraryEntrance() {
  const setStage = useMuseum((s) => s.setStage);
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0"><LibraryRoom3D /></div>
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <BrandMark size="md" />
          <button onClick={() => setStage("portal")} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs text-foreground/65 transition hover:border-foreground/30 hover:text-foreground">
            Quay lại cổng
          </button>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-5 pb-10 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-center justify-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">
              <Library className="h-3.5 w-3.5" /> Phòng mới · Bên trong bảo tàng
            </div>
            <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-6xl text-balance">Thư viện tri thức</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
              Bước qua cánh cửa, bạn rời bảo tàng 3D và bước vào một thư viện cổ.
              Ánh sáng vàng ấm, giá sách cao, bàn học cũ. Tại đây, bạn học lý
              thuyết về « Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc
              tế của Việt Nam ».
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            onClick={() => setStage("library")}
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-all hover:gap-3.5 hover:shadow-[0_0_30px_-5px_rgba(232,180,58,0.5)]"
          >
            <BookOpen className="h-4 w-4" /> Vào thư viện
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-10 flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.18em] text-foreground/45">
            <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" style={{ color: "#e8b53a" }} /> 3 chương học</span>
            <span>·</span><span>15 bài học</span>
            <span>·</span><span>10 câu trắc nghiệm</span>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
