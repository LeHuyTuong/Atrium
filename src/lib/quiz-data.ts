// Atrium — Dữ liệu câu hỏi trắc nghiệm
// 1 câu hỏi/kỷ nguyên × 4 kỷ nguyên = 4 câu

import { PhaseId } from "./museum-data";

export interface QuizQuestion {
  id: string;
  phase: PhaseId;
  prompt: string;
  options: string[];
  answer: number; // index đúng (0-indexed)
  explanation: string;
  exhibitId: string; // hiện vật liên quan
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Industry 1.0
  {
    id: "q1-1",
    phase: "industry-1",
    prompt: "Động cơ hơi nước Watt cải tiến phiên bản Newcomen bằng cách thêm bộ phận quan trọng nào?",
    options: [
      "Xi-lanh có kích thước lớn hơn",
      "Buồng ngưng hơi nước tách biệt",
      "Bánh đà bằng sắt đúc nặng hơn",
      "Piston kép truyền lực gián tiếp",
    ],
    answer: 1,
    explanation:
      "James Watt đã thêm một buồng ngưng hơi nước riêng biệt để giữ cho xi-lanh chính luôn nóng, giúp tiết kiệm tới 75% lượng than tiêu thụ và tăng hiệu suất lên gấp 4 lần.",
    exhibitId: "watt-steam",
  },

  // Industry 2.0
  {
    id: "q2-1",
    phase: "industry-2",
    prompt: "Chuyến hành trình lái xe đường dài đầu tiên trong lịch sử bằng xe hơi chạy xăng (để chứng minh tính thực tế của Benz Patent-Motorwagen) do ai thực hiện?",
    options: [
      "Karl Benz tự lái xe thử nghiệm",
      "Bà Bertha Benz (vợ của Karl Benz)",
      "Werner von Siemens",
      "Henry Ford và các cộng sự",
    ],
    answer: 1,
    explanation:
      "Bà Bertha Benz đã thực hiện chuyến hành trình lái xe đường dài đầu tiên trong lịch sử (106 km) mà không báo cho chồng để chứng minh tính thực tế của chiếc xe ô tô Benz Patent-Motorwagen với công chúng.",
    exhibitId: "motorwagen",
  },

  // Industry 3.0
  {
    id: "q3-1",
    phase: "industry-3",
    prompt: "Vi xử lý Intel 4004 (1971) — bộ vi xử lý đơn chip thương mại đầu tiên trên thế giới — tích hợp bao nhiêu bóng bán dẫn?",
    options: ["2.300 bóng bán dẫn", "23.000 bóng bán dẫn", "230.000 bóng bán dẫn", "2,3 triệu bóng bán dẫn"],
    answer: 0,
    explanation:
      "Chỉ rộng 12 mm², Intel 4004 tích hợp 2.300 bóng bán dẫn, mang lại sức mạnh tính toán tương đương chiếc máy tính khổng lồ ENIAC chiếm cả căn phòng rộng trước đó.",
    exhibitId: "intel-4004",
  },

  // Industry 4.0
  {
    id: "q4-1",
    phase: "industry-4",
    prompt: "Để thực hiện một cú lộn nhào ngược (backflip) hoàn hảo, hệ thống máy tính của robot hình người Boston Dynamics Atlas phải làm gì?",
    options: [
      "Chạy một chương trình phát lại video động tác có sẵn",
      "Sử dụng điều khiển từ xa từ kỹ sư vận hành bên ngoài",
      "Thực hiện hàng nghìn phép tính quỹ đạo thời gian thực để duy trì sự cân bằng động",
      "Dựa vào các cảm biến cơ học vật lý thuần túy không cần tính toán",
    ],
    answer: 2,
    explanation:
      "Mỗi cú lộn nhào ngược (backflip) của Atlas yêu cầu hệ thống máy tính trên bo mạch thực hiện hàng nghìn phép tính quỹ đạo thời gian thực để duy trì sự cân bằng động một cách hoàn hảo trong không gian.",
    exhibitId: "atlas-robot",
  },
];

export function questionsForPhase(phase: PhaseId): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.phase === phase);
}
