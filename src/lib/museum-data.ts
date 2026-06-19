// Atrium — Dữ liệu bảo tàng
// 4 kỷ nguyên × 8 hiện vật = 32 hiện vật + 9 mạch liên kết xuyên thời gian

export type PhaseId = "industry-1" | "industry-2" | "industry-3" | "industry-4";

export type Motif =
  | "steam"
  | "loom"
  | "gear"
  | "locomotive"
  | "cotton-gin"
  | "puddling"
  | "gas-lamp"
  | "thames-shield"
  | "bolt"
  | "assembly"
  | "dynamo"
  | "otto"
  | "marconi"
  | "edison-meter"
  | "light-bulb"
  | "bulb"
  | "network"
  | "chip"
  | "monitor"
  | "upc"
  | "www"
  | "phone"
  | "gps"
  | "brain"
  | "cloud"
  | "printer"
  | "car"
  | "smartphone"
  | "transformer"
  | "rocket"
  | "robot"
  | "neural-net";

export interface Exhibit {
  id: string;
  phase: PhaseId;
  name: string;
  year: string;
  inventor: string;
  origin: string; // nơi
  motif: Motif;
  hero?: boolean;
  tagline: string; // câu khẩu hiệu in nghiêng
  story: string; // "Câu chuyện"
  whyItMatters: string; // "Vì sao nó quan trọng"
  didYouKnow: string; // "Bạn có biết"
  metrics: { label: string; value: string }[];
  tags: string[];
}

export interface Phase {
  id: PhaseId;
  index: number; // 1..4
  label: string; // "1.0"
  name: string;
  era: string; // "Kỷ nguyên Hơi nước & Cơ giới hóa"
  period: string; // "1760–1840"
  accent: string; // hex
  accentVar: string; // css var
  intro: string; // đoạn giới thiệu kỷ nguyên
  curatorQuote: string;
}

export const PHASES: Phase[] = [
  {
    id: "industry-1",
    index: 1,
    label: "1.0",
    name: "Công nghiệp 1.0",
    era: "Kỷ nguyên Hơi nước & Cơ giới hóa",
    period: "1760–1840",
    accent: "#e89446",
    accentVar: "--color-phase-1",
    intro:
      "Khi than đá và nước sôi lần đầu cùng làm việc, con người học được cách giam sức mạnh của tự nhiên trong những ống thép. Nhà máy thay thế xưởng thợ; đường sắt thu nhỏ thế giới; bóng đêm bị đèn gas chinh phục lần đầu tiên.",
    curatorQuote:
      "Không phải máy móc thay đổi thế giới — mà là niềm tin rằng sức mạnh có thể được sản xuất.",
  },
  {
    id: "industry-2",
    index: 2,
    label: "2.0",
    name: "Công nghiệp 2.0",
    era: "Kỷ nguyên Điện & Sản xuất hàng loạt",
    period: "1870–1970",
    accent: "#e8b53a",
    accentVar: "--color-phase-2",
    intro:
      "Dòng điện chạy qua dây đồng đã viết lại mọi quy tắc. Băng chuyền Ford biến công nhân thành mắt xích của một vũ điệu cơ học; vô tuyến truyền tiếng nói qua đại dương; bóng đèn xóa nhòa ranh giới ngày và đêm.",
    curatorQuote:
      "Điện không chỉ thắp sáng — nó đồng bộ hóa cả một nền văn minh.",
  },
  {
    id: "industry-3",
    index: 3,
    label: "3.0",
    name: "Công nghiệp 3.0",
    era: "Kỷ nguyên Điện tử & Vi xử lý",
    period: "1970–2010",
    accent: "#4ade80",
    accentVar: "--color-phase-3",
    intro:
      "Silicon học cách suy nghĩ. Một con chip nhỏ bằng móng tay chứa hàng nghìn bóng bán dẫn, và đột ngột trí tuệ có thể được nhân bản thành hàng triệu bản sao. Mạng lưới kết nối các máy tính thành một hệ thần kinh toàn cầu.",
    curatorQuote:
      "Chip không chỉ tính toán — nó đã dân chủ hóa sức mạnh tính toán.",
  },
  {
    id: "industry-4",
    index: 4,
    label: "4.0",
    name: "Công nghiệp 4.0",
    era: "Kỷ nguyên Thông minh & Kết nối",
    period: "2010–nay",
    accent: "#e879f9",
    accentVar: "--color-phase-4",
    intro:
      "Khi vật lý, sinh học và kỹ thuật số hội tụ, máy móc bắt đầu tự nhận biết và tự quyết định. Trí tuệ nhân tạo học từ dữ liệu của cả nhân loại; vật liệu tự in ra chính nó; xe tự hành hiểu đường phố hơn tài xế.",
    curatorQuote:
      "Chúng ta không còn chế tạo máy móc — chúng ta đang nuôi dưỡng chúng.",
  },
];

export const EXHIBITS: Exhibit[] = [
  // ===================== INDUSTRY 1.0 =====================
  {
    id: "watt-steam",
    phase: "industry-1",
    name: "Động cơ hơi nước Watt",
    year: "1769",
    inventor: "James Watt",
    origin: "Glasgow, Scotland",
    motif: "steam",
    hero: true,
    tagline: "Sức mạnh bị giam cầm trong thép.",
    story:
      "James Watt không phát minh ra động cơ hơi nước — ông cứu nó. Phiên bản Newcomen tốn than ngập ngửa mà yếu ớt. Khi sửa một mô hình năm 1765, Watt nhận ra phần lớn nhiệt bị lãng phí vì xi-lanh phải thay đổi nhiệt độ liên tục. Ông thêm buồng ngưng tách biệt, biến đổi một cú chạm khiến năng suất tăng gấp bốn.",
    whyItMatters:
      "Động cơ Watt là trái tim đầu tiên của Cách mạng Công nghiệp. Nó biến năng lượng từ việc phụ thuộc vào gió, nước và cơ bắp thành thứ có thể được sản xuất theo yêu cầu. Mọi nhà máy, mọi con tàu, mọi đường sắt sau này đều mang huyết thống của cỗ máy này.",
    didYouKnow:
      "Watt đặt tên đơn vị « mã lực » để các chủ mỏ dễ hình dung so với ngựa kéo — và đơn vị « oát » sau này mang tên ông.",
    metrics: [
      { label: "Tăng hiệu suất", value: "×4" },
      { label: "Năng lượng", value: "Than đá" },
      { label: "Ứng dụng", value: "Mọi nhà máy" },
    ],
    tags: ["động lực", "năng lượng", "cơ giới hóa"],
  },
  {
    id: "spinning-jenny",
    phase: "industry-1",
    name: "Cái ghé quay sợi",
    year: "1764",
    inventor: "James Hargreaves",
    origin: "Lancashire, Anh",
    motif: "loom",
    tagline: "Tám con suốt trong một bàn tay.",
    story:
      "Câu chuyện kể rằng con gái Jenny của Hargreaves đánh rơi chiếc suốt — và ông nhìn thấy nó vẫn quay khi rơi. Cảnh tượng đó gợi ý một cỗ máy có thể quay nhiều sợi cùng lúc. Cái ghé ban đầu có 8 suốt, sau tăng lên 80, và một thợ dệt làm được việc của cả tổ.",
    whyItMatters:
      "Sợi vải Anh trở nên rẻ đến mức phá hủy cả ngành dệt thủ công Ấn Độ. Jenny châm ngòi cho cuộc chạy đua cơ giới hóa — và cho cuộc chiến Luddite chống lại máy móc thay người.",
    didYouKnow:
      "Dân dệt thủ công đập vỡ máy Hargreaves vì sợ mất việc. Ông phải chuyển nhà bí mật để bảo vệ tính mạng.",
    metrics: [
      { label: "Suốt / máy", value: "8 → 80" },
      { label: "Năng suất", value: "×8" },
      { label: "Tác động", value: "Cách mạng dệt" },
    ],
    tags: ["dệt may", "cơ giới hóa", "lao động"],
  },
  {
    id: "cotton-gin",
    phase: "industry-1",
    name: "Máy tách hạt bông",
    year: "1793",
    inventor: "Eli Whitney",
    origin: "Georgia, Hoa Kỳ",
    motif: "cotton-gin",
    tagline: "Một phát minh đã kéo lùi tự do.",
    story:
      "Whitney thiết kế máy tách hạt bông chỉ trong mười ngày, hy vọng giảm lao động cho người trồng bông. Ngược lại, máy làm bông trở nên lợi nhuận khủng khiếp — và nền kinh tế đồn điền miền Nam Mỹ bùng nổ, kéo theo hàng triệu người bị giữ trong chế độ nô lệ.",
    whyItMatters:
      "Đây là một trong những phát minh có tác động ngược — làm trầm trọng thêm điều nó định giải quyết. Nó định hình cuộc Nội chiến Hoa Kỳ và để lại di chứng kéo dài thế kỷ.",
    didYouKnow:
      "Whitney sau này tiên phong « sản xuất linh kiện thay thế » — ý tưởng rằng mỗi bộ phận máy có thể hoán đổi, nền tảng của sản xuất hiện đại.",
    metrics: [
      { label: "Tốc độ tách", value: "×50" },
      { label: "Di sản", value: "Nội chiến Mỹ" },
      { label: "Linh kiện", value: "Hoán đổi" },
    ],
    tags: ["nông nghiệp", "lao động", "tiêu chuẩn hóa"],
  },
  {
    id: "puddling-furnace",
    phase: "industry-1",
    name: "Lò luyện sắt puddling",
    year: "1784",
    inventor: "Henry Cort",
    origin: "Hampshire, Anh",
    motif: "puddling",
    tagline: "Thép trong lành cho đường sắt.",
    story:
      "Trước Cort, sắt non giòn và tạp chất nhiều. Ông nghĩ ra cách khuấy (« puddle ») sắt nóng chảy trong lò có oxy, đốt cháy tạp chất cacbon. Kết quả là sắt rèn dẻo, đồng nhất — nguyên liệu của đường sắt, cầu và tàu thủy.",
    whyItMatters:
      "Không có puddling, không có đường sắt vắt qua các đại lục. Phương pháp này nhân 15 lần sản lượng sắt Anh trong hai thập kỷ và biến thép thành vật liệu cấu trúc của thế giới.",
    didYouKnow:
      "Cort bị vu oan nợ và mất bằng sáng chế — chết nghèo. Nhưng quy trình của ông đã viết lại bản đồ kỹ thuật thế giới.",
    metrics: [
      { label: "Sản lượng", value: "×15" },
      { label: "Chất lượng", value: "Sắt rèn" },
      { label: "Ứng dụng", value: "Đường sắt" },
    ],
    tags: ["luyện kim", "năng lượng", "cơ sở hạ tầng"],
  },
  {
    id: "rocket-locomotive",
    phase: "industry-1",
    name: "Đầu máy Rocket",
    year: "1829",
    inventor: "George Stephenson",
    origin: "Newcastle, Anh",
    motif: "locomotive",
    tagline: "Lần đầu con người nhanh hơn ngựa.",
    story:
      "Cuộc thi Rainhill năm 1829 tìm đầu máy cho đường sắt Liverpool–Manchester. Rocket của Stephenson thắng áp đảo với ống lò đa ống, đạt 38 km/h — nhanh hơn mọi thứ trên đất liền thời bấy giờ. Nó không chỉ thắng cuộc thi, nó mở ra kỷ nguyên đường sắt.",
    whyItMatters:
      "Rocket chứng minh đường sắt là tương lai. Trong 20 năm, mạng lưới vắt qua Anh, rồi châu Âu, rồi thế giới. Thời gian và không gian thu nhỏ lại; đồng hồ chuẩn được phát minh vì các tuyến tàu cần giờ thống nhất.",
    didYouKnow:
      "Múi giờ chuẩn là di sản gián tiếp của Rocket — trước đường sắt, mỗi thành phố giữ giờ riêng theo mặt trời.",
    metrics: [
      { label: "Tốc độ", value: "38 km/h" },
      { label: "Công suất", value: "75 mã lực" },
      { label: "Di sản", value: "Múi giờ" },
    ],
    tags: ["giao thông", "động lực", "thu hẹp thế giới"],
  },
  {
    id: "jacquard-loom",
    phase: "industry-1",
    name: "Khung cửi Jacquard",
    year: "1804",
    inventor: "Joseph Marie Jacquard",
    origin: "Lyon, Pháp",
    motif: "loom",
    tagline: "Băng đục lỗ — chương trình đầu tiên.",
    story:
      "Jacquard gắn các thẻ đục lỗ lên khung cửi để điều khiển từng sợi dệt theo hoa văn. Một thợ dệt có thể dệt hoa văn phức tạp mà trước đây cần vài người. Hơn thế — băng đục lỗ chính là « phần mềm » đầu tiên.",
    whyItMatters:
      "Babbage lấy cảm hứng từ Jacquard khi thiết kế Analytical Engine; Hollerith dùng cùng ý tưởng cho máy đếm dân số. Mỗi dòng lệnh bạn viết hôm nay đều mang DNA của chiếc khung cửi này.",
    didYouKnow:
      "Năm 1806, Napoleon tặng Jacquard 3.000 franc và lương trọn đời. Có lúc 10.000 khung cải tiến hoạt động khắp Lyon.",
    metrics: [
      { label: "Lệnh / thẻ", value: "Hàng trăm" },
      { label: "Tiền thân", value: "Phần mềm" },
      { label: "Ứng dụng", value: "Dệt → máy tính" },
    ],
    tags: ["dệt may", "mã hóa", "tự động hóa"],
  },
  {
    id: "gas-lamp",
    phase: "industry-1",
    name: "Đèn gas",
    year: "1792",
    inventor: "William Murdoch",
    origin: "Cornwall, Anh",
    motif: "gas-lamp",
    tagline: "Chinh phục bóng đêm.",
    story:
      "Murdoch, nhân viên của Boulton & Watt, chưng cất than thành khí và thắp sáng ngôi nhà của mình ở Redruth năm 1792. Đến 1807, đường Pall Mall ở London là phố đầu tiên được thắp gas. Bóng đêm — kẻ thù ngàn năm của nhân loại — bị đẩy lùi.",
    whyItMatters:
      "Lần đầu tiên thành phố không ngủ. Nhà máy chạy 24/24, quán cà phê mở khuya, văn hóa đô thị thay đổi vĩnh viễn. Đèn gas là tiền đề vật lý cho « xã hội đêm » của thế kỷ XIX.",
    didYouKnow:
      "Người ta ban đầu sợ khí gas là « khí ma quỷ ». Một số nhà thờ từ chối thắp sáng vì cho rằng thắp đèn là « cản ý Chúa ».",
    metrics: [
      { label: "Nguồn", value: "Than chưng cất" },
      { label: "Tuổi thọ", value: "Hàng nghìn giờ" },
      { label: "Di sản", value: "Thành phố không ngủ" },
    ],
    tags: ["năng lượng", "ánh sáng", "đô thị"],
  },
  {
    id: "thames-tunnel",
    phase: "industry-1",
    name: "Đường hầm Thames",
    year: "1843",
    inventor: "Marc & Isambard Brunel",
    origin: "London, Anh",
    motif: "thames-shield",
    tagline: "Đi dưới con sông.",
    story:
      "Marc Brunel quan sát con giếng tàu (Teredo navalis) đục gỗ và nảy ra ý tưởng « khiên hầm » — một thiết bị bảo vệ công nhân trong khi đào. Con trai ông Isambard hoàn thành đường hầm dưới sông Thames sau 18 năm, ngập nước, hỏa hoạn và nợ nần.",
    whyItMatters:
      "Đây là đường hầm dưới nước đầu tiên trên thế giới thành công. Khiên hầm của Brunel là tổ tiên của mọi máy đào hầm (TBM) ngày nay — Metro, Channel Tunnel, thậm chí hầm đường bộ đều mang gen của nó.",
    didYouKnow:
      "Trong 18 năm xây dựng, đường hầm từng mở cho du khách — có cửa hàng, nhạc sống và 2 triệu lượt tham quan trước khi chạy tàu.",
    metrics: [
      { label: "Chiều dài", value: "396 m" },
      { label: "Thời gian", value: "18 năm" },
      { label: "Di sản", value: "Mọi TBM" },
    ],
    tags: ["cơ sở hạ tầng", "kỹ thuật", "đô thị"],
  },

  // ===================== INDUSTRY 2.0 =====================
  {
    id: "light-bulb",
    phase: "industry-2",
    name: "Bóng đèn sợi đốt",
    year: "1879",
    inventor: "Thomas Edison",
    origin: "Menlo Park, Hoa Kỳ",
    motif: "light-bulb",
    hero: true,
    tagline: "Một sợi tre thắp sáng thế giới.",
    story:
      "Edison không phải người đầu tiên làm bóng đèn — nhưng là người đầu tiên làm bóng đèn « đáng mua ». Sau hàng nghìn thí nghiệm với sợi tre cácbon hóa, ông tìm ra sợi bền 40 giờ. Đêm Giao thừa 1879, phòng thí nghiệm Menlo Park của ông sáng rực, và báo chí đổ xô đến.",
    whyItMatters:
      "Bóng đèn là sản phẩm tiêu dùng đầu tiên của mạng lưới điện. Nó tạo ra nhu cầu đủ lớn để xây nhà máy điện, lưới phân phối và toàn bộ ngành công nghiệp điện lực. Ánh sáng nhân tạo rẻ là điều kiện cho ca đêm, cho bệnh viện hiện đại, cho mọi « thành phố không ngủ ».",
    didYouKnow:
      "Edison cấp bằng sáng chế hơn 1.000 phát minh — trung bình cứ hai tuần một bằng trong suốt cuộc đời.",
    metrics: [
      { label: "Tuổi thọ", value: "40 giờ" },
      { label: "Sợi đốt", value: "Tre cácbon" },
      { label: "Bằng sáng chế", value: "1.000+" },
    ],
    tags: ["ánh sáng", "điện", "tiêu dùng"],
  },
  {
    id: "dynamo",
    phase: "industry-2",
    name: "Máy phát điện dynamo",
    year: "1866",
    inventor: "Werner von Siemens",
    origin: "Berlin, Đức",
    motif: "dynamo",
    tagline: "Cơ học hóa thành dòng điện.",
    story:
      "Siemens nhận ra rằng một nam châm điện quay trong cuộn dây sẽ sinh ra dòng điện — không cần pin. Dynamo của ông là máy phát điện tự kích đầu tiên, biến năng lượng cơ học thành điện một cách thực tế. Nó là trái tim của mọi nhà máy điện sau này.",
    whyItMatters:
      "Dynamo khiến điện trở thành năng lượng có thể sản xuất hàng loạt. Không có nó, không có lưới điện, không có xe điện, không có mạng internet. Mọi « phích cắm » trên tường đều bắt nguồn từ nguyên lý này.",
    didYouKnow:
      "Siemens ban đầu làm công ty điện báo. DynamO đã biến công ty nhỏ thành tập đoàn toàn cầu tồn tại đến nay.",
    metrics: [
      { label: "Nguyên lý", value: "Tự kích" },
      { label: "Hiệu suất", value: "Cao nhất thời" },
      { label: "Di sản", value: "Mọi nhà máy điện" },
    ],
    tags: ["điện", "năng lượng", "cơ học"],
  },
  {
    id: "model-t",
    phase: "industry-2",
    name: "Ford Model T & băng chuyền",
    year: "1908",
    inventor: "Henry Ford",
    origin: "Detroit, Hoa Kỳ",
    motif: "assembly",
    tagline: "Một chiếc xe cho mọi người.",
    story:
      "Ford không phát minh ô tô — ông phát minh cách làm cho mọi người mua được ô tô. Năm 1913, ông áp dụng băng chuyền di động vào nhà máy Highland Park. Thời gian lắp một xe giảm từ 12 giờ xuống 90 phút, giá giảm từ 850 xuống 260 USD. Model T chiếm 50% thị trường ô tô thế giới.",
    whyItMatters:
      "Băng chuyền định hình lại toàn bộ lao động: công nhân lặp một động tác cả ngày, được trả lương cao để mua chính sản phẩm mình làm. Mô hình « Fordism » lan sang mọi ngành và tạo ra tầng lớp trung lưu thế kỷ XX.",
    didYouKnow:
      "Ford trả công nhân 5 USD/ngày — gấp đôi mức thị trường — để họ đủ tiền mua Model T. Đây được xem là cú hích tạo ra « chủ nghĩa tiêu dùng có lương cao ».",
    metrics: [
      { label: "Giá", value: "850 → 260 $" },
      { label: "Thời gian lắp", value: "90 phút" },
      { label: "Lương", value: "5 $/ngày" },
    ],
    tags: ["giao thông", "sản xuất", "lao động"],
  },
  {
    id: "otto-engine",
    phase: "industry-2",
    name: "Động cơ đốt trong Otto",
    year: "1876",
    inventor: "Nicolaus Otto",
    origin: "Deutz, Đức",
    motif: "otto",
    tagline: "Lửa trong xi-lanh.",
    story:
      "Otto thiết kế động cơ 4 thì đầu tiên — nạp, nén, nổ, xả — đốt hỗn hợp khí và không khí trực tiếp trong xi-lanh. Nó nhỏ, nhẹ và hiệu quả hơn động cơ hơi nước nhiều. Đây là hạt giống của ô tô, xe máy, máy bay.",
    whyItMatters:
      "Động cơ Otto giải phóng năng lượng khỏi nhà máy lớn. Nó mang sức mạnh lên xe, lên tàu, lên máy bay. Toàn bộ ngành giao thông thế kỷ XX — và nền kinh tế dầu mỏ — được xây trên bốn thì này.",
    didYouKnow:
      "Cùng xưởng Deutz thuê một thợ cơ khí trẻ tên Gottlieb Daimler — người sau này đồng sáng lập Mercedes-Benz.",
    metrics: [
      { label: "Chu kỳ", value: "4 thì" },
      { label: "Nhiên liệu", value: "Khí than → xăng" },
      { label: "Di sản", value: "Ô tô, máy bay" },
    ],
    tags: ["động lực", "giao thông", "năng lượng"],
  },
  {
    id: "marconi-radio",
    phase: "industry-2",
    name: "Vô tuyến Marconi",
    year: "1895",
    inventor: "Guglielmo Marconi",
    origin: "Bologna, Ý",
    motif: "marconi",
    tagline: "Giọng nói vượt đại dương.",
    story:
      "Marconi kết hợp các phát hiện của Hertz và Branly thành một hệ thống phát–nhận sóng vô tuyến thực tế. Năm 1901, ông truyền tín hiệu « S » từ Cornwall sang Newfoundland — xuyên đại dương. Lần đầu thông tin đi nhanh hơn bất kỳ phương tiện nào có thể mang theo nó.",
    whyItMatters:
      "Vô tuyến là công nghệ đầu tiên « thu hẹp thế giới » mà không cần di chuyển vật lý. Nó cứu những người sống sót Titanic (đã gọi cứu nạn), thay đổi chiến tranh, báo chí, và sau này là vô tuyến–truyền hình–wifi–di động.",
    didYouKnow:
      "Tín hiệu cứu nạn của Titanic năm 1912 đã cứu hơn 700 người — và buộc luật quốc tế yêu cầu mọi tàu khách phải có vô tuyến 24/24.",
    metrics: [
      { label: "Khoảng cách", value: "3.500 km" },
      { label: "Tần số", value: "Sóng radio" },
      { label: "Di sản", value: "WiFi, 4G, 5G" },
    ],
    tags: ["thông tin", "thu hẹp thế giới", "kết nối"],
  },
  {
    id: "edison-meter",
    phase: "industry-2",
    name: "Đồng hồ điện Edison",
    year: "1881",
    inventor: "Thomas Edison",
    origin: "New York, Hoa Kỳ",
    motif: "edison-meter",
    tagline: "Điện trở thành hàng hóa.",
    story:
      "Khi Edison bán điện, ông cần đo khách hàng dùng bao nhiêu. Đồng hồ của ông dùng điện phân kẽm — kim loại tích lũy tỉ lệ với dòng điện, rồi cân được để tính tiền. Thô sơ, nhưng biến điện từ « tiện ích » thành « sản phẩm đo được ».",
    whyItMatters:
      "Đồng hồ điện là hạt giống của toàn bộ ngành « năng lượng như một dịch vụ ». Mỗi kWh trên hóa đơn của bạn, mỗi smart meter thông minh, mỗi thị trường điện đều kế thừa nguyên lý: đo được thì bán được.",
    didYouKnow:
      "Đồng hồ Edison ban đầu cần nhân viên đến tận nhà đọc và cân kẽm mỗi tháng — một công việc đã biến mất trong thế kỷ kỹ thuật số.",
    metrics: [
      { label: "Đo bằng", value: "Điện phân kẽm" },
      { label: "Chu kỳ", value: "Hàng tháng" },
      { label: "Di sản", value: "Smart meter" },
    ],
    tags: ["điện", "năng lượng", "tiêu dùng"],
  },
  {
    id: "telstar",
    phase: "industry-2",
    name: "Vệ tinh Telstar",
    year: "1962",
    inventor: "AT&T & NASA",
    origin: "Cape Canaveral, Hoa Kỳ",
    motif: "marconi",
    tagline: "Truyền hình xuyên đại dương.",
    story:
      "Telstar là vệ tinh truyền thông chủ động đầu tiên. Nó nhận tín hiệu từ Mỹ, khuếch đại và phát sang châu Âu. Lần đầu, người ta xem truyền hình trực tiếp xuyên đại dương. Đêm 10/7/1962, hình ảnh Mỹ–Pháp trao đổi lần đầu — và thế giới tự nhiên co lại.",
    whyItMatters:
      "Telstar chứng minh « ngôi làng toàn cầu » của McLuhan không còn là ẩn dụ. Cùng với cáp quang sau này, nó tạo ra hạ tầng cho internet, truyền hình 24/24 và sự kiện toàn cầu phát sóng đồng thời.",
    didYouKnow:
      "Telstar chỉ hoạt động mỗi ngày 20 phút — khi đi qua cả trạm Mỹ và châu Âu. Phải đợi vệ tinh địa tĩnh mới có phủ sóng liên tục.",
    metrics: [
      { label: "Độ cao", value: "Quỹ đạo thấp" },
      { label: "Hoạt động", value: "20 phút/vòng" },
      { label: "Di sản", value: "TV toàn cầu" },
    ],
    tags: ["thông tin", "thu hẹp thế giới", "vũ trụ"],
  },
  {
    id: "ac-transformer",
    phase: "industry-2",
    name: "Máy biến áp AC",
    year: "1885",
    inventor: "Ottó Bláthy, Miksa Déri, Károly Zipernowsky",
    origin: "Budapest, Hungary",
    motif: "transformer",
    tagline: "Điện đi hàng nghìn kilomet.",
    story:
      "Ba kỹ sư Hungary chế tạo máy biến áp kín đầu tiên — cho phép tăng điện áp để truyền đi xa, rồi hạ xuống an toàn ở đầu nhận. Đây là chìa khóa khiến dòng điện xoay chiều (AC) thắng dòng một chiều (DC) của Edison trong « cuộc chiến dòng điện ».",
    whyItMatters:
      "Không có biến áp, điện chỉ truyền được vài km. Với nó, nhà máy thác Niagara cấp điện cho New York cách 600 km. Biến áp biến điện thành thứ có thể chuyển đi khắp lục địa — và vẫn là xương sống của mọi lưới điện ngày nay.",
    didYouKnow:
      "Cuộc chiến « AC vs DC » giữa Tesla/Westinghouse và Edison là một trong những cuộc chiến kỹ thuật khốc liệt nhất lịch sử — Edison đã cho điện giật voi để bôi nhọ AC.",
    metrics: [
      { label: "Truyền xa", value: "Hàng trăm km" },
      { label: "Hiệu suất", value: "> 95%" },
      { label: "Di sản", value: "Mọi lưới điện" },
    ],
    tags: ["điện", "năng lượng", "cơ sở hạ tầng"],
  },

  // ===================== INDUSTRY 3.0 =====================
  {
    id: "intel-4004",
    phase: "industry-3",
    name: "Vi xử lý Intel 4004",
    year: "1971",
    inventor: "Federico Faggin, Marcian Hoff, Stanley Mazor",
    origin: "Santa Clara, Hoa Kỳ",
    motif: "chip",
    hero: true,
    tagline: "Một con chip — một cỗ máy tính.",
    story:
      "Khách hàng Nhật Busicom muốn 12 chip cho máy tính bỏ túi. Hoff đề xuất: thay vì 12 chip riêng, hãy làm một con chip « tổng quát » có thể lập trình. Faggin thiết kế layout trong 9 tháng. Kết quả: Intel 4004 — 2.300 bóng bán dẫn trên một con chip 12 mm². Toàn bộ CPU trong một mảnh silicon.",
    whyItMatters:
      "4004 chứng minh nguyên lý « phần mềm trên phần cứng » — cùng một con chip có thể làm máy tính, điều khiển lò vi sóng, chạy xe. Nó dân chủ hóa tính toán: từ phòng máy khổng lồ xuống chiếc bỏ túi, rồi xuống điện thoại.",
    didYouKnow:
      "Tốc độ 4004 là 740 kHz — khoảng 92.000 lệnh mỗi giây. Một con chip điện thoại hôm nay nhanh hơn 4004 khoảng 10 triệu lần.",
    metrics: [
      { label: "Bóng bán dẫn", value: "2.300" },
      { label: "Tốc độ", value: "740 kHz" },
      { label: "Diện tích", value: "12 mm²" },
    ],
    tags: ["tính toán", "silicon", "dân chủ hóa"],
  },
  {
    id: "arpanet",
    phase: "industry-3",
    name: "ARPANET",
    year: "1969",
    inventor: "Bob Taylor, Larry Roberts, Vint Cerf",
    origin: "UCLA, Hoa Kỳ",
    motif: "network",
    tagline: "« lo » — tin nhắn đầu tiên.",
    story:
      "29/10/1969, sinh viên UCLA Charley Kline cố gửi từ « login » cho máy ở Stanford. Máy nhận được « lo » rồi sập. Tin nhắn đầu tiên trên ARPANET chỉ có hai chữ — và đó là lần đầu hai máy tính « nói chuyện » qua mạng chuyển gói. ARPANET là phôi thai của internet.",
    whyItMatters:
      "ARPANET chứng minh mạng không cần trung tâm — mọi nút bình đẳng, dữ liệu tự tìm đường. Nguyên lý này sống sót qua Chiến tranh Lạnh và trở thành internet. Mọi email, trang web, tin nhắn bạn gửi đều kế thừa hai chữ « lo » đó.",
    didYouKnow:
      "Nguyên lý « chuyển gói » (packet switching) được nghĩ ra độc lập tại Mỹ (Paul Baran) và Anh (Donald Davies) — để mạng sống sót sau bom nguyên tử.",
    metrics: [
      { label: "Nút đầu tiên", value: "4" },
      { label: "Tốc độ đường", value: "50 kbps" },
      { label: "Di sản", value: "Internet" },
    ],
    tags: ["kết nối", "thông tin", "thu hẹp thế giới"],
  },
  {
    id: "www",
    phase: "industry-3",
    name: "World Wide Web",
    year: "1989",
    inventor: "Tim Berners-Lee",
    origin: "CERN, Thụy Sĩ",
    motif: "www",
    tagline: "Một mạng cho mọi người.",
    story:
      "Tại CERN, Berners-Lee đề xuất một « mạng của các tài liệu » dùng siêu liên kết, để các nhà vật lý chia sẻ thông tin. Ông tự viết trình duyệt, máy chủ và giao thức HTTP/HTML đầu tiên. Ngày 6/8/1991, trang web đầu tiên đi lên mạng — và ông quyết định KHÔNG cấp bằng sáng chế.",
    whyItMatters:
      "Web biến internet — vốn chỉ dành cho kỹ sư — thành không gian công cộng toàn cầu. Quyết định miễn phí của Berners-Lee là một trong những hành động hào phóng nhất lịch sử kỹ thuật. Mọi cửa hàng, báo, mạng xã hội đều xây trên sự hào phóng đó.",
    didYouKnow:
      "Trang web đầu tiên (info.cern.ch) vẫn còn trực tuyến — và vẫn là một trang HTML tĩnh, không quảng cáo, không cookie.",
    metrics: [
      { label: "Trang web đầu", value: "6/8/1991" },
      { label: "Bằng sáng chế", value: "Miễn phí" },
      { label: "Di sản", value: "Toàn bộ web" },
    ],
    tags: ["thông tin", "kết nối", "dân chủ hóa"],
  },
  {
    id: "bar-code",
    phase: "industry-3",
    name: "Mã vạch UPC",
    year: "1974",
    inventor: "IBM (George Laurer)",
    origin: "Ohio, Hoa Kỳ",
    motif: "upc",
    tagline: "Vạch đen định danh mọi thứ.",
    story:
      "Ngày 26/6/1974, gói kẹo cao su Wrigley là sản phẩm đầu tiên được quét mã vạch UPC tại siêu thị Troy, Ohio. Mỗi sản phẩm có một dãy vạch đen độc nhất — và lần đầu máy có thể « đọc » sản phẩm nhanh hơn người. Chuỗi cung ứng toàn cầu bắt đầu từ vạch đen đó.",
    whyItMatters:
      "UPC biến mỗi vật phẩm thành dữ liệu. Thanh toán nhanh, kiểm kê tức thời, chuỗi cung ứng toàn cầu — tất cả đều mượn « vân tay quang học » này. QR code sau này chỉ là hậu duệ 2D của nó.",
    didYouKnow:
      "Sản phẩm đầu tiên quét mã vạch — gói kẹo Wrigley — hiện được trưng bày ở Viện Bảo tàng Quốc gia Mỹ như một cột mốc lịch sử.",
    metrics: [
      { label: "Ký tự", value: "12 số" },
      { label: "Tốc độ quét", value: "Mili giây" },
      { label: "Di sản", value: "QR, RFID" },
    ],
    tags: ["tiêu chuẩn", "mã hóa", "bán lẻ"],
  },
  {
    id: "gps",
    phase: "industry-3",
    name: "Hệ thống GPS",
    year: "1978",
    inventor: "Bradford Parkinson (Quốc phòng Mỹ)",
    origin: "Hoa Kỳ",
    motif: "gps",
    tagline: "Biết mình ở đâu, mọi lúc.",
    story:
      "GPS gồm 31 vệ tinh bay quanh Trái Đất, mỗi vệ tinh phát giờ chính xác. Máy nhận trên mặt đất tính độ trễ từ 4 vệ tinh — và suy ra vị trí trong bán kính mét. Sau tai nạn KAL 007 năm 1983, Mỹ mở GPS cho dân sự, và thế giới không bao giờ lạc đường nữa.",
    whyItMatters:
      "GPS là « hệ thần kinh định vị » của nhân loại. Nó điều khiển máy bay, tàu biển, drone, ứng dụng gọi xe, giao hàng, thậm chí đồng hồ tài chính (định giờ nano giây). Mọi « bản đồ » trên điện thoại đều nợ GPS.",
    didYouKnow:
      "GPS cần Thuyết Tương đối của Einstein: đồng hồ vệ tinh chạy nhanh hơn mặt đất (do hấp dẫn yếu hơn) ~38 micro giây/ngày — phải hiệu chỉnh nếu không GPS sai hàng km.",
    metrics: [
      { label: "Số vệ tinh", value: "31" },
      { label: "Độ chính xác", value: "~5 m" },
      { label: "Di sản", value: "Bản đồ số" },
    ],
    tags: ["định vị", "thu hẹp thế giới", "vũ trụ"],
  },
  {
    id: "cell-phone",
    phase: "industry-3",
    name: "Điện thoại di động",
    year: "1973",
    inventor: "Martin Cooper (Motorola)",
    origin: "New York, Hoa Kỳ",
    motif: "phone",
    tagline: "Gọi điện đi dạo phố.",
    story:
      "3/4/1973, Martin Cooper đứng giữa phố New York, cầm một « cục gạch » 1,1 kg và gọi cho đối thủ Joel Engel ở Bell Labs: « Tôi đang gọi cho bạn từ một điện thoại di động thật sự ». Cú gọi đầu tiên của một kỷ nguyên không dây.",
    whyItMatters:
      "Điện thoại di động tách thông tin khỏi địa điểm. Lần đầu bạn không cần « ở nhà » để « có mặt ». Sau này khi điện thoại kết hợp máy ảnh, GPS, internet — nó trở thành phần mở rộng của cơ thể, công cụ đầu tiên của « tính toán cá nhân hóa ».",
    didYouKnow:
      "Điện thoại đầu tiên DynaTAC nặng 1,1 kg, sạc 10 giờ, đàm thoại 30 phút — giá 3.995 USD năm 1983 (khoảng 11.000 USD hôm nay).",
    metrics: [
      { label: "Trọng lượng", value: "1,1 kg" },
      { label: "Đàm thoại", value: "30 phút" },
      { label: "Di sản", value: "Smartphone" },
    ],
    tags: ["kết nối", "tính toán cá nhân", "thu hẹp thế giới"],
  },
  {
    id: "pc-monitor",
    phase: "industry-3",
    name: "Màn hình máy tính cá nhân",
    year: "1981",
    inventor: "IBM PC",
    origin: "Boca Raton, Hoa Kỳ",
    motif: "monitor",
    tagline: "Máy tính vào văn phòng.",
    story:
      "IBM PC 5150 năm 1981 chuẩn hóa « máy tính để bàn » với màn hình CRT xanh–đen, bàn phím và hệ điều hành. Đó là lúc máy tính thoát khỏi phòng máy lạnh và vào văn phòng, lớp học, nhà để bàn. PC trở thành đồ gia dụng.",
    whyItMatters:
      "IBM PC « mở » kiến trúc — linh kiện công khai, hệ điều hành cấp phép — nên hàng chục hãng « tương thích IBM » nở ra. Cạnh tranh giảm giá, tăng tính năng. PC thắng không vì tốt nhất, mà vì mở nhất.",
    didYouKnow:
      "Microsoft DOS được IBM mua với giá thấp — vì Bill Gates giữ quyền bán cho hãng khác. Quyết định đó tạo ra đế chế Microsoft.",
    metrics: [
      { label: "RAM", value: "16–256 KB" },
      { label: "Màn hình", value: "CRT xanh" },
      { label: "Di sản", value: "PC tương thích" },
    ],
    tags: ["tính toán", "dân chủ hóa", "văn phòng"],
  },
  {
    id: "ethernet",
    phase: "industry-3",
    name: "Mạng Ethernet",
    year: "1973",
    inventor: "Bob Metcalfe",
    origin: "Xerox PARC, Hoa Kỳ",
    motif: "network",
    tagline: "Dây cáp kết nối văn phòng.",
    story:
      "Tại PARC, Metcalfe cần kết nối máy Alto cá nhân cho mọi người dùng chung máy in. Ông nghĩ ra « mạng vô tuyến hữu tuyến » — máy tính chia sẻ một dây cáp, nghe trước khi nói, chờ nếu bận. Nguyên lý đơn giản đó trở thành Ethernet.",
    whyItMatters:
      "Ethernet là « ngôn ngữ » của mạng cục bộ. Mọi router WiFi, mọi trung tâm dữ liệu, mọi cáp quang đều dùng giao thức kế thừa nó. Ngay cả WiFi (802.11) bản chất là Ethernet không dây.",
    didYouKnow:
      "Metcalfe từng dự đoán internet sẽ sụp năm 1996 vì « quá tải » — ông nuốt lời bằng cách xay bài phát biểu của mình và ăn nó trước công chúng.",
    metrics: [
      { label: "Tốc độ đầu", value: "2,94 Mbps" },
      { label: "Tốc độ nay", value: "400 Gbps" },
      { label: "Di sản", value: "Mọi LAN/WiFi" },
    ],
    tags: ["kết nối", "tiêu chuẩn", "mạng"],
  },

  // ===================== INDUSTRY 4.0 =====================
  {
    id: "neural-net",
    phase: "industry-4",
    name: "Mạng nơ-ron sâu",
    year: "2012",
    inventor: "Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton",
    origin: "Toronto, Canada",
    motif: "neural-net",
    hero: true,
    tagline: "Máy học nhìn — rồi học nghĩ.",
    story:
      "AlexNet, một mạng nơ-ron sâu 8 lớp, chạm trán cuộc thi ImageNet 2012 với 15 triệu ảnh. Nó thắng áp đảo — tỷ lệ lỗi giảm từ 26% xuống 15%. GPU gaming chạy mạng nơ-ron đủ nhanh để huấn luyện. Thế giới AI thức tỉnh sau « mùa đông » dài.",
    whyItMatters:
      "AlexNet chứng minh « học sâu » không còn là lý thuyết. Nó mở đường cho nhận diện giọng nói, dịch tự động, xe tự hành, và cuối cùng là các mô hình ngôn ngữ lớn như GPT. Mọi lần bạn nói « Hey Siri » đều bắt đầu từ AlexNet.",
    didYouKnow:
      "Geoffrey Hinton, một trong ba tác giả, đoạt giải Turing 2018 và Nobel Vật lý 2024 — một trong những nhà khoa học hiếm hoi nhận cả hai vinh dự.",
    metrics: [
      { label: "Lớp", value: "8" },
      { label: "Tham số", value: "60 triệu" },
      { label: "GPU", value: "2 × GTX 580" },
    ],
    tags: ["trí tuệ nhân tạo", "tự động hóa", "tính toán"],
  },
  {
    id: "3d-printer",
    phase: "industry-4",
    name: "Máy in 3D",
    year: "2009",
    inventor: "Adrian Bowyer (RepRap)",
    origin: "Bath, Anh",
    motif: "printer",
    tagline: "Vật liệu tự in ra chính nó.",
    story:
      "Dự án RepRap của Bowyer đặt mục tiêu kỳ lạ: máy in có thể in ra phần lớn linh kiện của chính nó — « tự nhân bản ». Khi bằng sáng chế in đùn (FDM) hết hạn năm 2009, máy in 3D rẻ bùng nổ. Dưới 500 USD, bạn có thể in đồ nhựa tùy ý tại nhà.",
    whyItMatters:
      "In 3D đảo ngược sản xuất: thay vì đúc hàng triệu bản giống nhau, mỗi bản có thể khác. Nó in bộ phận cơ thể (prosthesis), nhà (in bê tông), linh kiện tàu vũ trụ, và thậm chí thức ăn. Sản xuất trở nên phi tập trung.",
    didYouKnow:
      "RepRap có thể in khoảng 50% linh kiện của chính nó. Mục tiêu cuối cùng là « máy tự nhân giống » — một thứ gần với sự sống hơn máy móc.",
    metrics: [
      { label: "Giá thấp", value: "< 500 $" },
      { label: "Tự nhân bản", value: "~50%" },
      { label: "Ứng dụng", value: "Y tế → vũ trụ" },
    ],
    tags: ["sản xuất", "vật liệu", "tự động hóa"],
  },
  {
    id: "tesla-autopilot",
    phase: "industry-4",
    name: "Xe tự hành",
    year: "2014",
    inventor: "Tesla / Waymo",
    origin: "Palo Alto, Hoa Kỳ",
    motif: "car",
    tagline: "Chiếc xe tự biết đường.",
    story:
      "Năm 2014, Tesla trang bị Autopilot cho Model S — xe đầu tiên hạng phổ thông có « tay lái tự động » trên cao tốc. Waymo (Google) đi xa hơn: xe không có tay lái chở khách tại Phoenix từ 2017. Lần đầu máy móc « lái » nhanh hơn người trong một số tình huống.",
    whyItMatters:
      "Xe tự hành đe dọa viết lại giao thông, quy hoạch đô thị, và thậm chí quyền sở hữu xe. Nếu xe tự lái an toàn hơn người, các thành phố có thể loại bỏ bãi đỗ, giảm tai nạn, và phục hồi không gian công cộng.",
    didYouKnow:
      "Mỗi xe Waymo tự hành thu thập khoảng 1 GB dữ liệu mỗi giây từ lidar, radar và camera — tương đương 8.000 ảnh/giây.",
    metrics: [
      { label: "Cảm biến", value: "Lidar + radar + cam" },
      { label: "Dữ liệu", value: "1 GB/s" },
      { label: "Di sản", value: "Giao thông mới" },
    ],
    tags: ["tự hành", "giao thông", "trí tuệ nhân tạo"],
  },
  {
    id: "cloud-aws",
    phase: "industry-4",
    name: "Điện toán đám mây",
    year: "2006",
    inventor: "Amazon (AWS)",
    origin: "Seattle, Hoa Kỳ",
    motif: "cloud",
    tagline: "Máy chủ theo phút.",
    story:
      "Năm 2006, Amazon mở dịch vụ S3 và EC2 — cho thuê máy chủ « theo phút ». Một startup với 50 USD có thể thuê sức mạnh tính toán của siêu máy tính. Khởi nghiệp không còn cần mua sắt. « Đám mây » biến tính toán thành tiện ích như nước máy.",
    whyItMatters:
      "Đám mây là nền tảng của gần như mọi dịch vụ số ngày nay — Netflix, Airbnb, Uber, Slack đều chạy trên AWS/Azure/GCP. Nó cũng tập trung quyền lực kỹ thuật vào vài tập đoàn — một nghịch lý mới của thời đại phân tán.",
    didYouKnow:
      "AWS ban đầu là hạ tầng nội bộ Amazon để bán hàng trực tuyến. Jeff Bezos quyết định « mở » nó ra thành dịch vụ — và nay AWS mang lại phần lớn lợi nhuận của Amazon.",
    metrics: [
      { label: "Ra mắt", value: "2006" },
      { label: "Giá", value: "Theo phút" },
      { label: "Di sản", value: "Mọi startup" },
    ],
    tags: ["năng lượng", "kết nối", "tính toán"],
  },
  {
    id: "smartphone",
    phase: "industry-4",
    name: "Smartphone cảm ứng",
    year: "2007",
    inventor: "Apple (Steve Jobs)",
    origin: "Cupertino, Hoa Kỳ",
    motif: "smartphone",
    tagline: "Cỗ máy tính trong túi quần.",
    story:
      "9/1/2007, Jobs giới thiệu iPhone: « điện thoại + iPod + máy tính internet ». Một màn kính cảm ứng đa điểm, không bàn phím. Đánh máy bằng ngón tay. Pin cả ngày. App Store năm 2008 mở cửa cho lập trình viên — và cả một nền kinh tế di động ra đời.",
    whyItMatters:
      "Smartphone là « cái vòi » đầu tiên của tính toán cá nhân hóa. Nó kết hợp máy ảnh, GPS, cảm biến, internet — và trở thành phần mở dài cơ thể của 6 tỷ người. Nó định hình lại giao tiếp, thanh toán, giải trí, tình dục, chính trị.",
    didYouKnow:
      "Trước iPhone, Nokia chiếm 50% thị trường điện thoại toàn cầu. Mười năm sau, Nokia gần như biến mất — vì đã chê cười « màn cảm ứng không có bàn phím ».",
    metrics: [
      { label: "Người dùng", value: "6,8 tỷ" },
      { label: "App Store", value: "2 triệu app" },
      { label: "Di sản", value: "Nền kinh tế di động" },
    ],
    tags: ["tính toán cá nhân", "kết nối", "tiêu dùng"],
  },
  {
    id: "falcon-9",
    phase: "industry-4",
    name: "Tên lửa tái sử dụng Falcon 9",
    year: "2015",
    inventor: "SpaceX (Elon Musk)",
    origin: "Hawthorne, Hoa Kỳ",
    motif: "rocket",
    tagline: "Tên lửa hạ cánh — lần đầu.",
    story:
      "21/12/2015, tầng đầu của Falcon 9 hạ cánh thẳng đứng tại mũi Cape — lần đầu một tên lửa quỹ đạo « đi về ». Trước đó, mọi tên lửa đều dùng một lần. SpaceX chứng minh « tái sử dụng » khả thi, và chi phí lên quỹ đạo giảm 90% trong một thập kỷ.",
    whyItMatters:
      "Khi phóng rẻ, vũ trụ mở ra. Starlink phủ internet vệ tinh toàn cầu. Hàng nghìn vệ tinh nhỏ được phóng mỗi năm. Đam mê « đa hành tinh » từ khoa học viễn tưởng thành kế hoạch kỹ thuật. Falcon 9 là cánh cửa của kỷ nguyên vũ trụ mới.",
    didYouKnow:
      "Falcon 9 đã phóng và hạ cánh hơn 300 lần. Mỗi tầng đầu tái sử dụng được phóng trung bình 15 lần — một con số không tưởng cách đây 20 năm.",
    metrics: [
      { label: "Giảm chi phí", value: "×10" },
      { label: "Tái sử dụng", value: "~15 lần" },
      { label: "Di sản", value: "Vũ trụ thương mại" },
    ],
    tags: ["vũ trụ", "tự hành", "năng lượng"],
  },
  {
    id: "humanoid-robot",
    phase: "industry-4",
    name: "Người máy hình người",
    year: "2024",
    inventor: "Boston Dynamics / Tesla / Figure",
    origin: "Hoa Kỳ",
    motif: "robot",
    tagline: "Bước đi hai chân — làm việc hai tay.",
    story:
      "Sau thập kỷ nghiên cứu, người máy hình người bắt đầu « đi làm ». Figure 01 tại nhà máy BMW, Optimus của Tesla, Atlas của Boston Dynamics — đều bước đi hai chân, cầm nắm bằng hai tay, học từ dữ liệu video con người. Lần đầu máy móc « nhập vai » vào không gian thiết kế cho người.",
    whyItMatters:
      "Nếu người máy hình người thành công trong lao động phổ thông, nó giải phóng con người khỏi lao động cơ thể — giống động cơ hơi nước đã giải phóng cơ bắp. Câu hỏi lớn là: ai sở hữu năng suất đó?",
    didYouKnow:
      "Người máy hình người học bằng « học bắt chước » — quan sát video người làm việc, rồi lặp lại. Cùng kỹ thuật mà AI dùng để học nói và học vẽ.",
    metrics: [
      { label: "Chiều cao", value: "~1,7 m" },
      { label: "Học bằng", value: "Bắt chước" },
      { label: "Di sản", value: "Lao động mới" },
    ],
    tags: ["tự động hóa", "lao động", "trí tuệ nhân tạo"],
  },
  {
    id: "transformer-arch",
    phase: "industry-4",
    name: "Kiến trúc Transformer",
    year: "2017",
    inventor: "Google (Vaswani et al.)",
    origin: "Mountain View, Hoa Kỳ",
    motif: "transformer",
    tagline: "« Attention is all you need ».",
    story:
      "Năm 2017, nhóm Google xuất bản bài báo 8 trang với tiêu đề táo bạo: « Chú ý là tất cả những gì bạn cần ». Họ đề xuất kiến trúc Transformer — bỏ vòng lặp, dùng « cơ chế chú ý » để mỗi từ nhìn tất cả từ khác cùng lúc. Mô hình học ngôn ngữ nhanh và song song hơn.",
    whyItMatters:
      "Transformer là nền móng của GPT, BERT, Claude, Gemini — mọi mô hình ngôn ngữ lớn hôm nay. Nó biến AI từ « công cụ chuyên biệt » thành « đa năng ». Văn bản bạn đang đọc có thể được một Transformer viết — và chúng đang viết cả mã, nhạc, ảnh.",
    didYouKnow:
      "Bài báo Transformer gốc chỉ có 8 trang — ngắn hơn nhiều bài báo học thuật. Nhưng đã trích dẫn hơn 130.000 lần, nhiều thứ ba trong lịch sử khoa học máy tính.",
    metrics: [
      { label: "Trang báo", value: "8" },
      { label: "Trích dẫn", value: "130.000+" },
      { label: "Di sản", value: "Mọi LLM" },
    ],
    tags: ["trí tuệ nhân tạo", "tính toán", "mã hóa"],
  },
];

export const TOTAL_EXHIBITS = EXHIBITS.length;

export interface Connection {
  id: string;
  name: string;
  description: string;
  color: string;
  exhibitIds: string[];
}

export const CONNECTIONS: Connection[] = [
  {
    id: "motive-power",
    name: "Động lực chính",
    description:
      "Từ hơi nước đến điện đến silicon — nhân loại luôn tìm cách biến năng lượng thành chuyển động và tính toán.",
    color: "#e89446",
    exhibitIds: ["watt-steam", "otto-engine", "dynamo", "intel-4004", "neural-net"],
  },
  {
    id: "shrinking-world",
    name: "Thu hẹp thế giới",
    description:
      "Mỗi kỷ nguyên co khoảng cách lại — đường sắt, vô tuyến, web, smartphone — cho đến khi thế giới nhỏ hơn chiếc màn hình.",
    color: "#e8b53a",
    exhibitIds: ["rocket-locomotive", "marconi-radio", "telstar", "www", "smartphone"],
  },
  {
    id: "labor-automation",
    name: "Lao động & Tự động hóa",
    description:
      "Cái ghé, băng chuyền, rô-bốt — máy móc liên tục thay thế lao động cơ bắp, rồi lao động trí óc.",
    color: "#4ade80",
    exhibitIds: ["spinning-jenny", "jacquard-loom", "model-t", "humanoid-robot"],
  },
  {
    id: "standards-uniqueness",
    name: "Tiêu chuẩn & Độc bản",
    description:
      "Mã vạch chuẩn hóa mọi sản phẩm, in 3D trả lại sự độc bản. Hai cực của sản xuất hiện đại.",
    color: "#e879f9",
    exhibitIds: ["cotton-gin", "model-t", "bar-code", "3d-printer"],
  },
  {
    id: "encoding-world",
    name: "Mã hóa thế giới",
    description:
      "Từ băng đục lỗ Jacquard đến mã vạch đến Transformer — thế giới được « viết lại » thành dữ liệu.",
    color: "#00d4aa",
    exhibitIds: ["jacquard-loom", "bar-code", "ethernet", "www", "transformer-arch"],
  },
  {
    id: "energy-as-service",
    name: "Năng lượng như một dịch vụ",
    description:
      "Đồng hồ Edison biến điện thành hàng hóa; đám mây biến tính toán thành tiện ích. Cùng một mô hình, hai thế kỷ.",
    color: "#ff9eb5",
    exhibitIds: ["gas-lamp", "dynamo", "edison-meter", "ac-transformer", "cloud-aws"],
  },
  {
    id: "conquering-night",
    name: "Chinh phục bóng đêm",
    description:
      "Đèn gas rồi bóng đèn — mỗi bước đẩy bóng đêm lùi xa hơn, kéo theo « xã hội đêm » và ca đêm.",
    color: "#e8b53a",
    exhibitIds: ["gas-lamp", "light-bulb", "telstar"],
  },
  {
    id: "autonomous-motion",
    name: "Động lực tự hành",
    description:
      "Rocket tự hạ cánh, xe tự lái, rô-bốt tự đi — máy móc học tự quyết định trong không gian vật lý.",
    color: "#e879f9",
    exhibitIds: ["rocket-locomotive", "falcon-9", "tesla-autopilot", "humanoid-robot"],
  },
  {
    id: "personal-computing",
    name: "Tính toán cá nhân hóa",
    description:
      "Từ phòng máy lạnh xuống bàn làm việc xuống túi quần — tính toán tiến gần cơ thể từng bước.",
    color: "#4ade80",
    exhibitIds: ["intel-4004", "pc-monitor", "cell-phone", "smartphone"],
  },
];

export const TOTAL_CONNECTIONS = CONNECTIONS.length;

export function phaseById(id: string): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}

export function exhibitById(id: string): Exhibit | undefined {
  return EXHIBITS.find((e) => e.id === id);
}

export function exhibitsByPhase(phaseId: PhaseId): Exhibit[] {
  return EXHIBITS.filter((e) => e.phase === phaseId);
}

export function heroExhibits(): Exhibit[] {
  return EXHIBITS.filter((e) => e.hero);
}

export function connectionsForExhibit(exhibitId: string): Connection[] {
  return CONNECTIONS.filter((c) => c.exhibitIds.includes(exhibitId));
}

export function nextExhibit(exhibitId: string): Exhibit | undefined {
  const idx = EXHIBITS.findIndex((e) => e.id === exhibitId);
  if (idx === -1 || idx === EXHIBITS.length - 1) return undefined;
  return EXHIBITS[idx + 1];
}

export function prevExhibit(exhibitId: string): Exhibit | undefined {
  const idx = EXHIBITS.findIndex((e) => e.id === exhibitId);
  if (idx <= 0) return undefined;
  return EXHIBITS[idx - 1];
}
