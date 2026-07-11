"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Library, Sparkles } from "lucide-react";
import { useMuseum } from "@/lib/store";
import { BrandMark } from "@/components/museum/layout/brand";

// A component for elegant floating CSS particles
function AmbientParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#e8b53a]"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: `blur(${Math.random() * 2}px)`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
            animate={{
              y: [0, -Math.random() * 100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, Math.random() * 0.5 + 0.2, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        );
      })}
    </div>
  );
}

export function LibraryEntrance() {
  const setStage = useMuseum((s) => s.setStage);
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0806] text-white">
      {/* Deep atmospheric gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(232,180,58,0.15)_0%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(232,163,58,0.05)_0%,transparent_100%)]" />
      <AmbientParticles />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <BrandMark size="md" />
          <button onClick={() => setStage("portal")} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs text-foreground/65 transition hover:border-foreground/30 hover:text-foreground">
            Quay lại cổng
          </button>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-5 pb-10 text-center relative z-20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="mx-auto max-w-3xl relative"
          >
            {/* Elegant Glassmorphic Container */}
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/[0.05] shadow-[0_0_80px_-20px_rgba(232,180,58,0.15)] -z-10" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-50 -z-10" />
            
            <div className="px-8 py-16 sm:px-16 sm:py-20">
              <div className="mb-6 flex items-center justify-center gap-2.5 text-[0.65rem] uppercase tracking-[0.4em] text-[#e8b53a]/80 font-medium">
                <Library className="h-4 w-4" /> Không gian học thuật
              </div>
              
              <h2 className="font-serif text-5xl font-medium leading-tight sm:text-7xl text-balance tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent pb-2">
                Thư viện tri thức
              </h2>
              
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#e8b53a]/50 to-transparent mx-auto my-8" />
              
              <p className="mx-auto max-w-xl text-sm leading-loose text-white/60 sm:text-base font-light">
                Bước qua cánh cửa, bạn rời khỏi sự nhộn nhịp của các cỗ máy và bước vào không gian tĩnh lặng của tri thức.
                Tại đây, kho lưu trữ của Atrium mở ra
                « Khái quát về cách mạng công nghiệp » — những trang lịch sử
                đã định hình lại thế giới của chúng ta.
              </p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                onClick={() => setStage("library")}
                className="group mt-12 inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_30px_-5px_rgba(232,180,58,0.3)]"
              >
                <BookOpen className="h-4 w-4 text-[#e8b53a]" /> Mở cuốn sách đầu tiên
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#e8b53a]" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8, duration: 1 }} 
            className="mt-16 flex items-center gap-6 text-[0.65rem] uppercase tracking-[0.25em] text-white/40 font-medium"
          >
            <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-[#e8b53a]/70" /> 1 chương</span>
            <span className="text-white/20">|</span><span>4 cuộc CMCN</span>
            <span className="text-white/20">|</span><span>3 câu quiz</span>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
