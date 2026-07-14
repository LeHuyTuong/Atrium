"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  Cpu,
  Brain,
  TrendingUp,
  Handshake,
  Settings2,
  X,
  Award,
  Clock,
  BookOpen,
  Star,
  Trophy,
} from "lucide-react";
import { useMuseum } from "@/lib/store";
import { BrandMark } from "@/components/museum/layout/brand";

// ============ DATA: 4 cuộc CMCN ============
interface Revolution {
  id: number;
  label: string;
  period: string;
  title: string;
  shortTitle: string;
  accent: string;
  icon: typeof Flame;
  location: string;
  bullets: string[];
  tech: string[];
  gradient: string;
}

const REVOLUTIONS: Revolution[] = [
  {
    id: 1,
    label: "1.0",
    period: "Thế kỷ XVIII – giữa XIX",
    title: "Cách mạng công nghiệp lần thứ nhất",
    shortTitle: "Hơi nước & Cơ giới hóa",
    accent: "#e89446",
    icon: Flame,
    location: "Khởi phát ở Anh",
    bullets: [
      "Khởi phát ở Anh từ thế kỷ XVIII đến giữa thế kỷ XIX",
      "Diễn ra đầu tiên trong ngành dệt vải",
      "Chuyển từ lao động thủ công sang máy móc",
      "Sử dụng năng lượng nước và hơi nước",
    ],
    tech: ["Hơi nước", "Cơ giới hóa", "Ngành dệt", "Năng lượng nước"],
    gradient: "linear-gradient(135deg, #3a2410 0%, #1a0f08 100%)",
  },
  {
    id: 2,
    label: "2.0",
    period: "Nửa cuối XIX – đầu XX",
    title: "Cách mạng công nghiệp lần thứ hai",
    shortTitle: "Điện & Sản xuất hàng loạt",
    accent: "#e8b53a",
    icon: Zap,
    location: "Mỹ, Đức vượt Anh",
    bullets: [
      "Nửa cuối thế kỷ XIX đến đầu thế kỷ XX",
      "Chuyển từ sản xuất cơ khí sang điện – cơ khí",
      "Hình thành sản xuất hàng loạt",
      "Tự động hóa cục bộ trong sản xuất",
    ],
    tech: ["Điện năng", "Sản xuất hàng loạt", "Tự động hóa cục bộ", "Dây chuyền"],
    gradient: "linear-gradient(135deg, #3a2e0a 0%, #1a1408 100%)",
  },
  {
    id: 3,
    label: "3.0",
    period: "Thập niên 1960 – cuối XX",
    title: "Cách mạng công nghiệp lần thứ ba",
    shortTitle: "Điện tử & Tự động hóa",
    accent: "#4ade80",
    icon: Cpu,
    location: "Toàn cầu",
    bullets: [
      "Bắt đầu từ thập niên 60 thế kỷ XX",
      "Xuất hiện công nghệ thông tin",
      "Tự động hóa sản xuất",
      "Máy tính và điện tử phát triển mạnh",
    ],
    tech: ["Công nghệ thông tin", "Tự động hóa", "Máy tính", "Điện tử"],
    gradient: "linear-gradient(135deg, #0a3a1a 0%, #08180f 100%)",
  },
  {
    id: 4,
    label: "4.0",
    period: "2011 – nay",
    title: "Cách mạng công nghiệp lần thứ tư",
    shortTitle: "AI & Kết nối thông minh",
    accent: "#e879f9",
    icon: Brain,
    location: "Hannover, Đức 2011",
    bullets: [
      "Được đề cập lần đầu tại triển lãm Hannover 2011",
      "Đặc trưng bởi công nghệ đột phá về chất",
      "Hội tụ thế giới vật lý + số + sinh học",
      "Máy móc tự nhận biết, tự quyết định",
    ],
    tech: ["AI", "Big Data", "IoT", "In 3D", "Robot thông minh"],
    gradient: "linear-gradient(135deg, #2a0a2a 0%, #180818 100%)",
  },
];

// ============ DATA: 3 vai trò CMCN ============
interface Role {
  id: string;
  number: string;
  title: string;
  body: string;
  accent: string;
  icon: typeof TrendingUp;
}

const ROLES: Role[] = [
  {
    id: "role-1",
    number: "Một là",
    title: "Thúc đẩy phát triển lực lượng sản xuất",
    body: "Các cuộc cách mạng công nghiệp có tác động vô cùng to lớn đến sự phát triển lực lượng sản xuất ở các quốc gia, đồng thời tác động mạnh mẽ tới cấu trúc và vai trò của các nhân tố trong lực lượng sản xuất xã hội.",
    accent: "#e89446",
    icon: TrendingUp,
  },
  {
    id: "role-2",
    number: "Hai là",
    title: "Thúc đẩy hoàn thiện quan hệ sản xuất",
    body: "Các cuộc cách mạng công nghiệp tạo sự phát triển nhảy vọt về chất trong lực lượng sản xuất và phát triển này tất yếu dẫn đến điều chỉnh, phát triển và hoàn thiện quan hệ sản xuất xã hội.",
    accent: "#e8b53a",
    icon: Handshake,
  },
  {
    id: "role-3",
    number: "Ba là",
    title: "Thúc đẩy đổi mới phương thức quản trị phát triển",
    body: "Phương thức quản trị, điều hành của chính phủ có sự thay đổi để thích ứng với sự phát triển của công nghệ mới, hình thành hệ thống tin học hóa trong quản lý và chính phủ điện tử.",
    accent: "#4ade80",
    icon: Settings2,
  },
];

// ============ DATA: Mini quiz 3 câu ============
interface MiniQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

const MINI_QUIZ: MiniQuestion[] = [
  {
    prompt: "Cách mạng công nghiệp lần thứ nhất khởi phát ở quốc gia nào?",
    options: ["Mỹ", "Anh", "Đức", "Pháp"],
    answer: 1,
    explanation: "CMCN lần 1 khởi phát ở Anh từ thế kỷ XVIII, bắt đầu trong ngành dệt vải.",
  },
  {
    prompt: "Cách mạng công nghiệp 4.0 được đề cập lần đầu vào năm nào?",
    options: ["2000", "2005", "2011", "2015"],
    answer: 2,
    explanation: "CMCN 4.0 được đề cập lần đầu tại triển lãm Hannover (Đức) năm 2011.",
  },
  {
    prompt: "Đặc trưng cơ bản của cách mạng công nghiệp lần thứ ba là gì?",
    options: [
      "Hơi nước và cơ giới hóa",
      "Điện năng và sản xuất hàng loạt",
      "Công nghệ thông tin và tự động hóa",
      "AI và Big Data",
    ],
    answer: 2,
    explanation: "CMCN lần 3 đặc trưng bởi công nghệ thông tin và tự động hóa sản xuất (thập niên 1960).",
  },
  {
    prompt: "Đặc trưng nổi bật của Cách mạng công nghiệp lần thứ hai là gì?",
    options: ["AI và Big Data", "Điện năng và sản xuất hàng loạt", "Internet", "Robot thông minh"],
    answer: 1,
    explanation: "CMCN lần 2 đặc trưng bởi điện năng và sản xuất hàng loạt (nửa cuối XIX – đầu XX).",
  },
  {
    prompt: "Vai trò nào KHÔNG thuộc cách mạng công nghiệp?",
    options: [
      "Phát triển lực lượng sản xuất",
      "Hoàn thiện quan hệ sản xuất",
      "Đổi mới phương thức quản trị",
      "Xóa bỏ hoàn toàn kinh tế thị trường",
    ],
    answer: 3,
    explanation: "Xóa bỏ hoàn toàn kinh tế thị trường KHÔNG phải là vai trò của CMCN. CMCN thúc đẩy phát triển, không xóa bỏ nền kinh tế.",
  },
];

// ============ COMPONENT: LibraryHistoryRoom ============
export function LibraryHistoryRoom() {
  const setStage = useMuseum((s) => s.setStage);
  const [activeRev, setActiveRev] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [progressPct, setProgressPct] = useState(0);
  const [quizAllDone, setQuizAllDone] = useState(false);

  // Refs for scroll tracking
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);
  const card4Ref = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const activeRevolution = REVOLUTIONS.find((r) => r.id === activeRev)!;
  const quizScore = quizAnswers.filter((a, i) => a === MINI_QUIZ[i].answer).length;
  const quizAllAnswered = quizAnswers.every((a) => a !== null);

  const scrollToSection = useCallback((revId: number) => {
    const refMap: Record<number, React.RefObject<HTMLDivElement | null>> = {
      1: card1Ref,
      2: card2Ref,
      3: card3Ref,
      4: card4Ref,
    };
    refMap[revId]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // IntersectionObserver for progress tracking
  useEffect(() => {
    const targets = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current, summaryRef.current].filter(Boolean) as Element[];
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSet = new Set<Element>();
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSet.add(entry.target);
        });

        let maxProgress = 0;
        if (visibleSet.has(card1Ref.current!)) maxProgress = Math.max(maxProgress, 25);
        if (visibleSet.has(card2Ref.current!)) maxProgress = Math.max(maxProgress, 50);
        if (visibleSet.has(card3Ref.current!)) maxProgress = Math.max(maxProgress, 75);
        if (visibleSet.has(card4Ref.current!) || visibleSet.has(summaryRef.current!)) maxProgress = Math.max(maxProgress, 100);

        if (maxProgress > 0) setProgressPct(maxProgress);
      },
      { threshold: 0.2, rootMargin: "-10% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // Track when all quiz questions are answered
  useEffect(() => {
    if (quizAllAnswered) setQuizAllDone(true);
  }, [quizAllAnswered]);

  const handleQuizAnswer = (qi: number, oi: number) => {
    if (quizAnswers[qi] !== null) return;
    const next = [...quizAnswers];
    next[qi] = oi;
    setQuizAnswers(next);
  };

  const resetQuiz = () => {
    setQuizAnswers([null, null, null, null, null]);
    setQuizAllDone(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-40" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />

      {/* Floating dust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-amber-200/30"
            initial={{
              x: `${(i * 37) % 100}%`,
              y: `${(i * 53) % 100}%`,
            }}
            animate={{
              y: ["0%", "-30%", "0%"],
              x: ["0%", "5%", "0%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + (i % 5) * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setStage("landing")} className="shrink-0">
              <BrandMark size="sm" />
            </button>
            <div className="hidden h-6 w-px bg-foreground/15 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <Sparkles className="h-4 w-4" style={{ color: "#e8b53a" }} />
              <span className="text-sm font-semibold text-foreground/85">Phòng thư viện lịch sử</span>
            </div>
            <div className="flex-1" />
            {/* Progress tracker */}
            <div className="flex items-center gap-2 rounded-full border border-foreground/12 bg-foreground/[0.03] px-3 py-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-foreground/45">Tiến độ</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #e89446, #e8b53a, #4ade80)" }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[0.65rem] text-foreground/55">{progressPct}%</span>
            </div>
            <button
              onClick={() => setStage("library")}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Thư viện</span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
          {/* ===== HERO: Title + curved timeline ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-3 text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">
              Chương 1 · Bên trong thư viện tri thức
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-6xl text-balance">
              Lịch sử cách mạng công nghiệp
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground/60 sm:text-base">
              Bốn cuộc cách mạng đã thay đổi thế giới — từ tiếng rít hơi nước năm 1760 đến những mạng nơ-ron học cách nghĩ.
              Hành trình kéo dài 260 năm, mỗi cuộc rút ngắn thời gian hơn cuộc trước.
            </p>
          </motion.div>

          {/* ===== Knowledge Card: Khái niệm CMCN ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-8 max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-2xl border bg-background/70 backdrop-blur-xl p-6 sm:p-8 shadow-sm"
              style={{ borderColor: "oklch(0.5 0.02 60 / 0.18)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #e8b53a44, transparent)" }} />
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border shadow-sm"
                  style={{ borderColor: "#e8b53a44", background: "#e8b53a14", color: "#e8b53a" }}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-foreground/40">Khái niệm</span>
                  <p className="mt-1.5 font-serif text-base sm:text-lg leading-relaxed italic text-foreground/80">
                    Cách mạng công nghiệp là bước phát triển nhảy vọt về chất của tư liệu lao động trên cơ sở những thành tựu khoa học và công nghệ, làm thay đổi căn bản phân công lao động xã hội và nâng cao năng suất lao động.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Curved timeline (SVG path connecting 4 milestones) */}
          <div ref={timelineRef} className="relative mt-12 mb-16">
            <svg
              viewBox="0 0 1000 220"
              className="w-full"
              style={{ filter: "drop-shadow(0 4px 12px rgba(232,180,58,0.15))" }}
            >
              <defs>
                <linearGradient id="timeline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e89446" />
                  <stop offset="33%" stopColor="#e8b53a" />
                  <stop offset="66%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#e879f9" />
                </linearGradient>
              </defs>
              {/* Curved path — gentle arc */}
              <motion.path
                d="M 80 150 Q 250 50, 420 120 T 760 110 T 920 80"
                fill="none"
                stroke="url(#timeline-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* Milestone dots */}
              {[
                { x: 80, y: 150, rev: 1 },
                { x: 350, y: 95, rev: 2 },
                { x: 640, y: 130, rev: 3 },
                { x: 920, y: 80, rev: 4 },
              ].map((m) => {
                const rev = REVOLUTIONS.find((r) => r.id === m.rev)!;
                const isActive = activeRev === m.rev;
                return (
                  <g
                    key={m.rev}
                    onClick={() => { setActiveRev(m.rev); scrollToSection(m.rev); }}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Hit area — larger invisible circle for easy clicking */}
                    <circle cx={m.x} cy={m.y} r="30" fill="transparent" className="group" />
                    {/* Outer glow ring */}
                    {isActive && (
                      <motion.circle
                        cx={m.x}
                        cy={m.y}
                        r="22"
                        fill="none"
                        stroke={rev.accent}
                        strokeWidth="1.5"
                        opacity="0.4"
                        initial={{ r: 14, opacity: 0.6 }}
                        animate={{ r: [14, 22, 14], opacity: [0.6, 0.2, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    {/* Dot */}
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r={isActive ? 14 : 10}
                      fill={rev.accent}
                      stroke="#1a0f08"
                      strokeWidth="2"
                      style={{ transition: "r 0.2s", filter: `drop-shadow(0 0 8px ${rev.accent})` }}
                    />
                    {/* Label */}
                    <text
                      x={m.x}
                      y={m.y - 28}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="700"
                      fill={rev.accent}
                      fontFamily="serif"
                      style={{ pointerEvents: "none" }}
                    >
                      {rev.label}
                    </text>
                    {/* Short title label */}
                    <text
                      x={m.x}
                      y={m.y + 34}
                      textAnchor="middle"
                      fontSize="9"
                      fill="oklch(0.65 0.02 60)"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      style={{ pointerEvents: "none" }}
                    >
                      {rev.shortTitle.split("&").map((p) => p.trim()).join(" & ")}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ===== Active revolution detail (click-to-expand) ===== */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRev}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mb-16"
            >
              <RevolutionCard rev={activeRevolution} />
            </motion.div>
          </AnimatePresence>

          {/* ===== Lesson cards grid (4 cards) ===== */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">02</span>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Bốn cuộc cách mạng</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {REVOLUTIONS.map((rev, i) => {
                const cardRefMap: Record<number, React.RefObject<HTMLDivElement | null>> = {
                  1: card1Ref,
                  2: card2Ref,
                  3: card3Ref,
                  4: card4Ref,
                };
                return (
                <motion.button
                  key={rev.id}
                  ref={(el) => { cardRefMap[rev.id].current = el as HTMLDivElement | null; }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => {
                    setActiveRev(rev.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border p-6 text-left"
                  style={{
                    borderColor: activeRev === rev.id ? rev.accent : "oklch(0.5 0.02 60 / 0.15)",
                    background: activeRev === rev.id ? `${rev.accent}0a` : "oklch(0.5 0.02 60 / 0.02)",
                    boxShadow: activeRev === rev.id ? `0 10px 40px -10px ${rev.accent}40` : "0 4px 20px -10px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${rev.accent}, transparent)` }} />
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${rev.accent}15, transparent 70%)` }}
                  />
                  <div className="relative pointer-events-none">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="grid h-14 w-14 place-items-center rounded-2xl border shadow-sm"
                        style={{ borderColor: `${rev.accent}44`, background: `${rev.accent}14`, color: rev.accent }}
                      >
                        <rev.icon className="h-6 w-6" />
                      </div>
                      <span className="font-serif text-3xl font-bold" style={{ color: rev.accent }}>{rev.label}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-tight text-foreground/90">{rev.shortTitle}</h3>
                    <p className="mt-1.5 text-xs text-foreground/60 font-medium">{rev.period}</p>
                    
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {rev.tech.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] font-semibold bg-background/50"
                          style={{ borderColor: `${rev.accent}44`, color: rev.accent }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
                );
              })}
            </div>
          </section>

          {/* ===== Section 3: Vai trò CMCN — 3 knowledge cards ===== */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">03</span>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Vai trò của cách mạng công nghiệp đối với phát triển
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {ROLES.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-[2rem] border p-8 bg-background/60 backdrop-blur-xl shadow-sm"
                  style={{
                    borderColor: `${role.accent}40`,
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${role.accent}, transparent)` }} />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${role.accent}0a, transparent 70%)` }}
                  />
                  <div className="relative pointer-events-none">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border shadow-sm"
                        style={{ borderColor: `${role.accent}44`, background: `${role.accent}14`, color: role.accent }}
                      >
                        <role.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[0.75rem] uppercase tracking-[0.2em] font-bold" style={{ color: role.accent }}>
                        {role.number}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold leading-snug text-foreground/90">
                      {role.title}
                    </h3>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-foreground/70 font-medium">{role.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== Section 4: Tổng kết chương ===== */}
          <section ref={summaryRef} className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[2rem] border bg-background/70 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]"
              style={{ borderColor: "oklch(0.5 0.02 60 / 0.2)" }}
            >
              <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg, transparent, #e8b53a, #4ade80, #e879f9, transparent)" }} />
              <div
                className="absolute -right-8 -top-8 font-serif text-[12rem] font-bold leading-none opacity-[0.025]"
                style={{ color: "#e8b53a" }}
              >
                04
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border shadow-sm mb-5"
                  style={{ borderColor: "#e8b53a44", background: "#e8b53a14", color: "#e8b53a" }}
                >
                  <BookOpen className="h-8 w-8" />
                </div>
                <span className="text-[0.7rem] uppercase tracking-[0.25em] text-foreground/50 mb-2">Tổng kết chương</span>
                <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl mb-5">
                  Hành trình 260 năm công nghiệp
                </h2>
                <p className="max-w-3xl text-base leading-relaxed text-foreground/75 font-medium sm:text-lg">
                  Qua bốn cuộc cách mạng công nghiệp, thế giới đã chuyển từ nền sản xuất thủ công sang nền sản xuất thông minh dựa trên công nghệ số. Mỗi cuộc cách mạng đều góp phần thúc đẩy lực lượng sản xuất, hoàn thiện quan hệ sản xuất và đổi mới phương thức quản trị, tạo nền tảng cho sự phát triển kinh tế - xã hội hiện đại.
                </p>
                {/* Timeline summary dots */}
                <div className="mt-8 flex items-center gap-3 flex-wrap justify-center">
                  {REVOLUTIONS.map((rev) => (
                    <span
                      key={rev.id}
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
                      style={{ borderColor: `${rev.accent}44`, color: rev.accent, background: `${rev.accent}10` }}
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full text-[0.6rem]" style={{ background: rev.accent, color: "#fff" }}>{rev.label}</span>
                      {rev.shortTitle.split("&")[0].trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* ===== Section 5: Mini quiz 5 câu ===== */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">05</span>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Kiểm tra nhanh — 5 câu trắc nghiệm
              </h2>
            </div>
            <div className="rounded-[2rem] border shadow-sm bg-background/60 backdrop-blur-xl p-8 sm:p-10" style={{ borderColor: "oklch(0.5 0.02 60 / 0.15)" }}>
              <div className="space-y-8">
                {MINI_QUIZ.map((q, qi) => {
                  const sel = quizAnswers[qi];
                  const answered = sel !== null;
                  const isCorrect = answered && sel === q.answer;
                  const isWrong = answered && sel !== q.answer;
                  return (
                  <div key={qi} className="pb-8 border-b border-foreground/5 last:border-0 last:pb-0">
                    <div className="mb-4 flex items-center gap-3">
                      <span className={`grid h-8 w-8 place-items-center rounded-xl font-serif text-sm font-bold shadow-sm border transition-colors ${answered ? (isCorrect ? "border-[#4ade80] bg-[#4ade8014]" : "border-[#f87171] bg-[#f8717114]") : "bg-foreground/5 text-foreground/70 border-foreground/5"}`}
                        style={{ color: answered ? (isCorrect ? "#166534" : "#991b1b") : undefined }}
                      >
                        {qi + 1}
                      </span>
                      <span className="text-lg font-bold text-foreground/90">{q.prompt}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 pl-11 sm:grid-cols-2">
                      {q.options.map((opt, oi) => {
                        const isSelOption = sel === oi;
                        const showCorrect = answered && oi === q.answer;
                        const showWrong = answered && isSelOption && oi !== q.answer;
                        const isDisabled = answered;
                        return (
                          <button
                            key={oi}
                            disabled={isDisabled}
                            onClick={() => handleQuizAnswer(qi, oi)}
                            className="flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-300 ease-out shadow-sm"
                            style={{
                              borderColor: showCorrect
                                ? "#22c55e"
                                : showWrong
                                ? "#f43f5e"
                                : isSelOption && !answered
                                ? "#e8b53a"
                                : "oklch(0.5 0.02 60 / 0.18)",
                              background: showCorrect
                                ? "oklch(0.45 0.18 145 / 0.15)"
                                : showWrong
                                ? "oklch(0.45 0.22 15 / 0.15)"
                                : isSelOption && !answered
                                ? "#e8b53a18"
                                : "oklch(0.18 0.01 60 / 0.35)",
                              color: showCorrect
                                ? "oklch(0.7 0.18 145)"
                                : showWrong
                                ? "oklch(0.65 0.2 15)"
                                : isSelOption && !answered
                                ? "#e8b53a"
                                : "oklch(0.9 0.01 70)",
                              fontWeight: showCorrect || showWrong ? 500 : 400,
                              opacity: isDisabled && !showCorrect && !showWrong ? 0.4 : 1,
                              cursor: isDisabled ? "default" : "pointer",
                            }}
                          >
                            <span style={{ opacity: showCorrect || showWrong ? 0.8 : 0.55, fontWeight: 700 }}>{String.fromCharCode(65 + oi)}.</span>
                            <span className="flex-1">{opt}</span>
                            {showCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" color="oklch(0.7 0.18 145)" />}
                            {showWrong && <X className="h-5 w-5 shrink-0" color="oklch(0.65 0.2 15)" />}
                          </button>
                        );
                      })}
                    </div>
                    {/* Explanation after answer */}
                    {answered && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pl-11 text-sm italic leading-relaxed text-foreground/70 font-medium"
                      >
                        → {q.explanation}
                      </motion.p>
                    )}
                  </div>
                  );
                })}
              </div>

              {/* Quiz results */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-foreground/10 pt-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-300" />
                  <span className="font-serif text-lg font-bold" style={{ color: quizScore >= 4 ? "#4ade80" : "#e8b53a" }}>
                    {quizScore}/5
                  </span>
                  <span className="text-xs text-foreground/55">
                    {!quizAllAnswered ? `Đã trả lời ${quizAnswers.filter((a) => a !== null).length}/5` :
                     quizScore === 5 ? "Hoàn hảo!" : quizScore >= 3 ? "Khá tốt!" : "Cần cố gắng"}
                  </span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-2 text-xs text-foreground/65 transition hover:border-foreground/30"
                >
                  Làm lại
                </button>
              </div>

              {/* Badge for perfect score */}
              {quizAllDone && quizScore === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mt-6"
                >
                  <div className="relative overflow-hidden rounded-2xl border p-6 text-center"
                    style={{
                      borderColor: "#e8b53a55",
                      background: "linear-gradient(135deg, #e8b53a10 0%, #4ade8010 50%, #e879f910 100%)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #e8b53a88, transparent)" }} />
                    <Trophy className="mx-auto h-10 w-10 text-amber-300 drop-shadow-lg" />
                    <p className="mt-3 font-serif text-xl font-bold text-foreground">🏆 Đã hoàn thành xuất sắc Chương 1</p>
                    <p className="mt-1 text-sm text-foreground/60">Bạn đã trả lời chính xác toàn bộ 5/5 câu hỏi trắc nghiệm.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* ===== Footer: Tiếp tục khám phá ===== */}
          <div className="mb-8 flex flex-col items-center gap-3 border-t border-foreground/10 pt-8 text-center">
            <p className="font-serif text-sm italic text-foreground/50">
              « Bạn đã đi qua phòng lịch sử. Bảo tàng vẫn còn nhiều phòng chờ khám phá. »
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setStage("library")}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Về thư viện
              </button>
              <button
                onClick={() => setStage("portal")}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:gap-3"
              >
                Tiếp tục khám phá bảo tàng
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============ RevolutionCard — detail view =====
const REV_SIGNIFICANCE: Record<number, string> = {
  1: "Đặt nền móng cho nền công nghiệp hiện đại.",
  2: "Thúc đẩy sản xuất hàng loạt và sự phát triển mạnh của các ngành công nghiệp.",
  3: "Mở đầu kỷ nguyên tự động hóa và công nghệ thông tin.",
  4: "Thúc đẩy chuyển đổi số, kinh tế số và sản xuất thông minh.",
};

const REV_EMOJI: Record<number, string> = {
  1: "🚂",
  2: "🏭",
  3: "💻",
  4: "🤖",
};

function RevolutionCard({ rev }: { rev: Revolution }) {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] bg-background/80 backdrop-blur-xl"
      style={{
        borderColor: `${rev.accent}40`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: `linear-gradient(90deg, transparent, ${rev.accent}, transparent)` }} />
      <div
        className="absolute -right-10 -top-10 font-serif text-[16rem] font-bold leading-none opacity-[0.03]"
        style={{ color: rev.accent }}
      >
        {rev.label}
      </div>

      <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr_auto]">
        {/* Left: icon + period */}
        <div className="flex flex-row items-center gap-6 md:flex-col md:items-start">
          <div
            className="grid h-24 w-24 shrink-0 place-items-center rounded-[1.5rem] border shadow-sm"
            style={{ borderColor: `${rev.accent}44`, background: `${rev.accent}14`, color: rev.accent }}
          >
            <rev.icon className="h-12 w-12" />
          </div>
          <div>
            <div className="font-serif text-5xl font-bold drop-shadow-sm" style={{ color: rev.accent }}>{rev.label}</div>
            <div className="mt-2 text-[0.75rem] uppercase tracking-[0.2em] text-foreground/60 font-semibold">
              <Clock className="mr-1.5 inline h-3.5 w-3.5" />{rev.period}
            </div>
            <div className="mt-1.5 text-sm text-foreground/60 font-medium">📍 {rev.location}</div>
          </div>
        </div>

        {/* Center: content */}
        <div className="pt-2 md:pl-6 md:border-l border-foreground/5">
          <h3 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">{rev.title}</h3>
          <ul className="mt-6 space-y-4">
            {rev.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-start gap-3 text-lg leading-relaxed text-foreground/85 font-medium"
              >
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full shadow-sm"
                  style={{ background: rev.accent }}
                />
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
          {/* Tech tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {rev.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.15em] font-bold shadow-sm"
                style={{ borderColor: `${rev.accent}44`, color: rev.accent, background: `${rev.accent}10` }}
              >
                {t}
              </span>
            ))}
          </div>
          {/* Ý nghĩa nổi bật */}
          <div className="mt-6">
            <div
              className="flex items-start gap-3 rounded-2xl border p-4 sm:p-5"
              style={{ borderColor: `${rev.accent}33`, background: `${rev.accent}0d` }}
            >
              <Star className="h-5 w-5 mt-0.5 shrink-0" style={{ color: rev.accent }} />
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] font-bold" style={{ color: rev.accent }}>Ý nghĩa nổi bật</span>
                <p className="mt-1 text-sm leading-relaxed font-medium text-foreground/80">{REV_SIGNIFICANCE[rev.id]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Museum frame */}
        <div className="flex items-start justify-center md:pt-0 order-first md:order-none md:border-l md:border-foreground/5 md:pl-6">
          <div
            className="group relative overflow-hidden rounded-[1.25rem] border-2 shadow-lg"
            style={{
              borderColor: `${rev.accent}33`,
              background: `${rev.accent}0a`,
              width: "120px",
              height: "140px",
            }}
          >
            {/* Inner mat */}
            <div className="absolute inset-2 rounded-lg border" style={{ borderColor: `${rev.accent}22` }} />
            {/* Emoji */}
            <div className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110">
              {REV_EMOJI[rev.id]}
            </div>
            {/* Plaque */}
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.5rem] uppercase tracking-[0.1em] font-bold"
              style={{ borderColor: `${rev.accent}44`, color: rev.accent, background: `${rev.accent}14` }}
            >
              CMCN {rev.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
