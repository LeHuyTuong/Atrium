// Atrium — Dữ liệu câu hỏi trắc nghiệm
// 3 câu hỏi/kỷ nguyên × 4 kỷ nguyên = 12 câu

import { PhaseId } from "./museum-data";

export interface QuizQuestion {
  id: string;
  phase: PhaseId;
  prompt: string;
  options: string[];
  answer: number; // index đúng
  explanation: string;
  exhibitId: string; // hiện vật liên quan
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Industry 1.0
  {
    id: "q1-1",
    phase: "industry-1",
    prompt: "Động cơ hơi nước Watt cải tiến phiên bản Newcomen bằng cách thêm gì?",
    options: [
      "Xi-lanh lớn hơn",
      "Buồng ngưng tách biệt",
      "Bánh đà nặng hơn",
      "Nhiều piston",
    ],
    answer: 1,
    explanation:
      "Watt thêm buồng ngưng riêng để xi-lanh không phải thay đổi nhiệt độ liên tục, tăng hiệu suất gấp 4.",
    exhibitId: "watt-steam",
  },
  {
    id: "q1-2",
    phase: "industry-1",
    prompt: "Khung cửi Jacquard (1804) là tiền thân trực tiếp của công nghệ nào?",
    options: ["Động cơ hơi nước", "Băng đục lỗ → máy tính", "Đường sắt", "Đèn gas"],
    answer: 1,
    explanation:
      "Băng đục lỗ của Jacquard điều khiển hoa văn dệt — Babbage và Hollerith lấy ý tưởng cho máy tính đầu tiên.",
    exhibitId: "jacquard-loom",
  },
  {
    id: "q1-3",
    phase: "industry-1",
    prompt: "Đường hầm Thames (1843) của Brunel phát minh ra gì?",
    options: [
      "Xi-lanh hơi nước",
      "Máy đào hầm (khiên hầm)",
      "Đường sắt ngầm",
      "Cầu treo",
    ],
    answer: 1,
    explanation:
      "Khiên hầm của Brunel bảo vệ công nhân khi đào — tổ tiên của mọi TBM ngày nay.",
    exhibitId: "thames-tunnel",
  },

  // Industry 2.0
  {
    id: "q2-1",
    phase: "industry-2",
    prompt: "Bóng đèn Edison (1879) dùng sợi đốt làm từ gì?",
    options: ["Vonfram", "Tre cácbon hóa", "Bạch kim", "Sợi thép"],
    answer: 1,
    explanation:
      "Sau hàng nghìn thí nghiệm, Edison chọn sợi tre cácbon hóa — bền 40 giờ, đủ rẻ để bán.",
    exhibitId: "light-bulb",
  },
  {
    id: "q2-2",
    phase: "industry-2",
    prompt: "Băng chuyền Ford (1913) giảm thời gian lắp một chiếc Model T xuống bao nhiêu?",
    options: ["Từ 12 giờ xuống 90 phút", "Từ 5 giờ xuống 1 giờ", "Từ 20 giờ xuống 5 giờ", "Từ 8 giờ xuống 2 giờ"],
    answer: 0,
    explanation:
      "Thời gian lắp giảm từ 12 giờ xuống 90 phút, giá giảm từ 850 xuống 260 USD — Model T chiếm 50% thị trường thế giới.",
    exhibitId: "model-t",
  },
  {
    id: "q2-3",
    phase: "industry-2",
    prompt: "Cuộc « chiến dòng điện » AC vs DC thắng bên nào và nhờ công nghệ gì?",
    options: [
      "DC thắng nhờ pin rẻ",
      "AC thắng nhờ máy biến áp truyền điện đi xa",
      "Hòa — cả hai cùng tồn tại",
      "DC thắng vì an toàn hơn",
    ],
    answer: 1,
    explanation:
      "Máy biến áp (1885, Hungary) cho phép AC tăng điện áp truyền đi hàng trăm km — DC của Edison chỉ đi được vài km.",
    exhibitId: "ac-transformer",
  },

  // Industry 3.0
  {
    id: "q3-1",
    phase: "industry-3",
    prompt: "Vi xử lý Intel 4004 (1971) chứa bao nhiêu bóng bán dẫn?",
    options: ["2.300", "23.000", "230.000", "2,3 triệu"],
    answer: 0,
    explanation:
      "2.300 bóng bán dẫn trên 12 mm² — toàn bộ CPU trong một con chip, khởi đầu kỷ nguyên vi xử lý.",
    exhibitId: "intel-4004",
  },
  {
    id: "q3-2",
    phase: "industry-3",
    prompt: "Tin nhắn đầu tiên trên ARPANET (1969) là gì?",
    options: ["Hello", "« lo » (nửa chữ login)", "ping", "test"],
    answer: 1,
    explanation:
      "Charley Kline cố gửi « login » nhưng máy nhận sập sau « lo » — tin nhắn đầu tiên của internet chỉ có 2 chữ.",
    exhibitId: "arpanet",
  },
  {
    id: "q3-3",
    phase: "industry-3",
    prompt: "Tim Berners-Lee khi phát minh World Wide Web (1989) đã làm gì với bằng sáng chế?",
    options: [
      "Bán cho Microsoft giá cao",
      "Giữ và thu phí bản quyền",
      "Cấp miễn phí cho thế giới",
      "Chỉ cấp cho các trường đại học",
    ],
    answer: 2,
    explanation:
      "Berners-Lee quyết định KHÔNG cấp bằng sáng chế — Web miễn phí cho mọi người, một trong những hành động hào phóng nhất lịch sử kỹ thuật.",
    exhibitId: "www",
  },

  // Industry 4.0
  {
    id: "q4-1",
    phase: "industry-4",
    prompt: "AlexNet (2012) là mạng nơ-ron sâu đã thắng cuộc thi nào với tỷ lệ giảm bao nhiêu?",
    options: [
      "ImageNet — lỗi giảm từ 26% xuống 15%",
      "CIFAR — lỗi giảm từ 40% xuống 20%",
      "MNIST — lỗi giảm từ 5% xuống 1%",
      "COCO — lỗi giảm từ 50% xuống 30%",
    ],
    answer: 0,
    explanation:
      "AlexNet thắng ImageNet 2012, tỷ lệ lỗi giảm từ 26% xuống 15% — thức tỉnh AI sau « mùa đông ».",
    exhibitId: "neural-net",
  },
  {
    id: "q4-2",
    phase: "industry-4",
    prompt: "Falcon 9 (SpaceX) năm 2015 đã làm điều gì chưa từng có?",
    options: [
      "Đưa người lên ISS giá rẻ",
      "Phóng 100 vệ tinh cùng lúc",
      "Tầng tên lửa hạ cánh thẳng đứng để tái sử dụng",
      "Đi đến Mặt Trăng và quay về",
    ],
    answer: 2,
    explanation:
      "21/12/2015, tầng đầu Falcon 9 hạ cánh thẳng đứng — lần đầu tên lửa quỹ đạo « đi về », giảm chi phí phóng ×10.",
    exhibitId: "falcon-9",
  },
  {
    id: "q4-3",
    phase: "industry-4",
    prompt: "Kiến trúc Transformer (2017) bỏ điều gì và thay bằng gì?",
    options: [
      "Bỏ vòng lặp, thay bằng cơ chế « chú ý »",
      "Bỏ nơ-ron, thay bằng bảng tra cứu",
      "Bỏ softmax, thay bằng sigmoid",
      "Bỏ huấn luyện, thay bằng quy tắc cứng",
    ],
    answer: 0,
    explanation:
      "Transformer bỏ vòng lặp RNN, dùng « attention » để mỗi từ nhìn tất cả từ khác cùng lúc — nền móng của GPT, Claude, Gemini.",
    exhibitId: "transformer-arch",
  },
];

export function questionsForPhase(phase: PhaseId): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.phase === phase);
}
