// Thư viện tri thức — Dữ liệu bài học
// 4 chương: Khái quát CMCN, CNH-HĐH VN, Hội nhập KTQT, Kiểm tra

export interface LessonSection {
  heading: string;
  body: string;
  keywords?: string[];
}

export type InteractiveKind = "comparison-table" | "roadmap-timeline" | "concept-map";

export interface InteractiveBlock {
  kind: InteractiveKind;
  title: string;
  columns?: ComparisonColumn[];
  stages?: RoadmapStage[];
  nodes?: ConceptNode[];
  centerLabel?: string;
}

export interface ComparisonColumn {
  label: string;
  accent: string;
  period: string;
  features: { label: string; value: string }[];
}

export interface RoadmapStage {
  step: number;
  label: string;
  title: string;
  description: string;
  icon: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  description: string;
  col: number;
  row: number;
  isCenter?: boolean;
  accent?: string;
}

export interface Lesson {
  id: string;
  chapterId: ChapterId;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  interactive?: InteractiveBlock;
}

export type ChapterId = "chapter-1" | "chapter-2" | "chapter-3" | "chapter-4";

export interface Chapter {
  id: ChapterId;
  index: number;
  title: string;
  subtitle: string;
  accent: string;
  icon: string;
  lessons: Lesson[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "chapter-1",
    index: 1,
    title: "Khái quát Cách mạng công nghiệp",
    subtitle: "Bốn cuộc cách mạng đã thay đổi thế giới",
    accent: "#e89446",
    icon: "Factory",
    lessons: [
      {
        id: "c1-l1",
        chapterId: "chapter-1",
        title: "Khái niệm cách mạng công nghiệp",
        subtitle: "Bước nhảy vọt về chất của tư liệu lao động",
        icon: "BookOpen",
        duration: "3 phút",
        sections: [
          {
            heading: "Định nghĩa",
            body: "Cách mạng công nghiệp là bước phát triển nhảy vọt về chất của tư liệu lao động, làm thay đổi căn bản phân công lao động xã hội và nâng cao năng suất lao động. Nó không chỉ là sự cải tiến kỹ thuật đơn thuần, mà là sự biến đổi toàn diện về phương thức sản xuất.",
            keywords: ["nhảy vọt về chất", "tư liệu lao động", "phân công lao động", "năng suất lao động"],
          },
          {
            heading: "Bản chất",
            body: "Cách mạng công nghiệp biến lao động thủ công sang lao động máy móc, từ năng lượng sinh lực sang năng lượng cơ khí và điện. Nó tạo ra sự tích tụ và tập trung sản xuất, dẫn đến sự ra đời của các hình thức tổ chức sản xuất mới.",
            keywords: ["thủ công", "máy móc", "tích tụ", "tập trung sản xuất"],
          },
        ],
        keyTakeaways: [
          "CMCN là bước nhảy vọt về CHẤT, không chỉ về lượng",
          "Thay đổi căn bản phân công lao động xã hội",
          "Nâng cao năng suất lao động",
        ],
      },
      {
        id: "c1-l2",
        chapterId: "chapter-1",
        title: "Lịch sử 4 cuộc cách mạng công nghiệp",
        subtitle: "Từ hơi nước đến trí tuệ nhân tạo",
        icon: "History",
        duration: "5 phút",
        sections: [
          {
            heading: "Cách mạng công nghiệp lần thứ nhất (1760–1840)",
            body: "Đặc trưng bởi động cơ hơi nước và cơ giới hóa. Ngành dệt Anh đi đầu, sau đó lan sang luyện kim, đường sắt. Con người chuyển từ lao động thủ công sang máy móc, từ nông thôn sang thành thị.",
            keywords: ["hơi nước", "cơ giới hóa", "ngành dệt", "1760–1840"],
          },
          {
            heading: "Cách mạng công nghiệp lần thứ hai (1870–1914)",
            body: "Đặc trưng bởi điện năng và sản xuất hàng loạt. Dây chuyền lắp ráp của Ford, động cơ đốt trong, vô tuyến, hóa chất. Mỹ và Đức vượt qua Anh, trở thành cường quốc công nghiệp.",
            keywords: ["điện năng", "sản xuất hàng loạt", "dây chuyền lắp ráp", "1870–1914"],
          },
          {
            heading: "Cách mạng công nghiệp lần thứ ba (1969–2010)",
            body: "Đặc trưng bởi điện tử, máy tính và tự động hóa. Vi xử lý, internet, điện thoại di động. Trí tuệ bắt đầu được nhân bản thành hàng triệu bản sao qua silicon.",
            keywords: ["điện tử", "máy tính", "tự động hóa", "1969–2010"],
          },
          {
            heading: "Cách mạng công nghiệp lần thứ tư (2011–nay)",
            body: "Đặc trưng bởi AI, Big Data, IoT, robot, in 3D. Sự hội tụ của thế giới vật lý, kỹ thuật số và sinh học. Máy móc bắt đầu tự nhận biết, tự quyết định và tự tối ưu.",
            keywords: ["AI", "Big Data", "IoT", "robot", "in 3D", "2011–nay"],
          },
        ],
        keyTakeaways: [
          "4 cuộc CMCN kéo dài 260 năm, mỗi cuộc rút ngắn thời gian",
          "Mỗi cuộc đều có nguồn năng lượng + công nghệ lõi riêng",
          "CMCN 4.0 hội tụ vật lý + số + sinh học",
        ],
      },
      {
        id: "c1-l3",
        chapterId: "chapter-1",
        title: "Vai trò của cách mạng công nghiệp",
        subtitle: "Thúc đẩy lực lượng sản xuất, hoàn thiện quan hệ sản xuất",
        icon: "TrendingUp",
        duration: "3 phút",
        sections: [
          {
            heading: "Thúc đẩy phát triển lực lượng sản xuất",
            body: "CMCN tạo ra tư liệu lao động mới, năng lượng mới, vật liệu mới → năng suất lao động tăng vọt. Lực lượng sản xuất phát triển theo cấp số nhân thay vì tuyến tính.",
            keywords: ["lực lượng sản xuất", "năng suất lao động"],
          },
          {
            heading: "Hoàn thiện quan hệ sản xuất",
            body: "CMCN buộc quan hệ sản xuất phải thay đổi để phù hợp. Từ phong kiến sang tư bản, từ tư bản sang các hình thức tổ chức mới. Sở hữu và phân phối thay đổi.",
            keywords: ["quan hệ sản xuất", "sở hữu", "phân phối"],
          },
          {
            heading: "Đổi mới phương thức quản trị",
            body: "Quản lý từ gia đình/craft sang nhà máy, từ nhà máy sang tập đoàn, từ tập đoàn sang mạng lưới. Mỗi CMCN đòi hỏi mô hình quản trị mới.",
            keywords: ["phương thức quản trị", "nhà máy", "tập đoàn", "mạng lưới"],
          },
        ],
        keyTakeaways: [
          "CMCN thúc đẩy lực lượng sản xuất theo cấp số nhân",
          "Quan hệ sản xuất phải thay đổi để phù hợp",
          "Mô hình quản trị đổi mới theo từng cuộc CMCN",
        ],
      },
      {
        id: "c1-l4",
        chapterId: "chapter-1",
        title: "Các mô hình công nghiệp hóa trên thế giới",
        subtitle: "Cổ điển · Liên Xô · Nhật Bản và NICs",
        icon: "LayoutGrid",
        duration: "5 phút",
        sections: [
          {
            heading: "Tổng quan",
            body: "Trên thế giới đã có nhiều mô hình công nghiệp hóa khác nhau, mỗi mô hình phản ánh điều kiện lịch sử và bối cảnh kinh tế riêng. Ba mô hình tiêu biểu là: mô hình cổ điển (Anh, Tây Âu), mô hình công nghiệp hóa kiểu Liên Xô, và mô hình Nhật Bản cùng các NICs.",
            keywords: ["mô hình cổ điển", "Liên Xô", "Nhật Bản", "NICs"],
          },
          {
            heading: "Mô hình cổ điển (Anh, Tây Âu)",
            body: "Bắt đầu từ Anh thế kỷ 18. Đặc trưng: phát triển công nghiệp nhẹ (dệt) trước, sau đó mới đến công nghiệp nặng. Dựa trên thị trường tự do, tư bản tư nhân. Kéo dài 200+ năm. Phù hợp với bối cảnh thời kỳ đó — chưa có cạnh tranh quốc tế.",
            keywords: ["công nghiệp nhẹ", "dệt", "thị trường tự do", "tư bản tư nhân"],
          },
          {
            heading: "Mô hình công nghiệp hóa kiểu Liên Xô",
            body: "Bắt đầu từ thập niên 1920. Đặc trưng: ưu tiên công nghiệp nặng (cơ khí, luyện kim) trước, công nghiệp nhẹ sau. Nhà nước quản lý tập trung, kế hoạch hóa. Nhanh chóng xây dựng cơ sở vật chất nhưng thiếu hàng tiêu dùng, kém hiệu quả về mặt kinh tế.",
            keywords: ["công nghiệp nặng", "cơ khí", "luyện kim", "kế hoạch hóa", "nhà nước"],
          },
          {
            heading: "Mô hình Nhật Bản và NICs",
            body: "Nhật Bản sau 1945, NICs (Hàn Quốc, Đài Loan, Singapore, Hồng Kông) thập niên 1960-70. Đặc trưng: nhà nước định hướng nhưng vận hành theo thị trường, xuất khẩu là động lực, hấp thụ công nghệ, giáo dục là nền tảng. Thời gian rút ngắn còn 30-40 năm.",
            keywords: ["Nhật Bản", "NICs", "Hàn Quốc", "Đài Loan", "Singapore", "xuất khẩu", "hấp thụ công nghệ", "giáo dục"],
          },
        ],
        keyTakeaways: [
          "3 mô hình CNH: cổ điển (Anh), Liên Xô, Nhật Bản + NICs",
          "Cổ điển: nhẹ → nặng, 200+ năm",
          "Liên Xô: nặng trước, kế hoạch hóa",
          "Nhật Bản + NICs: xuất khẩu + công nghệ, 30-40 năm",
        ],
        interactive: {
          kind: "comparison-table",
          title: "So sánh 3 mô hình công nghiệp hóa",
          columns: [
            {
              label: "Mô hình cổ điển",
              accent: "#e89446",
              period: "Thế kỷ 18–19",
              features: [
                { label: "Đại diện", value: "Anh, Tây Âu, Mỹ" },
                { label: "Trình tự", value: "Công nghiệp nhẹ → nặng (dệt trước, rồi luyện kim)" },
                { label: "Động lực", value: "Thị trường tự do, tư bản tư nhân" },
                { label: "Vai trò nhà nước", value: "Tối thiểu, bảo vệ quyền sở hữu" },
                { label: "Thời gian", value: "200+ năm" },
                { label: "Kết quả", value: "Trở thành cường quốc công nghiệp đầu tiên" },
              ],
            },
            {
              label: "Mô hình Liên Xô",
              accent: "#c4392f",
              period: "1920–1990",
              features: [
                { label: "Đại diện", value: "Liên Xô, Đông Âu" },
                { label: "Trình tự", value: "Công nghiệp nặng trước (cơ khí, luyện kim)" },
                { label: "Động lực", value: "Kế hoạch hóa tập trung, nhà nước" },
                { label: "Vai trò nhà nước", value: "Toàn diện — sở hữu + quản lý" },
                { label: "Thời gian", value: "~60 năm" },
                { label: "Kết quả", value: "Cơ sở vật chất mạnh nhưng thiếu hàng tiêu dùng" },
              ],
            },
            {
              label: "Mô hình Nhật Bản + NICs",
              accent: "#4ade80",
              period: "1945–2000",
              features: [
                { label: "Đại diện", value: "Nhật Bản, Hàn Quốc, Đài Loan, Singapore" },
                { label: "Trình tự", value: "Song hành nhẹ + nặng, ưu tiên công nghệ" },
                { label: "Động lực", value: "Xuất khẩu, FDI, hấp thụ công nghệ" },
                { label: "Vai trò nhà nước", value: "Định hướng + thị trường (mô hình phát triển)" },
                { label: "Thời gian", value: "30–40 năm" },
                { label: "Kết quả", value: "Rút ngắn khoảng cách, trở thành nền kinh tế phát triển" },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "chapter-2",
    index: 2,
    title: "Công nghiệp hóa, hiện đại hóa ở Việt Nam",
    subtitle: "Hành trình từ thủ công đến công nghệ cao",
    accent: "#e8b53a",
    icon: "Building2",
    lessons: [
      {
        id: "c2-l1",
        chapterId: "chapter-2",
        title: "Khái niệm CNH-HĐH",
        subtitle: "Chuyển đổi từ thủ công sang công nghệ hiện đại",
        icon: "BookOpen",
        duration: "3 phút",
        sections: [
          {
            heading: "Định nghĩa",
            body: "Công nghiệp hóa, hiện đại hóa là quá trình chuyển đổi từ lao động thủ công sang lao động sử dụng công nghệ hiện đại nhằm tạo năng suất cao. CNH đi về phát triển công nghiệp, HĐH mở rộng ra mọi lĩnh vực kinh tế - xã hội.",
            keywords: ["chuyển đổi", "thủ công", "công nghệ hiện đại", "năng suất cao"],
          },
          {
            heading: "CNH và HĐH",
            body: "CNH (Công nghiệp hóa) tập trung vào việc phát triển công nghiệp, thay thế nông nghiệp. HĐH (Hiện đại hóa) rộng hơn — hiện đại hóa cả công nghiệp, nông nghiệp, dịch vụ, quản lý, văn hóa. Hai quá trình gắn bó chặt chẽ.",
            keywords: ["CNH", "HĐH", "công nghiệp hóa", "hiện đại hóa"],
          },
        ],
        keyTakeaways: [
          "CNH-HĐH là chuyển đổi từ thủ công sang công nghệ",
          "CNH đi về công nghiệp, HĐH mở rộng mọi lĩnh vực",
          "Mục tiêu: năng suất cao",
        ],
      },
      {
        id: "c2-l2",
        chapterId: "chapter-2",
        title: "Tính tất yếu của CNH-HĐH",
        subtitle: "Vì sao Việt Nam phải CNH-HĐH",
        icon: "Lightbulb",
        duration: "4 phút",
        sections: [
          {
            heading: "Phát triển lực lượng sản xuất",
            body: "CNH-HĐH tạo ra tư liệu lao động mới, vật liệu mới, năng lượng mới → năng suất lao động tăng. Đây là con đường duy nhất để Việt Nam thoát khỏi lạc hậu, nghèo nàn.",
            keywords: ["lực lượng sản xuất", "năng suất lao động", "thoát nghèo"],
          },
          {
            heading: "Nâng cao năng lực cạnh tranh quốc gia",
            body: "Trong bối cảnh toàn cầu hóa, quốc gia nào không CNH-HĐH sẽ tụt hậu. CNH-HĐH giúp hàng hóa Việt Nam cạnh tranh được trên thị trường quốc tế.",
            keywords: ["cạnh tranh quốc gia", "toàn cầu hóa", "tụt hậu"],
          },
          {
            heading: "Xây dựng cơ sở vật chất kỹ thuật",
            body: "CNH-HĐH tạo ra hạ tầng điện, đường, trường, trạm, viễn thông, cảng biển. Đây là nền tảng vật chất cho mọi hoạt động kinh tế - xã hội.",
            keywords: ["cơ sở vật chất", "hạ tầng", "viễn thông", "cảng biển"],
          },
          {
            heading: "Thích ứng với cách mạng công nghiệp 4.0",
            body: "CMCN 4.0 đang diễn ra. Nếu Việt Nam không CNH-HĐH, sẽ bị bỏ lại phía sau thêm một vòng nữa. Đây là cơ hội để đi tắt đón đầu.",
            keywords: ["4.0", "đi tắt đón đầu", "cơ hội"],
          },
        ],
        keyTakeaways: [
          "CNH-HĐH phát triển lực lượng sản xuất",
          "Nâng cao năng lực cạnh tranh quốc gia",
          "Xây dựng cơ sở vật chất kỹ thuật",
          "Thích ứng với 4.0",
        ],
      },
      {
        id: "c2-l3",
        chapterId: "chapter-2",
        title: "Đặc trưng CNH-HĐH ở Việt Nam",
        subtitle: "Bốn đặc trưng định hướng",
        icon: "Compass",
        duration: "3 phút",
        sections: [
          {
            heading: "Theo định hướng xã hội chủ nghĩa",
            body: "CNH-HĐH gắn với định hướng XHCN — phát triển kinh tế đi đôi với công bằng xã hội, không để ai bị bỏ lại phía sau. Khác với CNH-HĐH tư bản chủ nghĩa.",
            keywords: ["định hướng XHCN", "công bằng xã hội"],
          },
          {
            heading: "Gắn với kinh tế tri thức",
            body: "CNH-HĐH Việt Nam không lặp lại con đường cũ (từ nhẹ → nặng) mà đi thẳng sang kinh tế tri thức — công nghệ cao, viễn thông, sinh học.",
            keywords: ["kinh tế tri thức", "công nghệ cao", "viễn thông", "sinh học"],
          },
          {
            heading: "Gắn với kinh tế thị trường",
            body: "CNH-HĐH trong nền kinh tế thị trường định hướng XHCN. Đa thành phần kinh tế, cạnh tranh, giá cả do thị trường quyết định.",
            keywords: ["kinh tế thị trường", "đa thành phần", "cạnh tranh"],
          },
          {
            heading: "Gắn với hội nhập quốc tế",
            body: "CNH-HĐH không đóng cửa mà mở cửa — tham gia WTO, ASEAN, CPTPP, EVFTA. Hội nhập để tiếp thu công nghệ, vốn, thị trường.",
            keywords: ["hội nhập quốc tế", "WTO", "ASEAN", "CPTPP", "EVFTA"],
          },
        ],
        keyTakeaways: [
          "Định hướng XHCN — công bằng xã hội",
          "Gắn kinh tế tri thức — đi tắt đón đầu",
          "Gắn kinh tế thị trường — đa thành phần",
          "Gắn hội nhập quốc tế — mở cửa",
        ],
      },
      {
        id: "c2-l4",
        chapterId: "chapter-2",
        title: "Nội dung CNH-HĐH",
        subtitle: "Năm nội dung trọng tâm",
        icon: "ListChecks",
        duration: "4 phút",
        sections: [
          {
            heading: "Tạo lập điều kiện chuyển đổi",
            body: "Xây dựng hạ tầng, thể chế, nguồn nhân lực. Tạo môi trường thuận lợi cho CNH-HĐH diễn ra.",
            keywords: ["hạ tầng", "thể chế", "nguồn nhân lực"],
          },
          {
            heading: "Ứng dụng khoa học công nghệ",
            body: "Đầu tư R&D, chuyển giao công nghệ, đào tạo kỹ sư. Khoa học công nghệ là động lực then chốt.",
            keywords: ["R&D", "chuyển giao công nghệ", "kỹ sư"],
          },
          {
            heading: "Chuyển đổi cơ cấu kinh tế",
            body: "Giảm tỷ trọng nông nghiệp, tăng công nghiệp và dịch vụ. Chuyển từ giá trị thấp sang giá trị cao.",
            keywords: ["cơ cấu kinh tế", "nông nghiệp", "công nghiệp", "dịch vụ"],
          },
          {
            heading: "Hoàn thiện quan hệ sản xuất",
            body: "Cải cách doanh nghiệp nhà nước, phát triển kinh tế tư nhân, thu hút FDI. Đa dạng hóa hình thức sở hữu.",
            keywords: ["doanh nghiệp nhà nước", "kinh tế tư nhân", "FDI"],
          },
          {
            heading: "Thích ứng bối cảnh 4.0",
            body: "Số hóa nền kinh tế, phát triển AI, IoT, Big Data. Chuẩn bị nguồn nhân lực cho kỷ nguyên số.",
            keywords: ["số hóa", "AI", "IoT", "Big Data", "kỷ nguyên số"],
          },
        ],
        keyTakeaways: [
          "5 nội dung: điều kiện, KH-CN, cơ cấu, quan hệ sản xuất, 4.0",
          "KH-CN là động lực then chốt",
          "Số hóa là ưu tiên trong bối cảnh 4.0",
        ],
      },
    ],
  },
  {
    id: "chapter-3",
    index: 3,
    title: "Hội nhập kinh tế quốc tế",
    subtitle: "Việt Nam gắn kết với kinh tế thế giới",
    accent: "#4ade80",
    icon: "Globe",
    lessons: [
      {
        id: "c3-l1",
        chapterId: "chapter-3",
        title: "Khái niệm hội nhập kinh tế quốc tế",
        subtitle: "Gắn kết nền kinh tế với thế giới",
        icon: "BookOpen",
        duration: "3 phút",
        sections: [
          {
            heading: "Định nghĩa",
            body: "Hội nhập kinh tế quốc tế là quá trình Việt Nam gắn kết nền kinh tế với kinh tế thế giới trên cơ sở chia sẻ lợi ích và tuân thủ chuẩn mực quốc tế. Đây là quá trình hai chiều — vừa mở cửa, vừa bảo vệ lợi ích quốc gia.",
            keywords: ["gắn kết", "kinh tế thế giới", "chia sẻ lợi ích", "chuẩn mực quốc tế"],
          },
          {
            heading: "Các cấp độ hội nhập",
            body: "Từ thấp đến cao: khu vực mậu dịch tự do → liên minh thuế quan → thị trường chung → liên minh kinh tế. Việt Nam tham gia chủ yếu ở cấp độ FTA và liên minh thuế quan (ASEAN).",
            keywords: ["mậu dịch tự do", "liên minh thuế quan", "thị trường chung", "liên minh kinh tế", "FTA"],
          },
        ],
        keyTakeaways: [
          "Hội nhập = gắn kết + chia sẻ lợi ích + chuẩn mực",
          "Quá trình hai chiều — mở cửa và bảo vệ",
          "Việt Nam tham gia cấp độ FTA + ASEAN",
        ],
      },
      {
        id: "c3-l2",
        chapterId: "chapter-3",
        title: "Tính tất yếu của hội nhập",
        subtitle: "Vì sao Việt Nam phải hội nhập",
        icon: "Lightbulb",
        duration: "4 phút",
        sections: [
          {
            heading: "Xu hướng toàn cầu hóa",
            body: "Toàn cầu hóa là xu thế tất yếu của thời đại. Không quốc gia nào phát triển được nếu đóng cửa. Hội nhập là con đường duy nhất để tham gia chuỗi giá trị toàn cầu.",
            keywords: ["toàn cầu hóa", "xu thế tất yếu", "chuỗi giá trị toàn cầu"],
          },
          {
            heading: "Phương thức phát triển phổ biến",
            body: "Hội nhập là phương thức phát triển phổ biến của các quốc gia đang phát triển. Hàn Quốc, Singapore, Trung Quốc đều phát triển nhờ hội nhập.",
            keywords: ["phương thức phát triển", "Hàn Quốc", "Singapore", "Trung Quốc"],
          },
          {
            heading: "Mở rộng thị trường",
            body: "Hội nhập mở rộng thị trường xuất khẩu. Hàng hóa Việt Nam tiếp cận 60+ thị trường FTA. Xuất khẩu tăng → tăng trưởng kinh tế.",
            keywords: ["mở rộng thị trường", "xuất khẩu", "60+ thị trường", "tăng trưởng"],
          },
          {
            heading: "Thu hút vốn và chuyển giao công nghệ",
            body: "FDI mang lại vốn, công nghệ, kỹ năng quản lý. Việt Nam thu hút FDI đứng top đầu Đông Nam Á. Công nghệ từ FDI giúp CNH-HĐH nhanh hơn.",
            keywords: ["FDI", "chuyển giao công nghệ", "kỹ năng quản lý", "Đông Nam Á"],
          },
        ],
        keyTakeaways: [
          "Toàn cầu hóa là xu thế tất yếu",
          "Phương thức phát triển phổ biến",
          "Mở rộng thị trường 60+ FTA",
          "Thu hút FDI + công nghệ",
        ],
      },
      {
        id: "c3-l3",
        chapterId: "chapter-3",
        title: "Tác động tích cực của hội nhập",
        subtitle: "Cơ hội từ hội nhập quốc tế",
        icon: "ThumbsUp",
        duration: "3 phút",
        sections: [
          {
            heading: "Mở rộng thị trường",
            body: "Hàng hóa Việt Nam tiếp cận thị trường lớn hơn. Xuất khẩu tăng, doanh nghiệp có cơ hội phát triển. Các mặt hàng chủ lực: điện tử, dệt may, nông sản.",
            keywords: ["mở rộng thị trường", "xuất khẩu", "điện tử", "dệt may", "nông sản"],
          },
          {
            heading: "Tiếp thu công nghệ",
            body: "FDI mang theo công nghệ tiên tiến. Doanh nghiệp Việt Nam học hỏi qua liên doanh, đối tác. Công nghệ lan tỏa từ FDI sang doanh nghiệp nội địa.",
            keywords: ["tiếp thu công nghệ", "liên doanh", "đối tác", "lan tỏa"],
          },
          {
            heading: "Nâng cao chất lượng nguồn nhân lực",
            body: "Hội nhập buộc đào tạo nhân lực đạt chuẩn quốc tế. Lao động tiếp xúc với quy trình hiện đại. Cạnh tranh buộc nâng cao kỹ năng.",
            keywords: ["nguồn nhân lực", "chuẩn quốc tế", "quy trình hiện đại", "kỹ năng"],
          },
          {
            heading: "Thúc đẩy giao lưu văn hóa và chính trị",
            body: "Hội nhập kinh tế kéo theo giao lưu văn hóa, giáo dục, chính trị. Việt Nam nâng cao vị thế quốc tế, tham gia các diễn đàn quốc tế.",
            keywords: ["giao lưu văn hóa", "vị thế quốc tế", "diễn đàn quốc tế"],
          },
        ],
        keyTakeaways: [
          "Mở rộng thị trường xuất khẩu",
          "Tiếp thu công nghệ qua FDI",
          "Nâng cao nguồn nhân lực",
          "Thúc đẩy giao lưu văn hóa chính trị",
        ],
      },
      {
        id: "c3-l4",
        chapterId: "chapter-3",
        title: "Tác động tiêu cực của hội nhập",
        subtitle: "Thách thức cần đối phó",
        icon: "AlertTriangle",
        duration: "3 phút",
        sections: [
          {
            heading: "Cạnh tranh gay gắt",
            body: "Doanh nghiệp trong nước cạnh tranh với hàng ngoại chất lượng cao, giá rẻ. Nhiều doanh nghiệp nhỏ không chịu nổi → phá sản. Cần nâng cao năng lực cạnh tranh.",
            keywords: ["cạnh tranh gay gắt", "hàng ngoại", "phá sản", "năng lực cạnh tranh"],
          },
          {
            heading: "Phụ thuộc kinh tế",
            body: "Phụ thuộc thị trường xuất khẩu (Mỹ, EU, Trung Quốc). Khi kinh tế thế giới suy thoái, Việt Nam bị ảnh hưởng. Phụ thuộc vốn FDI, nguyên liệu nhập khẩu.",
            keywords: ["phụ thuộc kinh tế", "suy thoái", "FDI", "nguyên liệu nhập khẩu"],
          },
          {
            heading: "Phân phối lợi ích không đều",
            body: "Lợi ích hội nhập tập trung vào một số ngành, vùng, nhóm dân. Khoảng cách giàu nghèo tăng. Cần chính sách phân phối lại.",
            keywords: ["phân phối lợi ích", "khoảng cách giàu nghèo", "phân phối lại"],
          },
          {
            heading: "Thách thức chủ quyền quốc gia",
            body: "Áp lực từ các nước lớn, tổ chức quốc tế. Phải cân bằng lợi ích quốc gia và cam kết quốc tế. Chấp nhận một phần giới hạn chủ quyền kinh tế.",
            keywords: ["chủ quyền quốc gia", "áp lực", "cam kết quốc tế"],
          },
          {
            heading: "Tội phạm xuyên quốc gia",
            body: "Hội nhập mở cửa cho tội phạm xuyên quốc gia: buôn lậu, rửa tiền, ma túy, an ninh mạng. Cần hợp tác quốc tế chống tội phạm.",
            keywords: ["tội phạm xuyên quốc gia", "buôn lậu", "rửa tiền", "ma túy", "an ninh mạng"],
          },
        ],
        keyTakeaways: [
          "Cạnh tranh gay gắt với hàng ngoại",
          "Phụ thuộc thị trường + vốn FDI",
          "Phân phối lợi ích không đều",
          "Thách thức chủ quyền",
          "Tội phạm xuyên quốc gia",
        ],
      },
      {
        id: "c3-l5",
        chapterId: "chapter-3",
        title: "Phương hướng nâng cao hiệu quả hội nhập",
        subtitle: "Năm định hướng chiến lược",
        icon: "Compass",
        duration: "4 phút",
        sections: [
          {
            heading: "Nhận thức rõ cơ hội và thách thức",
            body: "Đúng đánh giá cơ hội và thách thức. Không lạc quan thái quá, cũng không bi quan. Có chiến lược cụ thể cho từng giai đoạn.",
            keywords: ["nhận thức", "cơ hội", "thách thức", "chiến lược"],
          },
          {
            heading: "Xây dựng chiến lược phù hợp",
            body: "Chiến lược hội nhập phải phù hợp với điều kiện Việt Nam. Ưu tiên các FTA thế hệ mới. Chọn ngành, chọn thị trường trọng điểm.",
            keywords: ["chiến lược", "FTA thế hệ mới", "thị trường trọng điểm"],
          },
          {
            heading: "Hoàn thiện thể chế pháp luật",
            body: "Pháp luật phải tương thích với chuẩn mực quốc tế. Bảo vệ sở hữu trí tuệ, cạnh tranh công bằng, minh bạch. Cải cách hành chính.",
            keywords: ["thể chế pháp luật", "sở hữu trí tuệ", "cạnh tranh công bằng", "cải cách hành chính"],
          },
          {
            heading: "Nâng cao năng lực cạnh tranh",
            body: "Doanh nghiệp nâng cao năng lực: chất lượng, giá, thương hiệu. Nâng cao năng lực cạnh tranh quốc gia. Đầu tư R&D, nhân lực.",
            keywords: ["năng lực cạnh tranh", "chất lượng", "thương hiệu", "R&D"],
          },
          {
            heading: "Xây dựng nền kinh tế độc lập tự chủ",
            body: "Hội nhập nhưng không phụ thuộc. Xây dựng nội lực vững chắc. Đa dạng hóa đối tác, thị trường, nguồn vốn. Đảm bảo an ninh kinh tế.",
            keywords: ["độc lập tự chủ", "nội lực", "đa dạng hóa", "an ninh kinh tế"],
          },
        ],
        keyTakeaways: [
          "Nhận thức rõ cơ hội thách thức",
          "Chiến lược phù hợp + FTA thế hệ mới",
          "Hoàn thiện thể chế pháp luật",
          "Nâng cao năng lực cạnh tranh",
          "Độc lập tự chủ — không phụ thuộc",
        ],
      },
      {
        id: "c3-l6",
        chapterId: "chapter-3",
        title: "Nội dung hội nhập kinh tế quốc tế",
        subtitle: "Chuẩn bị · Lộ trình · Đa dạng mức độ",
        icon: "Route",
        duration: "4 phút",
        sections: [
          {
            heading: "Tổng quan nội dung hội nhập",
            body: "Hội nhập kinh tế quốc tế không diễn ra tự phát mà là một quá trình có chủ động, có lộ trình. Nội dung hội nhập gồm 3 nhóm công việc lớn: chuẩn bị điều kiện, xây dựng lộ trình phù hợp, và thực hiện đa dạng các mức độ hội nhập.",
            keywords: ["có chủ động", "có lộ trình", "chuẩn bị điều kiện", "lộ trình", "mức độ hội nhập"],
          },
          {
            heading: "Chuẩn bị điều kiện hội nhập",
            body: "Trước khi hội nhập, cần chuẩn bị: hoàn thiện thể chế pháp luật tương thích chuẩn mực quốc tế, nâng cao năng lực cạnh tranh của doanh nghiệp, đào tạo nguồn nhân lực, xây dựng hạ tầng, và chuẩn bị tâm lý cạnh tranh. Đây là giai đoạn nền tảng.",
            keywords: ["thể chế pháp luật", "năng lực cạnh tranh", "nguồn nhân lực", "hạ tầng", "tâm lý cạnh tranh"],
          },
          {
            heading: "Xây dựng lộ trình phù hợp",
            body: "Lộ trình hội nhập phải phù hợp với trình độ phát triển, lợi thế so sánh, và năng lực từng giai đoạn. Ưu tiên các FTA thế hệ mới (CPTPP, EVFTA), chọn ngành trọng điểm, chọn thị trường đích, có lộ trình mở cửa từng bước.",
            keywords: ["lộ trình", "lợi thế so sánh", "FTA thế hệ mới", "CPTPP", "EVFTA", "mở cửa từng bước"],
          },
          {
            heading: "Thực hiện đa dạng các mức độ hội nhập",
            body: "Hội nhập ở nhiều mức độ: song phương (FTA), đa phương (WTO, ASEAN), khu vực (AEC, RCEP). Tham gia chuỗi giá trị toàn cầu ở các khâu khác nhau. Đa dạng hóa đối tác, thị trường, ngành hàng để giảm rủi ro.",
            keywords: ["mức độ", "song phương", "đa phương", "khu vực", "AEC", "RCEP", "chuỗi giá trị", "đa dạng hóa"],
          },
        ],
        keyTakeaways: [
          "3 nhóm nội dung: chuẩn bị, lộ trình, đa mức độ",
          "Chuẩn bị: thể chế + năng lực + nhân lực + hạ tầng",
          "Lộ trình phù hợp trình độ + FTA thế hệ mới",
          "Đa mức độ: song phương + đa phương + khu vực",
        ],
        interactive: {
          kind: "roadmap-timeline",
          title: "Lộ trình hội nhập kinh tế quốc tế",
          stages: [
            {
              step: 1,
              label: "Giai đoạn 1",
              title: "Chuẩn bị điều kiện",
              description: "Hoàn thiện thể chế pháp luật, nâng cao năng lực cạnh tranh, đào tạo nhân lực, xây dựng hạ tầng, chuẩn bị tâm lý cạnh tranh.",
              icon: "ClipboardCheck",
            },
            {
              step: 2,
              label: "Giai đoạn 2",
              title: "Xây dựng lộ trình",
              description: "Lộ trình phù hợp trình độ, lợi thế so sánh. Ưu tiên FTA thế hệ mới (CPTPP, EVFTA). Chọn ngành trọng điểm, thị trường đích, mở cửa từng bước.",
              icon: "Map",
            },
            {
              step: 3,
              label: "Giai đoạn 3",
              title: "Đa dạng mức độ",
              description: "Song phương (FTA), đa phương (WTO), khu vực (AEC, RCEP). Tham gia chuỗi giá trị toàn cầu. Đa dạng hóa đối tác, thị trường, ngành hàng.",
              icon: "Network",
            },
            {
              step: 4,
              label: "Giai đoạn 4",
              title: "Đánh giá và điều chỉnh",
              description: "Đánh giá định kỳ hiệu quả hội nhập, điều chỉnh chiến lược, mở rộng hoặc thu hẹp tùy bối cảnh, rút kinh nghiệm cho giai đoạn sau.",
              icon: "TrendingUp",
            },
          ],
        },
      },
      {
        id: "c3-l7",
        chapterId: "chapter-3",
        title: "Biện pháp xây dựng nền kinh tế độc lập, tự chủ",
        subtitle: "Năm biện pháp then chốt",
        icon: "ShieldCheck",
        duration: "5 phút",
        sections: [
          {
            heading: "Vì sao cần kinh tế độc lập, tự chủ?",
            body: "Trong bối cảnh toàn cầu hóa và CMCN 4.0, độc lập tự chủ kinh tế không có nghĩa là đóng cửa, mà là hội nhập mà không phụ thuộc. Có nội lực vững chắc để đối phó với biến động, suy thoái, và các rủi ro địa chính trị.",
            keywords: ["độc lập", "tự chủ", "toàn cầu hóa", "nội lực", "địa chính trị"],
          },
          {
            heading: "Năm biện pháp then chốt",
            body: "Để xây dựng nền kinh tế độc lập, tự chủ, Việt Nam cần thực hiện đồng bộ 5 biện pháp: hoàn thiện đường lối phát triển, đẩy mạnh CNH-HĐH, đẩy mạnh quan hệ kinh tế đối ngoại, kết hợp quốc phòng an ninh, và tăng năng lực cạnh tranh.",
            keywords: ["5 biện pháp", "đường lối", "CNH-HĐH", "kinh tế đối ngoại", "quốc phòng an ninh", "năng lực cạnh tranh"],
          },
        ],
        keyTakeaways: [
          "Độc lập tự chủ = hội nhập không phụ thuộc",
          "5 biện pháp đồng bộ: đường lối, CNH-HĐH, đối ngoại, quốc phòng, cạnh tranh",
          "Nội lực vững + hội nhập sâu = phát triển bền vững",
        ],
        interactive: {
          kind: "concept-map",
          title: "5 biện pháp xây dựng kinh tế độc lập tự chủ",
          centerLabel: "Kinh tế độc lập, tự chủ",
          nodes: [
            {
              id: "bm-1",
              label: "Hoàn thiện đường lối phát triển",
              description: "Đường lối đúng đắn — định hướng XHCN, kinh tế thị trường, hội nhập. Cập nhật phù hợp từng giai đoạn.",
              col: 0,
              row: 0,
              accent: "#e89446",
            },
            {
              id: "bm-2",
              label: "Đẩy mạnh CNH-HĐH",
              description: "Cơ sở vật chất kỹ thuật hiện đại, kinh tế tri thức, ứng dụng 4.0, R&D, nhân lực chất lượng cao.",
              col: 1,
              row: 0,
              accent: "#e8b53a",
            },
            {
              id: "bm-3",
              label: "Đẩy mạnh quan hệ kinh tế đối ngoại",
              description: "Đa phương hóa, đa dạng hóa đối tác, tham gia FTA thế hệ mới, thu hút FDI có chọn lọc.",
              col: 2,
              row: 0,
              accent: "#4ade80",
            },
            {
              id: "center",
              label: "Kinh tế độc lập, tự chủ",
              description: "Hội nhập mà không phụ thuộc. Nội lực vững + đối ngoại sâu.",
              col: 1,
              row: 1,
              isCenter: true,
              accent: "#e879f9",
            },
            {
              id: "bm-4",
              label: "Kết hợp quốc phòng, an ninh",
              description: "An ninh kinh tế gắn an ninh quốc phòng. Bảo vệ lợi ích quốc gia, chủ quyền, an ninh mạng, chuỗi cung ứng.",
              col: 0,
              row: 2,
              accent: "#00d4aa",
            },
            {
              id: "bm-5",
              label: "Tăng năng lực cạnh tranh",
              description: "Doanh nghiệp mạnh, thương hiệu quốc gia, chất lượng, R&D, đổi mới sáng tạo, năng suất lao động.",
              col: 1,
              row: 2,
              accent: "#ff9eb5",
            },
            {
              id: "bm-6",
              label: "Thể chế & pháp luật",
              description: "Pháp luật minh bạch, sở hữu trí tuệ, cải cách hành chính, môi trường đầu tư thuận lợi.",
              col: 2,
              row: 2,
              accent: "#c9701f",
            },
          ],
        },
      },
    ],
  },
];

export const TOTAL_LESSONS = CHAPTERS.reduce((sum, c) => sum + c.lessons.length, 0);

export function chapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function lessonById(id: string): Lesson | undefined {
  for (const c of CHAPTERS) {
    const l = c.lessons.find((l) => l.id === id);
    if (l) return l;
  }
  return undefined;
}

export function lessonsByChapter(chapterId: ChapterId): Lesson[] {
  return CHAPTERS.find((c) => c.id === chapterId)?.lessons ?? [];
}
