"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useMuseum } from "@/lib/store";
import { BrandMark } from "@/components/museum/layout/brand";
import { toast } from "sonner";

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
];

// ============ COMPONENT: LibraryHistoryRoom ============
export function LibraryHistoryRoom() {
  const setStage = useMuseum((s) => s.setStage);
  const setCurrentLessonId = useMuseum((s) => s.setCurrentLessonId);
  const [activeRev, setActiveRev] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeRevolution = REVOLUTIONS.find((r) => r.id === activeRev)!;
  const quizScore = quizAnswers.filter((a, i) => a === MINI_QUIZ[i].answer).length;
  const progressPct = Math.round((quizAnswers.filter((a) => a !== null).length / MINI_QUIZ.length) * 100);

  const submitQuiz = () => {
    setQuizSubmitted(true);
    if (quizScore === 3) {
      toast.success("Xuất sắc! 3/3 — Bạn đã nắm vững lịch sử CMCN!");
    } else if (quizScore >= 2) {
      toast.success(`Khá tốt! ${quizScore}/3`);
    } else {
      toast.message(`Cần cố gắng hơn — ${quizScore}/3`);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers([null, null, null]);
    setQuizSubmitted(false);
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
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #e89446, #e8b53a, #4ade80)" }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4 }}
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

          {/* Curved timeline (SVG path connecting 4 milestones) */}
          <div className="relative mt-12 mb-16">
            <svg
              viewBox="0 0 1000 200"
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
                    onClick={() => setActiveRev(m.rev)}
                    style={{ cursor: "pointer" }}
                  >
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
                    >
                      {rev.label}
                    </text>
                    <text
                      x={m.x}
                      y={m.y + 32}
                      textAnchor="middle"
                      fontSize="9"
                      fill="oklch(0.65 0.02 60)"
                      fontFamily="sans-serif"
                    >
                      {rev.period.split("–")[0].trim()}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {REVOLUTIONS.map((rev, i) => (
                <motion.button
                  key={rev.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => {
                    setActiveRev(rev.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-1"
                  style={{
                    borderColor: activeRev === rev.id ? rev.accent : "oklch(0.5 0.02 60 / 0.15)",
                    background: activeRev === rev.id ? `${rev.accent}0d` : "oklch(0.5 0.02 60 / 0.03)",
                    boxShadow: activeRev === rev.id ? `0 0 30px -8px ${rev.accent}66` : "none",
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${rev.accent}, transparent)` }} />
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse at top, ${rev.accent}10, transparent 70%)` }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div
                        className="grid h-11 w-11 place-items-center rounded-xl border"
                        style={{ borderColor: `${rev.accent}44`, background: `${rev.accent}14`, color: rev.accent }}
                      >
                        <rev.icon className="h-5 w-5" />
                      </div>
                      <span className="font-serif text-2xl font-bold" style={{ color: rev.accent }}>{rev.label}</span>
                    </div>
                    <h3 className="mt-3 font-serif text-sm font-bold leading-tight text-foreground/90">{rev.shortTitle}</h3>
                    <p className="mt-1 text-[0.7rem] text-foreground/50">{rev.period}</p>
                    {/* Historical illustration placeholder (gradient + icon) */}
                    <div
                      className="mt-3 h-16 overflow-hidden rounded-lg border border-foreground/10"
                      style={{ background: rev.gradient }}
                    >
                      <div className="flex h-full items-center justify-center">
                        <rev.icon className="h-7 w-7" style={{ color: rev.accent, opacity: 0.6 }} strokeWidth={1} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {rev.tech.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-1.5 py-0.5 text-[0.55rem] uppercase tracking-[0.1em]"
                          style={{ borderColor: `${rev.accent}33`, color: rev.accent, background: `${rev.accent}0a` }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {ROLES.map((role, i) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-1"
                  style={{
                    borderColor: `${role.accent}33`,
                    background: `${role.accent}08`,
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${role.accent}, transparent)` }} />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse at top, ${role.accent}12, transparent 70%)` }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border"
                        style={{ borderColor: `${role.accent}44`, background: `${role.accent}14`, color: role.accent }}
                      >
                        <role.icon className="h-4 w-4" />
                      </div>
                      <span className="text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: role.accent }}>
                        {role.number}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-base font-bold leading-tight text-foreground/90">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/65">{role.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== Section 4: Mini quiz 3 câu ===== */}
          <section className="mb-16">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">04</span>
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Kiểm tra nhanh — 3 câu trắc nghiệm
              </h2>
            </div>
            <div className="rounded-2xl border border-foreground/12 bg-foreground/[0.025] p-5 sm:p-6">
              <div className="space-y-5">
                {MINI_QUIZ.map((q, qi) => (
                  <div key={qi}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground/10 font-serif text-xs font-bold text-foreground/70">
                        {qi + 1}
                      </span>
                      <span className="text-sm font-semibold text-foreground/90">{q.prompt}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 pl-8 sm:grid-cols-2">
                      {q.options.map((opt, oi) => {
                        const isSel = quizAnswers[qi] === oi;
                        const isCorrect = quizSubmitted && oi === q.answer;
                        const isWrong = quizSubmitted && isSel && oi !== q.answer;
                        return (
                          <button
                            key={oi}
                            disabled={quizSubmitted}
                            onClick={() => {
                              const next = [...quizAnswers];
                              next[qi] = oi;
                              setQuizAnswers(next);
                            }}
                            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition"
                            style={{
                              borderColor: isCorrect
                                ? "#4ade80"
                                : isWrong
                                ? "#f87171"
                                : isSel
                                ? "#e8b53a"
                                : "oklch(0.5 0.02 60 / 0.15)",
                              background: isCorrect
                                ? "#4ade8014"
                                : isWrong
                                ? "#f8717114"
                                : isSel
                                ? "#e8b53a14"
                                : "transparent",
                              color: isCorrect
                                ? "#4ade80"
                                : isWrong
                                ? "#f87171"
                                : isSel
                                ? "#e8b53a"
                                : "oklch(0.5 0.02 60 / 0.85)",
                              opacity: quizSubmitted && !isCorrect && !isSel ? 0.4 : 1,
                            }}
                          >
                            <span className="font-bold">{String.fromCharCode(65 + oi)}.</span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {isWrong && <X className="h-3.5 w-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                    {/* Explanation after submit */}
                    {quizSubmitted && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 pl-8 text-[0.7rem] italic leading-relaxed text-foreground/55"
                      >
                        → {q.explanation}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>

              {/* Quiz actions */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-foreground/10 pt-4">
                {quizSubmitted ? (
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-300" />
                    <span className="font-serif text-lg font-bold" style={{ color: quizScore === 3 ? "#4ade80" : "#e8b53a" }}>
                      {quizScore}/3
                    </span>
                    <span className="text-xs text-foreground/55">
                      {quizScore === 3 ? "Hoàn hảo!" : quizScore >= 2 ? "Khá tốt!" : "Cần cố gắng"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-foreground/45">
                    Đã trả lời {quizAnswers.filter((a) => a !== null).length}/3
                  </span>
                )}
                <div className="flex gap-2">
                  {quizSubmitted && (
                    <button
                      onClick={resetQuiz}
                      className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-2 text-xs text-foreground/65 transition hover:border-foreground/30"
                    >
                      Làm lại
                    </button>
                  )}
                  {!quizSubmitted && (
                    <button
                      onClick={submitQuiz}
                      disabled={quizAnswers.some((a) => a === null)}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-background transition disabled:opacity-40"
                      style={{ background: "#e8b53a" }}
                    >
                      Nộp bài
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ===== Footer: Tiếp tục khám phá ===== */}
          <div className="mb-8 flex flex-col items-center gap-3 border-t border-foreground/10 pt-8 text-center">
            <p className="font-serif text-sm italic text-foreground/50">
              « Bạn đã đi qua phòng lịch sử. Còn nhiều điều để học hỏi. »
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setStage("library")}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Về thư viện
              </button>
              <button
                onClick={() => {
                  setCurrentLessonId("c1-l1");
                  setStage("library-lesson");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 px-5 py-2.5 text-sm text-amber-400 transition hover:border-amber-500/50"
              >
                <BookOpen className="h-4 w-4" /> Xem bài học
              </button>
              <button
                onClick={() => setStage("library-quiz")}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:gap-3"
              >
                Làm quiz
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
function RevolutionCard({ rev }: { rev: Revolution }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border p-6 sm:p-8"
      style={{
        borderColor: `${rev.accent}33`,
        background: `linear-gradient(135deg, ${rev.accent}0d 0%, oklch(0.16 0.012 60) 100%)`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${rev.accent}, transparent)` }} />
      <div
        className="absolute -right-10 -top-10 font-serif text-[12rem] font-bold leading-none opacity-[0.06]"
        style={{ color: rev.accent }}
      >
        {rev.label}
      </div>

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
        {/* Left: icon + period */}
        <div className="flex flex-row items-center gap-4 md:flex-col md:items-start">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border"
            style={{ borderColor: `${rev.accent}44`, background: `${rev.accent}14`, color: rev.accent }}
          >
            <rev.icon className="h-8 w-8" />
          </div>
          <div>
            <div className="font-serif text-3xl font-bold" style={{ color: rev.accent }}>{rev.label}</div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-foreground/50">
              <Clock className="mr-1 inline h-3 w-3" />{rev.period}
            </div>
            <div className="mt-1 text-xs text-foreground/55">📍 {rev.location}</div>
          </div>
        </div>

        {/* Right: content */}
        <div>
          <h3 className="font-serif text-xl font-bold leading-tight text-foreground sm:text-2xl">{rev.title}</h3>
          <ul className="mt-4 space-y-2">
            {rev.bullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-start gap-2 text-sm leading-relaxed text-foreground/80"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: rev.accent }}
                />
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
          {/* Tech tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {rev.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em]"
                style={{ borderColor: `${rev.accent}44`, color: rev.accent, background: `${rev.accent}10` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
