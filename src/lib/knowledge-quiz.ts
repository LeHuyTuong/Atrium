// Thư viện tri thức — Quiz kiểm tra kiến thức
// 10 câu trắc nghiệm tiếng Việt

export interface KnowledgeQuestion {
  id: string;
  chapterId: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: "kq-1",
    chapterId: "chapter-1",
    prompt: "Cách mạng công nghiệp là gì?",
    options: [
      "Sự cải tiến kỹ thuật đơn thuần",
      "Bước phát triển nhảy vọt về chất của tư liệu lao động, thay đổi căn bản phân công lao động xã hội",
      "Sự tăng trưởng kinh tế dựa trên lao động thủ công",
      "Quá trình chuyển đổi từ nông nghiệp sang thương mại",
    ],
    answer: 1,
    explanation: "CMCN là bước nhảy vọt về CHẤT của tư liệu lao động, làm thay đổi căn bản phân công lao động xã hội và nâng cao năng suất lao động.",
  },
  {
    id: "kq-2",
    chapterId: "chapter-1",
    prompt: "Cách mạng công nghiệp lần thứ nhất (1760–1840) đặc trưng bởi điều gì?",
    options: ["Điện năng và sản xuất hàng loạt", "Điện tử và máy tính", "Hơi nước và cơ giới hóa", "AI và Big Data"],
    answer: 2,
    explanation: "CMCN lần 1 đặc trưng bởi động cơ hơi nước và cơ giới hóa, đi đầu là ngành dệt Anh.",
  },
  {
    id: "kq-3",
    chapterId: "chapter-1",
    prompt: "Cách mạng công nghiệp 4.0 đặc trưng bởi điều gì?",
    options: ["Hơi nước và cơ giới hóa", "Điện năng và dây chuyền lắp ráp", "Điện tử và máy tính", "AI, Big Data, IoT, robot, in 3D"],
    answer: 3,
    explanation: "CMCN 4.0 (2011–nay) đặc trưng bởi AI, Big Data, IoT, robot, in 3D — sự hội tụ của vật lý, số và sinh học.",
  },
  {
    id: "kq-4",
    chapterId: "chapter-1",
    prompt: "Vai trò của cách mạng công nghiệp đối với lực lượng sản xuất là gì?",
    options: ["Làm giảm năng suất lao động", "Thúc đẩy phát triển lực lượng sản xuất, năng suất tăng vọt", "Không ảnh hưởng đến lực lượng sản xuất", "Chỉ ảnh hưởng đến nông nghiệp"],
    answer: 1,
    explanation: "CMCN tạo ra tư liệu lao động, năng lượng, vật liệu mới → năng suất lao động tăng vọt theo cấp số nhân.",
  },
  {
    id: "kq-5",
    chapterId: "chapter-2",
    prompt: "Công nghiệp hóa, hiện đại hóa là gì?",
    options: [
      "Quá trình chuyển đổi từ lao động thủ công sang lao động sử dụng công nghệ hiện đại",
      "Quá trình phát triển chỉ ngành nông nghiệp",
      "Quá trình đóng cửa nền kinh tế",
      "Quá trình giảm thiểu công nghiệp",
    ],
    answer: 0,
    explanation: "CNH-HĐH là quá trình chuyển đổi từ lao động thủ công sang lao động sử dụng công nghệ hiện đại nhằm tạo năng suất cao.",
  },
  {
    id: "kq-6",
    chapterId: "chapter-2",
    prompt: "Tại sao công nghiệp hóa là tất yếu ở Việt Nam?",
    options: [
      "Để duy trì nền nông nghiệp lạc hậu",
      "Để phát triển lực lượng sản xuất, nâng cao năng lực cạnh tranh, thích ứng 4.0",
      "Để đóng cửa nền kinh tế",
      "Để giảm năng suất lao động",
    ],
    answer: 1,
    explanation: "CNH-HĐH tất yếu để phát triển lực lượng sản xuất, nâng cao năng lực cạnh tranh quốc gia, xây dựng cơ sở vật chất, thích ứng 4.0.",
  },
  {
    id: "kq-7",
    chapterId: "chapter-2",
    prompt: "Đặc trưng nào KHÔNG đúng về CNH-HĐH ở Việt Nam?",
    options: ["Theo định hướng xã hội chủ nghĩa", "Gắn với kinh tế tri thức", "Đóng cửa, tự cấp tự túc", "Gắn với hội nhập quốc tế"],
    answer: 2,
    explanation: "CNH-HĐH Việt Nam có 4 đặc trưng: định hướng XHCN, gắn kinh tế tri thức, gắn kinh tế thị trường, gắn hội nhập quốc tế — KHÔNG đóng cửa.",
  },
  {
    id: "kq-8",
    chapterId: "chapter-3",
    prompt: "Một tác động tích cực của hội nhập kinh tế quốc tế là gì?",
    options: ["Giảm cạnh tranh trong nước", "Mở rộng thị trường xuất khẩu, tiếp thu công nghệ", "Tăng phụ thuộc kinh tế", "Hạn chế giao lưu văn hóa"],
    answer: 1,
    explanation: "Tác động tích cực: mở rộng thị trường, tiếp thu công nghệ, nâng cao nguồn nhân lực, thúc đẩy giao lưu văn hóa chính trị.",
  },
  {
    id: "kq-9",
    chapterId: "chapter-3",
    prompt: "Tác động tiêu cực nào của hội nhập kinh tế quốc tế được nhắc đến?",
    options: ["Tăng trưởng kinh tế tức thì", "Cạnh tranh gay gắt, phụ thuộc kinh tế, tội phạm xuyên quốc gia", "Không có tác động tiêu cực", "Chỉ có lợi, không có hại"],
    answer: 1,
    explanation: "Tác động tiêu cực: cạnh tranh gay gắt, phụ thuộc kinh tế, phân phối lợi ích không đều, thách thức chủ quyền, tội phạm xuyên quốc gia.",
  },
  {
    id: "kq-10",
    chapterId: "chapter-3",
    prompt: "Để nâng cao hiệu quả hội nhập, Việt Nam cần làm gì?",
    options: ["Đóng cửa nền kinh tế", "Xây dựng nền kinh tế độc lập tự chủ, đa dạng hóa đối tác, hoàn thiện thể chế", "Chỉ tập trung vào một thị trường", "Từ bỏ FTA"],
    answer: 1,
    explanation: "5 phương hướng: nhận thức rõ, chiến lược phù hợp, hoàn thiện thể chế, nâng cao năng lực cạnh tranh, xây dựng kinh tế độc lập tự chủ.",
  },
];

export const TOTAL_KNOWLEDGE_QUESTIONS = KNOWLEDGE_QUESTIONS.length;
