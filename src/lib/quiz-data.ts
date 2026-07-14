// Atrium — Dữ liệu câu hỏi trắc nghiệm
// 3 câu hỏi/kỷ nguyên × 4 kỷ nguyên = 12 câu hỏi

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
  // ==================== INDUSTRY 1.0 ====================
  {
    id: "q1-1",
    phase: "industry-1",
    prompt: "Động cơ hơi nước cải tiến của James Watt (1769) giảm tiêu thụ than bằng cách thêm bộ phận đột phá nào?",
    options: [
      "Xi-lanh có kích thước lớn hơn gấp đôi",
      "Bộ ngưng tụ hơi nước riêng biệt (Separate Condenser)",
      "Bánh đà đúc bằng sắt nặng hơn",
      "Piston kép hoạt động hai chiều"
    ],
    answer: 1,
    explanation:
      "James Watt đã phát minh ra bộ ngưng tụ hơi nước riêng biệt để giữ cho xi-lanh chính luôn nóng, giúp tiết kiệm tới 75% lượng than tiêu thụ và nâng hiệu suất nhiệt lên vượt bậc.",
    exhibitId: "watt-steam",
  },
  {
    id: "q1-2",
    phase: "industry-1",
    prompt: "Con thoi bay (Flying Shuttle) do John Kay phát minh vào năm 1733 đã mang lại cải tiến gì cho ngành dệt?",
    options: [
      "Tự động hóa hoàn toàn quá trình xe sợi",
      "Cho phép dệt vải khổ rộng nhanh hơn gấp đôi chỉ với một thợ dệt",
      "Thay thế toàn bộ sợi bông bằng sợi len tổng hợp",
      "Sử dụng động cơ điện để vận hành con thoi dệt"
    ],
    answer: 1,
    explanation:
      "Con thoi bay giúp người thợ dệt có thể dệt các tấm vải rộng một cách nhanh chóng bằng một tay, giải phóng sức lao động của người thợ phụ và tăng năng suất ngành dệt gấp hai lần.",
    exhibitId: "flying-shuttle",
  },
  {
    id: "q1-3",
    phase: "industry-1",
    prompt: "Đầu máy hơi nước Stephenson Rocket (1829) giành chiến thắng tại cuộc thi Rainhill nhờ cải tiến nồi hơi nào?",
    options: [
      "Sử dụng bình gas nén chịu áp lực cao",
      "Thiết kế nồi hơi nhiều ống lửa (Multi-tubular boiler)",
      "Động cơ đốt trong truyền động gián tiếp",
      "Hệ thống trục khuỷu lệch tâm hành tinh"
    ],
    answer: 1,
    explanation:
      "Stephenson Rocket sử dụng nồi hơi nhiều ống đồng nhỏ chạy qua bình chứa nước để tăng diện tích truyền nhiệt, giúp sinh hơi nước nhanh hơn và tạo lực đẩy lớn hơn rất nhiều.",
    exhibitId: "rocket-locomotive",
  },

  // ==================== INDUSTRY 2.0 ====================
  {
    id: "q2-1",
    phase: "industry-2",
    prompt: "Ai đã thực hiện chuyến hành trình lái xe đường dài đầu tiên trong lịch sử bằng xe xăng Benz Patent-Motorwagen vào năm 1888?",
    options: [
      "Karl Benz tự mình lái xe thử nghiệm",
      "Bà Bertha Benz (vợ của nhà sáng chế Karl Benz)",
      "Werner von Siemens",
      "Henry Ford"
    ],
    answer: 1,
    explanation:
      "Bà Bertha Benz cùng hai con trai đã thực hiện chuyến hành trình dài 106 km để chứng minh tính khả thi, tin cậy và bền bỉ của chiếc xe hơi chạy xăng đầu tiên với công chúng.",
    exhibitId: "motorwagen",
  },
  {
    id: "q2-2",
    phase: "industry-2",
    prompt: "Ý tưởng cốt lõi của lò luyện Bessemer (1856) để sản xuất thép hàng loạt là gì?",
    options: [
      "Đốt thêm lượng than củi lớn hơn trong lò kín",
      "Thổi luồng không khí qua gang lỏng để đốt cháy tạp chất carbon",
      "Sử dụng dòng điện cường độ cao để nung chảy sắt",
      "Trộn lẫn quặng sắt với hợp kim đồng niken"
    ],
    answer: 1,
    explanation:
      "Lò chuyển Bessemer thổi khí oxy qua gang nóng chảy, quá trình oxy hóa tự nhiên sinh nhiệt cực cao đốt cháy lượng carbon dư thừa mà không cần dùng chất đốt ngoài, rút ngắn thời gian luyện thép.",
    exhibitId: "bessemer-converter",
  },
  {
    id: "q2-3",
    phase: "industry-2",
    prompt: "Chuyến bay lịch sử đầu tiên có điều khiển của chiếc máy bay Wright Flyer (1903) tại Kitty Hawk kéo dài bao lâu?",
    options: [
      "Đúng 12 giây",
      "Đúng 12 phút",
      "Khoảng 1,2 giờ",
      "Hơn 12 giờ liên tục"
    ],
    answer: 0,
    explanation:
      "Vào ngày 17 tháng 12 năm 1903, Orville Wright đã điều khiển chiếc máy bay Wright Flyer cất cánh tự lực và bay l lửng trên không trong đúng 12 giây, mở ra kỷ nguyên hàng không nhân loại.",
    exhibitId: "wright-flyer",
  },

  // ==================== INDUSTRY 3.0 ====================
  {
    id: "q3-1",
    phase: "industry-3",
    prompt: "Vi xử lý thương mại đơn chip đầu tiên trên thế giới — Intel 4004 (1971) — tích hợp bao nhiêu bóng bán dẫn?",
    options: [
      "Tích hợp 2.300 bóng bán dẫn",
      "Tích hợp 23.000 bóng bán dẫn",
      "Tích hợp 230.000 bóng bán dẫn",
      "Tích hợp 2,3 triệu bóng bán dẫn"
    ],
    answer: 0,
    explanation:
      "Intel 4004 tích hợp 2.300 bóng bán dẫn trên một tấm silicon siêu nhỏ rộng 12 mm², mang lại sức mạnh tính toán tương đương chiếc máy tính khổng lồ ENIAC nặng 27 tấn trước đó.",
    exhibitId: "intel-4004",
  },
  {
    id: "q3-2",
    phase: "industry-3",
    prompt: "Cánh tay robot công nghiệp Unimate đầu tiên (1961) được triển khai tại nhà máy General Motors nhằm mục đích gì?",
    options: [
      "Lắp ráp vi mạch và bảng mạch điện tử",
      "Gắp các thanh đúc kim loại nóng đỏ và hàn điểm khung vỏ xe hơi",
      "Sơn phủ nano và đánh bóng kính chắn gió",
      "Vận chuyển hàng thành phẩm lên container tự động"
    ],
    answer: 1,
    explanation:
      "Unimate được giao thực hiện công việc nặng nhọc và nguy hiểm: gắp các chi tiết hợp kim đúc nóng đỏ và tiến hành hàn điểm trên thân vỏ ô tô nhằm bảo vệ an toàn cho công nhân.",
    exhibitId: "unimate-robot",
  },
  {
    id: "q3-3",
    phase: "industry-3",
    prompt: "Bộ lập trình PLC Modicon 084 (1969) ra đời đã giúp thay thế hệ thống điều khiển công nghiệp nào?",
    options: [
      "Hệ thống đòn bẩy và xích truyền lực cơ học",
      "Hệ thống tủ điện rơ-le và dây nối vật lý phức tạp",
      "Hệ thống máy tính mainframe cồng kềnh",
      "Động cơ hơi nước truyền động trục khuỷu"
    ],
    answer: 1,
    explanation:
      "PLC Modicon 084 thay thế hàng nghìn rơ-le cơ học bằng phần mềm điều khiển lưu trong bộ nhớ máy, cho phép lập trình lại dễ dàng và giúp dây chuyền tự động hóa linh hoạt vượt bậc.",
    exhibitId: "modicon-plc",
  },

  // ==================== INDUSTRY 4.0 ====================
  {
    id: "q4-1",
    phase: "industry-4",
    prompt: "Để thực hiện một cú lộn nhào ngược (backflip) thăng bằng, hệ thống máy tính của robot hình người Atlas phải làm gì?",
    options: [
      "Chạy một đoạn băng video động tác lập trình sẵn tĩnh",
      "Thực hiện hàng nghìn phép tính quỹ đạo cân bằng động trong thời gian thực",
      "Dùng hệ thống dây cáp chịu lực ẩn treo từ trên trần",
      "Dựa hoàn toàn vào các bánh răng hồi chuyển vật lý tự cân bằng"
    ],
    answer: 1,
    explanation:
      "Robot Atlas sử dụng hệ thống máy tính thời gian thực tích hợp trên bo mạch để tính toán phân bổ lực, mô-men xoắn tại các khớp thủy lực hàng nghìn lần mỗi giây nhằm giữ cân bằng động.",
    exhibitId: "atlas-robot",
  },
  {
    id: "q4-2",
    phase: "industry-4",
    prompt: "Trợ lý ảo điều khiển bằng giọng nói Siri được Apple tích hợp lần đầu tiên vào mẫu điện thoại nào vào năm 2011?",
    options: [
      "iPhone 3GS",
      "iPhone 4",
      "iPhone 4S",
      "iPhone 5"
    ],
    answer: 2,
    explanation:
      "Siri ra mắt công chúng lần đầu cùng với chiếc iPhone 4S vào ngày 4 tháng 10 năm 2011, đánh mốc cột mốc lịch sử đưa trí tuệ nhân tạo (AI) hội thoại đến tay người dùng phổ thông.",
    exhibitId: "iphone-4s",
  },
  {
    id: "q4-3",
    phase: "industry-4",
    prompt: "Thiết bị loa thông minh Amazon Echo (2014) tích hợp trợ lý ảo điều khiển bằng giọng nói tên là gì?",
    options: [
      "Siri",
      "Cortana",
      "Alexa",
      "Google Assistant"
    ],
    answer: 2,
    explanation:
      "Amazon Echo tích hợp trợ lý ảo Alexa dựa trên đám mây, giúp người dùng ra lệnh phát nhạc, quản lý lịch trình, trả lời câu hỏi và điều khiển nhà thông minh hoàn toàn bằng giọng nói.",
    exhibitId: "amazon-echo",
  },
];

export function questionsForPhase(phase: PhaseId): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.phase === phase);
}
