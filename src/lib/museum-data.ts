// Atrium — Dữ liệu bảo tàng
// 4 kỷ nguyên × (3 hoặc 4) hiện vật = 17 hiện vật + 5 mạch liên kết xuyên thời gian

export type PhaseId = "industry-1" | "industry-2" | "industry-3" | "industry-4";

export type Motif =
  | "flying-shuttle"
  | "steam-engine"
  | "steamboat-fulton"
  | "locomotive"
  | "bessemer-converter"
  | "dynamo"
  | "edison-phonograph"
  | "motorwagen"
  | "wright-flyer"
  | "unimate-robot"
  | "intel-4004"
  | "modicon-plc"
  | "altair-8800"
  | "motorola-dynatac"
  | "atlas-robot"
  | "amazon-echo"
  | "iphone-4s";

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
      "Khi than đá và nước sôi lần đầu cùng làm việc, con người học được cách giải phóng năng lượng của tự nhiên. Máy dệt cơ bản tăng tốc sản xuất; động cơ hơi nước và đường sắt thu nhỏ thế giới; tàu thủy hơi nước vượt mọi dòng ngược.",
    curatorQuote:
      "Không phải máy móc thay đổi thế giới — mà là niềm tin rằng sức mạnh có thể được sản xuất.",
  },
  {
    id: "industry-2",
    index: 2,
    label: "2.0",
    name: "Công nghiệp 2.0",
    era: "Kỷ nguyên Điện & Sản xuất hàng loạt",
    period: "1870–1914",
    accent: "#e8b53a",
    accentVar: "--color-phase-2",
    intro:
      "Dòng điện chạy qua dây đồng đã viết lại mọi quy tắc. Lò Bessemer tôi luyện thép cứng dựng xây nhà chọc trời; máy phát điện Siemens thắp sáng phố phường; động cơ đốt trong và máy bay giúp nhân loại thực sự chinh phục bầu trời.",
    curatorQuote:
      "Điện không chỉ thắp sáng — nó đồng bộ hóa cả một nền văn minh.",
  },
  {
    id: "industry-3",
    index: 3,
    label: "3.0",
    name: "Công nghiệp 3.0",
    era: "Kỷ nguyên Điện tử & Vi xử lý",
    period: "1969–2010",
    accent: "#4ade80",
    accentVar: "--color-phase-3",
    intro:
      "Silicon học cách suy nghĩ. Một con chip nhỏ chứa hàng nghìn bóng bán dẫn mở đầu kỷ nguyên vi tính cá nhân; thiết bị PLC định hình tự động hóa dây chuyền; cánh tay robot đầu tiên giải phóng sức lao động nguy hiểm.",
    curatorQuote:
      "Chip không chỉ tính toán — nó đã dân chủ hóa sức mạnh tính toán.",
  },
  {
    id: "industry-4",
    index: 4,
    label: "4.0",
    name: "Công nghiệp 4.0",
    era: "Kỷ nguyên Thông minh & Kết nối",
    period: "2011–nay",
    accent: "#e879f9",
    accentVar: "--color-phase-4",
    intro:
      "Khi vật lý, kỹ thuật số và trí tuệ nhân tạo hội tụ. Trợ lý thông minh lắng nghe cuộc sống thường nhật; điện thoại trong túi kết nối cả thế giới; robot sinh học hình người tự bước đi và học hỏi từ thế giới xung quanh.",
    curatorQuote:
      "Chúng ta không còn chế tạo máy móc — chúng ta đang nuôi dưỡng chúng.",
  },
];

export const EXHIBITS: Exhibit[] = [
  // ===================== INDUSTRY 1.0 =====================
  {
    id: "flying-shuttle",
    phase: "industry-1",
    name: "Con thoi bay John Kay",
    year: "1733",
    inventor: "John Kay",
    origin: "Bury, Lancashire, Anh",
    motif: "flying-shuttle",
    tagline: "Tăng tốc độ dệt vải lên gấp đôi.",
    story:
      "Năm 1733, John Kay phát minh ra con thoi bay. Thay vì phải luồn thoi dệt bằng tay qua các sợi dọc một cách chậm chạp, thợ dệt chỉ cần kéo dây để bắn con thoi qua lại trên đường ray. Điều này giúp dệt được những khổ vải rộng hơn rất nhiều và tốc độ nhanh hơn gấp đôi.",
    whyItMatters:
      "Là một trong những phát minh quan trọng đầu tiên châm ngòi cho Cách mạng Công nghiệp 1.0. Nó tạo ra sự mất cân bằng lớn: tốc độ dệt quá nhanh khiến sợi không đủ cung cấp, buộc người ta phải phát minh ra các máy quay sợi hiệu suất cao sau đó.",
    didYouKnow:
      "Các thợ dệt thủ công lo sợ mất sinh kế đã tấn công nhà của John Kay và phá hủy các máy móc của ông. Ông phải trốn sang Pháp dệt thuê và qua đời trong nghèo khó.",
    metrics: [
      { label: "Năng suất dệt", value: "x2" },
      { label: "Số thợ dệt", value: "1 người/máy" },
      { label: "Năm cấp bằng", value: "1733" },
    ],
    tags: ["dệt may", "cơ giới hóa", "năng suất"],
  },
  {
    id: "watt-steam",
    phase: "industry-1",
    name: "Động cơ hơi nước Watt",
    year: "1769",
    inventor: "James Watt",
    origin: "Glasgow, Scotland",
    motif: "steam-engine",
    hero: true,
    tagline: "Trái tim cơ giới hóa của thế giới.",
    story:
      "James Watt cải tiến động cơ hơi nước của Newcomen bằng cách thêm buồng ngưng hơi nước riêng biệt. Thiết kế này giúp giữ cho xi-lanh chính luôn nóng, tiết kiệm tới 75% lượng than tiêu thụ và tăng hiệu suất động cơ lên gấp nhiều lần.",
    whyItMatters:
      "Nguồn động lực chính thay thế sức người, sức ngựa và sức nước. Nó cho phép các nhà máy công nghiệp được xây dựng ở bất cứ đâu, không còn phụ thuộc vào sông ngòi, đặt nền móng cho đô thị hóa và đại công nghiệp.",
    didYouKnow:
      "Watt phát minh ra khái niệm 'mã lực' (horsepower) để thuyết phục các chủ mỏ mua động cơ hơi nước bằng cách so sánh hiệu năng máy với sức kéo của ngựa thực tế.",
    metrics: [
      { label: "Tiết kiệm than", value: "75%" },
      { label: "Tăng hiệu suất", value: "x4" },
      { label: "Năng lượng", value: "Than đá" },
    ],
    tags: ["năng lượng", "hơi nước", "động cơ"],
  },
  {
    id: "steamboat-fulton",
    phase: "industry-1",
    name: "Tàu thủy hơi nước Clermont",
    year: "1807",
    inventor: "Robert Fulton",
    origin: "New York, Hoa Kỳ",
    motif: "steamboat-fulton",
    tagline: "Chinh phục dòng nước ngược.",
    story:
      "Tàu Clermont của Robert Fulton là tàu thủy hơi nước thương mại thành công đầu tiên trên thế giới. Vào ngày 17/8/1807, Clermont đã đi 150 dặm ngược dòng sông Hudson từ New York đến Albany trong 32 giờ, mở ra kỷ nguyên mới cho vận tải đường thủy.",
    whyItMatters:
      "Giải phóng giao thương đường thủy khỏi sự phụ thuộc vào hướng gió. Nó giúp việc di chuyển ngược dòng sông lớn trở nên nhanh chóng và đáng tin cậy, thúc đẩy mạnh mẽ kinh tế nội địa và giao thương quốc tế.",
    didYouKnow:
      "Khi đang chế tạo, người dân New York gọi Clermont là 'Fulton's Folly' (Sự điên rồ của Fulton) vì họ tin rằng con tàu gỗ chứa động cơ hơi nước nặng nề này sẽ chìm ngay khi hạ thủy.",
    metrics: [
      { label: "Vận tốc", value: "8 km/h" },
      { label: "Quãng đường", value: "240 km" },
      { label: "Thời gian chạy", value: "32 giờ" },
    ],
    tags: ["giao thông", "hàng hải", "hơi nước"],
  },
  {
    id: "rocket-locomotive",
    phase: "industry-1",
    name: "Đầu máy xe lửa Rocket",
    year: "1829",
    inventor: "George & Robert Stephenson",
    origin: "Newcastle, Anh",
    motif: "locomotive",
    tagline: "Khai sinh kỷ nguyên đường sắt hiện đại.",
    story:
      "Rocket chiến thắng cuộc thi Rainhill Trials năm 1829 nhờ thiết kế nồi hơi nhiều ống lò cải tiến, giúp tối ưu hóa diện tích tiếp xúc nhiệt và tạo ra lượng hơi nước lớn nhanh chóng. Thiết kế này trở thành tiêu chuẩn cho đầu máy hơi nước suốt một thế kỷ.",
    whyItMatters:
      "Là đầu máy xe lửa thực tế đầu tiên kết hợp tốc độ, độ tin cậy và hiệu quả kinh tế. Rocket đã chứng minh đường sắt là phương tiện vận chuyển hành khách và hàng hóa vượt trội hơn đường bộ và kênh đào.",
    didYouKnow:
      "Trong cuộc thi thử nghiệm, Rocket đạt tốc độ tối đa lên tới 46 km/h — một tốc độ không tưởng vào thời điểm đó khiến nhiều hành khách lo sợ sẽ bị ngạt thở vì đi quá nhanh.",
    metrics: [
      { label: "Tốc độ tối đa", value: "46 km/h" },
      { label: "Trọng lượng", value: "4.3 tấn" },
      { label: "Cuộc thi thắng", value: "Rainhill Trials" },
    ],
    tags: ["giao thông", "đường sắt", "hơi nước"],
  },

  // ===================== INDUSTRY 2.0 =====================
  {
    id: "bessemer-converter",
    phase: "industry-2",
    name: "Lò chuyển thép Bessemer",
    year: "1856",
    inventor: "Henry Bessemer",
    origin: "Sheffield, Anh",
    motif: "bessemer-converter",
    tagline: "Luyện sắt thành thép hàng loạt.",
    story:
      "Henry Bessemer phát minh ra phương pháp luyện thép bằng cách thổi luồng khí oxy qua gang lỏng để đốt cháy các tạp chất cacbon dư thừa. Phương pháp này chuyển hóa gang giòn thành thép dẻo dai chỉ trong vòng 20 phút mà không cần thêm chất đốt.",
    whyItMatters:
      "Biến thép từ một vật liệu xa xỉ thành kim loại rẻ tiền được sản xuất hàng loạt. Thép Bessemer là xương sống để xây dựng đường ray xe lửa, cầu cảng, tàu chiến và các tòa nhà chọc trời đầu tiên của nhân loại.",
    didYouKnow:
      "Mặc dù mang tên Bessemer, một nhà sáng chế người Mỹ tên là William Kelly cũng đã phát hiện ra nguyên lý tương tự trước đó nhưng không kịp đăng ký bằng sáng chế và bị phá sản.",
    metrics: [
      { label: "Thời gian luyện", value: "20 phút" },
      { label: "Giảm chi phí", value: "80%" },
      { label: "Sản lượng thép", value: "Tăng x10" },
    ],
    tags: ["vật liệu", "luyện kim", "sản xuất"],
  },
  {
    id: "dynamo",
    phase: "industry-2",
    name: "Máy phát điện Dynamo Siemens",
    year: "1866",
    inventor: "Werner von Siemens",
    origin: "Berlin, Đức",
    motif: "dynamo",
    tagline: "Nguồn khởi đầu của dòng điện công nghiệp.",
    story:
      "Năm 1866, Werner von Siemens phát minh ra máy phát điện tự kích từ (dynamo). Bằng cách sử dụng chính dòng điện do máy tạo ra để tăng cường từ trường của nam châm điện, thiết kế này cho phép tạo ra dòng điện lớn, ổn định và liên tục.",
    whyItMatters:
      "Đặt nền móng cho ngành kỹ thuật điện hiện đại. Dynamo biến năng lượng cơ học thành năng lượng điện trên quy mô lớn, thắp sáng các thành phố và cung cấp năng lượng cho động cơ điện trong nhà máy.",
    didYouKnow:
      "Phát minh này giúp Siemens chuyển mình từ một công ty điện báo nhỏ thành một trong những tập đoàn công nghiệp kỹ thuật điện lớn nhất thế giới ngày nay.",
    metrics: [
      { label: "Hiệu suất điện", value: "Vượt bậc" },
      { label: "Nguyên lý", value: "Tự kích từ" },
      { label: "Ứng dụng", value: "Điện công nghiệp" },
    ],
    tags: ["năng lượng", "điện lực", "động cơ"],
  },
  {
    id: "motorwagen",
    phase: "industry-2",
    name: "Xe hơi Benz Patent-Motorwagen",
    year: "1886",
    inventor: "Karl Benz",
    origin: "Mannheim, Đức",
    motif: "motorwagen",
    tagline: "Chiếc xe hơi đầu tiên chạy bằng xăng.",
    story:
      "Benz Patent-Motorwagen là chiếc xe hơi chạy bằng động cơ đốt trong đầu tiên trên thế giới được thiết kế đồng bộ từ đầu. Xe có 3 bánh, sử dụng động cơ xăng 1 xi-lanh bốn thì công suất 0.75 mã lực và hệ thống đánh lửa điện.",
    whyItMatters:
      "Khai sinh ngành công nghiệp ô tô toàn cầu và định hình phương thức di chuyển cá nhân của nhân loại suốt thế kỷ 20 và 21, thay thế hoàn toàn xe ngựa kéo truyền thống.",
    didYouKnow:
      "Vợ của Karl Benz, bà Bertha Benz, đã thực hiện chuyến hành trình lái xe đường dài đầu tiên trong lịch sử (106 km) mà không báo cho chồng để chứng minh tính thực tế của chiếc xe với công chúng.",
    metrics: [
      { label: "Công suất", value: "0.75 hp" },
      { label: "Vận tốc tối đa", value: "16 km/h" },
      { label: "Nhiên liệu", value: "Ligroin" },
    ],
    tags: ["giao thông", "ô tô", "động cơ"],
  },
  {
    id: "wright-flyer",
    phase: "industry-2",
    name: "Máy bay Wright Flyer",
    year: "1903",
    inventor: "Orville & Wilbur Wright",
    origin: "Kitty Hawk, North Carolina, Hoa Kỳ",
    motif: "wright-flyer",
    hero: true,
    tagline: "Chinh phục bầu trời xanh.",
    story:
      "Ngày 17/12/1903, anh em nhà Wright thực hiện chuyến bay đầu tiên có kiểm soát, duy trì và chạy bằng động cơ của nhân loại với chiếc Wright Flyer. Chuyến bay đầu kéo dài 12 giây trên quãng đường 37 mét dưới sự điều khiển của Orville.",
    whyItMatters:
      "Hiện thực hóa giấc mơ bay cao của loài người. Phát minh này mở ra kỷ nguyên hàng không hiện đại, thu hẹp khoảng cách địa lý giữa các quốc gia và lục địa một cách thần kỳ.",
    didYouKnow:
      "Động cơ của Wright Flyer được làm bằng nhôm đúc nguyên khối vì các hãng sản xuất thời đó không thể chế tạo một động cơ đủ nhẹ và mạnh bằng gang hay thép như yêu cầu của họ.",
    metrics: [
      { label: "Thời gian bay", value: "12 giây" },
      { label: "Quãng đường", value: "37 m" },
      { label: "Trọng lượng", value: "274 kg" },
    ],
    tags: ["giao thông", "hàng không", "động cơ"],
  },
  {
    id: "edison-phonograph",
    phase: "industry-2",
    name: "Máy hát ống thiếc Edison",
    year: "1877",
    inventor: "Thomas Edison",
    origin: "Menlo Park, New Jersey, Hoa Kỳ",
    motif: "edison-phonograph",
    tagline: "Thiết bị đầu tiên ghi và phát lại âm thanh.",
    story:
      "Tháng 12 năm 1877, Thomas Edison giới thiệu máy hát ống thiếc (Tinfoil Phonograph). Thiết bị ghi lại các chấn động âm thanh dưới dạng các vết lõm trên một lá thiếc bọc quanh một ống hình trụ có rãnh xoắn quay bằng tay. Khi quay ống trụ ngược lại dưới kim đọc thứ hai, âm thanh được phát lại thông qua loa kèn.",
    whyItMatters:
      "Trước Edison, âm thanh chỉ là thứ thoáng qua. Phonograph là thiết bị đầu tiên có thể ghi và phát lại giọng nói con người, đặt nền móng cho ngành công nghiệp âm nhạc, ghi âm thương mại và viễn thông hiện đại.",
    didYouKnow:
      "Từ đầu tiên được Edison ghi âm thử nghiệm thành công là bài đồng dao 'Mary Had a Little Lamb'. Ông đã vô cùng kinh ngạc khi thấy thiết bị phát lại chính xác giọng nói của mình.",
    metrics: [
      { label: "Năm công bố", value: "1877" },
      { label: "Vật liệu ghi", value: "Lá thiếc (Tinfoil)" },
      { label: "Vận hành", value: "Quay tay (Hand-crank)" },
    ],
    tags: ["âm thanh", "truyền thông", "đại chúng"],
  },

  // ===================== INDUSTRY 3.0 =====================
  {
    id: "unimate-robot",
    phase: "industry-3",
    name: "Cánh tay robot Unimate",
    year: "1961",
    inventor: "George Devol & Joseph Engelberger",
    origin: "New Jersey, Hoa Kỳ",
    motif: "unimate-robot",
    tagline: "Robot công nghiệp đầu tiên trên thế giới.",
    story:
      "Unimate đi vào hoạt động tại dây chuyền đúc áp lực của hãng General Motors ở New Jersey vào năm 1961. Nhiệm vụ của nó là gắp các chi tiết kim loại nóng đỏ từ máy đúc và thả vào bể nước lạnh — một công việc cực kỳ nguy hiểm đối với con người.",
    whyItMatters:
      "Mở ra ngành công nghiệp robot toàn cầu. Nó chứng minh robot có thể đảm nhận các công việc nguy hiểm, lặp đi lặp lại trong môi trường khắc nghiệt với độ chính xác và tốc độ vượt trội con người.",
    didYouKnow:
      "Năm 1966, Joseph Engelberger đã đưa Unimate lên chương trình truyền hình thực tế nổi tiếng 'The Tonight Show' và trình diễn cảnh robot rót bia đá, vung gậy đánh golf và chỉ huy dàn nhạc.",
    metrics: [
      { label: "Trọng lượng", value: "1.2 tấn" },
      { label: "Ứng dụng đầu", value: "Đúc kim loại" },
      { label: "Lưu trữ", value: "Trống từ" },
    ],
    tags: ["robot", "tự động hóa", "lao động"],
  },
  {
    id: "intel-4004",
    phase: "industry-3",
    name: "Vi xử lý Intel 4004",
    year: "1971",
    inventor: "Federico Faggin, Marcian Hoff, Masatoshi Shima",
    origin: "Santa Clara, Hoa Kỳ",
    motif: "intel-4004",
    hero: true,
    tagline: "Toàn bộ máy tính trong một con chip.",
    story:
      "Năm 1971, Intel ra mắt bộ vi xử lý đơn chip thương mại đầu tiên trên thế giới — Intel 4004. Chỉ rộng 12 mm², nó tích hợp 2.300 bóng bán dẫn, mang lại sức mạnh tính toán tương đương chiếc máy tính khổng lồ ENIAC chiếm cả căn phòng rộng.",
    whyItMatters:
      "Khởi đầu kỷ nguyên vi xử lý và cuộc cách mạng kỹ thuật số. Con chip này chứng minh rằng sức mạnh tính toán có thể được thu nhỏ vô hạn và tích hợp vào mọi thiết bị trong đời sống.",
    didYouKnow:
      "Ban đầu Intel 4004 được thiết kế cho máy tính bỏ túi của hãng Busicom (Nhật Bản) trước khi Intel mua lại độc quyền để bán rộng rãi ra thị trường.",
    metrics: [
      { label: "Bóng bán dẫn", value: "2.300" },
      { label: "Tần số xung", value: "740 kHz" },
      { label: "Kích thước đế", value: "12 mm²" },
    ],
    tags: ["điện tử", "vi xử lý", "bán dẫn"],
  },
  {
    id: "modicon-plc",
    phase: "industry-3",
    name: "Bộ lập trình PLC Modicon 084",
    year: "1969",
    inventor: "Dick Morley",
    origin: "Bedford, Massachusetts, Hoa Kỳ",
    motif: "modicon-plc",
    tagline: "Bộ não lập trình của nhà máy hiện đại.",
    story:
      "Modicon 084 là Bộ điều khiển logic khả trình (PLC) đầu tiên trên thế giới. Thiết bị này được thiết kế để replace các hệ thống điều khiển bằng rơ-le cơ học cồng kềnh, dễ hỏng và tốn thời gian đấu nối lại mỗi khi thay đổi quy trình sản xuất.",
    whyItMatters:
      "Là cột mốc quan trọng nhất của tự động hóa công nghiệp. PLC cho phép điều khiển quy trình sản xuất bằng phần mềm thay vì phần cứng dây dẫn, giúp tăng tốc độ tái cấu trúc dây chuyền sản xuất từ vài tuần xuống vài giờ.",
    didYouKnow:
      "Cái tên 'Modicon' là viết tắt của 'MOdular DIgital CONtroller' (Bộ điều khiển kỹ thuật số dạng mô-đun). Nó được phát triển vào ngày đầu năm mới 1968 sau khi Dick Morley có một đêm giao thừa say xỉn.",
    metrics: [
      { label: "Thay thế", value: "Hàng trăm rơ-le" },
      { label: "Nguyên lý", value: "Logic khả trình" },
      { label: "Năm ra mắt", value: "1969" },
    ],
    tags: ["tự động hóa", "điện tử", "sản xuất"],
  },
  {
    id: "altair-8800",
    phase: "industry-3",
    name: "Máy tính Altair 8800",
    year: "1975",
    inventor: "Ed Roberts",
    origin: "Albuquerque, New Mexico, Hoa Kỳ",
    motif: "altair-8800",
    tagline: "Ngòi nổ của cách mạng máy tính cá nhân.",
    story:
      "Altair 8800 bán ra dưới dạng bộ linh kiện tự lắp ráp giá 397 USD, sử dụng chip Intel 8080. Máy không có bàn phím, màn hình hay chuột — người dùng lập trình bằng cách gạt các công tắc ở mặt trước và đọc kết quả qua hàng đèn LED đỏ nhấp nháy.",
    whyItMatters:
      "Kích hoạt toàn bộ ngành công nghiệp phần mềm và phần cứng máy tính cá nhân. Chính từ Altair 8800, Bill Gates và Paul Allen đã viết trình thông dịch BASIC đầu tiên và thành lập Microsoft.",
    didYouKnow:
      "Cái tên 'Altair' được đặt theo tên một ngôi sao trong bộ phim truyền hình khoa học viễn tưởng nổi tiếng Star Trek mà con gái của Ed Roberts đang xem vào lúc đó.",
    metrics: [
      { label: "Giá bộ kit", value: "397 USD" },
      { label: "Vi xử lý", value: "Intel 8080" },
      { label: "RAM", value: "256 bytes" },
    ],
    tags: ["máy tính", "kỹ thuật số", "phần mềm"],
  },
  {
    id: "motorola-dynatac",
    phase: "industry-3",
    name: "Điện thoại Motorola DynaTAC 8000x",
    year: "1973",
    inventor: "Martin Cooper, Rudolph Krolopp, Donald Linder",
    origin: "Motorola Inc., Libertyville, Illinois, Hoa Kỳ",
    motif: "motorola-dynatac",
    tagline: "Chiếc điện thoại di động cầm tay đầu tiên thế giới.",
    story:
      "Ngày 3/4/1973, Martin Cooper - kỹ sư trưởng của Motorola - đã thực hiện cuộc gọi di động đầu tiên lịch sử trên đường phố Manhattan, New York bằng thiết bị thử nghiệm DynaTAC. Ông gọi cho Joel Engel, đối thủ tại Bell Labs, và tuyên bố: 'Joel, tôi đang gọi cho ông từ một chiếc điện thoại di động thực sự'. Trải qua 10 năm nghiên cứu cùng khoản đầu tư 100 triệu USD, Motorola mới chính thức thương mại hóa thiết bị này vào năm 1983.",
    whyItMatters:
      "DynaTAC 8000x giải phóng con người khỏi chiếc điện thoại cố định và dây nối vật lý. Phát minh này đặt nền móng toàn diện cho hạ tầng viễn thông di động băng thông rộng và kỷ nguyên kết nối không dây hiện đại.",
    didYouKnow:
      "Thiết bị nặng hơn 1,1 kg và thường được gọi là 'Cục gạch' (The Brick). Nó cần 10 tiếng để sạc đầy nhưng chỉ có thể đàm thoại trong 35 phút. Martin Cooper từng đùa rằng: 'Thời lượng pin không thành vấn đề, vì bạn không thể cầm chiếc điện thoại nặng như thế suốt 35 phút!'",
    metrics: [
      { label: "Trọng lượng", value: "1.15 kg" },
      { label: "Thời gian sạc", value: "10 giờ" },
      { label: "Thời gian gọi", value: "35 phút" },
    ],
    tags: ["di động", "viễn thông", "kết nối"],
  },

  // ===================== INDUSTRY 4.0 =====================
  {
    id: "atlas-robot",
    phase: "industry-4",
    name: "Robot hình người Atlas",
    year: "2013",
    inventor: "Boston Dynamics",
    origin: "Waltham, Massachusetts, Hoa Kỳ",
    motif: "atlas-robot",
    hero: true,
    tagline: "Đỉnh cao cơ điện tử và robot sinh học.",
    story:
      "Atlas được thiết kế để thực hiện các nhiệm vụ tìm kiếm cứu nạn nguy hiểm. Trải qua nhiều năm phát triển, từ một cỗ máy cồng kềnh phải cắm dây nguồn trực tiếp, Atlas đã trở thành robot tự hành hoàn toàn bằng thủy lực (và phiên bản điện sau này), có khả năng chạy, nhảy, nhào lộn điêu luyện.",
    whyItMatters:
      "Đại diện cho sự hội tụ của AI và cơ khí chính xác trong CMCN 4.0. Atlas chứng minh robot có thể di chuyển linh hoạt trong không gian gồ ghề của con người, mở đường cho lao động tự động thông minh ngoài nhà máy.",
    didYouKnow:
      "Mỗi cú lộn nhào ngược (backflip) của Atlas yêu cầu hệ thống máy tính trên bo mạch thực hiện hàng nghìn phép tính quỹ đạo thời gian thực để duy trì sự cân bằng động hoàn hảo.",
    metrics: [
      { label: "Chiều cao", value: "1.5 m" },
      { label: "Trọng lượng", value: "89 kg" },
      { label: "Hệ dẫn động", value: "Thủy lực / Điện" },
    ],
    tags: ["robot", "trí tuệ nhân tạo", "cơ điện tử"],
  },
  {
    id: "amazon-echo",
    phase: "industry-4",
    name: "Loa thông minh Amazon Echo",
    year: "2014",
    inventor: "Amazon",
    origin: "Seattle, Hoa Kỳ",
    motif: "amazon-echo",
    tagline: "Giao tiếp bằng giọng nói tự nhiên.",
    story:
      "Amazon Echo cùng trợ lý ảo Alexa được giới thiệu vào năm 2014, mang đến khả năng nhận diện giọng nói từ xa qua mạng lưới 7 micro độ nhạy cao. Người dùng có thể hỏi đáp thời tiết, phát nhạc, và điều khiển các thiết bị thông minh trong nhà bằng giọng nói tự nhiên.",
    whyItMatters:
      "Đưa AI và IoT (Internet vạn vật) vào sâu trong cuộc sống hàng ngày. Echo mở ra trào lưu giao diện giọng nói (Voice UI), biến trợ lý ảo trở thành trung tâm kết nối và điều hành ngôi nhà thông minh.",
    didYouKnow:
      "Cái tên 'Alexa' được lấy cảm hứng từ Thư viện Alexandria cổ đại — biểu tượng của tri thức nhân loại được lưu trữ và sẵn sàng chia sẻ.",
    metrics: [
      { label: "Microphone", value: "7" },
      { label: "Trợ lý ảo", value: "Alexa" },
      { label: "Kết nối", value: "Wi-Fi / BT" },
    ],
    tags: ["trí tuệ nhân tạo", "internet vạn vật", "giao tiếp"],
  },
  {
    id: "iphone-4s",
    phase: "industry-4",
    name: "Điện thoại iPhone 4S",
    year: "2011",
    inventor: "Apple",
    origin: "Cupertino, Hoa Kỳ",
    motif: "iphone-4s",
    tagline: "Sự ra mắt của Siri và kỷ nguyên di động thông minh.",
    story:
      "iPhone 4S được giới thiệu vào năm 2011. Điểm nổi bật nhất của phiên bản này là sự xuất hiện lần đầu tiên của Siri — trợ lý ảo điều khiển bằng giọng nói tích hợp sâu vào hệ điều hành di động, mở đầu cho kỷ nguyên AI trên thiết bị cá nhân.",
    whyItMatters:
      "Là đỉnh cao định hình lại mối quan hệ giữa con người và công nghệ trong CMCN 4.0. Điện thoại không còn là công cụ liên lạc thuần túy mà trở thành một trợ lý thông minh luôn túc trực trong túi áo.",
    didYouKnow:
      "iPhone 4S là sản phẩm cuối cùng được giới thiệu ngay trước khi đồng sáng lập Apple Steve Jobs qua đời một ngày, chữ 'S' trong tên gọi được viết tắt cho 'Siri'.",
    metrics: [
      { label: "Màn hình", value: "3.5 inch Retina" },
      { label: "Vi xử lý", value: "Apple A5 lõi kép" },
      { label: "Trợ lý ảo", value: "Siri" },
    ],
    tags: ["di động", "trí tuệ nhân tạo", "kết nối"],
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
    name: "Động lực cách mạng",
    description:
      "Từ hơi nước đến điện lực đến silicon và trí tuệ nhân tạo — nhân loại luôn tìm cách giải phóng năng lượng cơ bắp và trí óc.",
    color: "#e89446",
    exhibitIds: ["watt-steam", "dynamo", "intel-4004", "amazon-echo", "atlas-robot"],
  },
  {
    id: "shrinking-world",
    name: "Thu hẹp khoảng cách",
    description:
      "Các phương tiện vận chuyển và kết nối liên tục rút ngắn khoảng cách địa lý — từ tàu thủy, đầu máy xe lửa, máy bay cho đến chiếc điện thoại thông minh.",
    color: "#e8b53a",
    exhibitIds: ["steamboat-fulton", "rocket-locomotive", "wright-flyer", "motorola-dynatac", "iphone-4s"],
  },
  {
    id: "labor-automation",
    name: "Tự động hóa lao động",
    description:
      "Cơ chế dệt, điều khiển lập trình và robot hóa — máy móc liên tục thay thế các thao tác cơ học của con người từ thô sơ đến phức tạp.",
    color: "#4ade80",
    exhibitIds: ["flying-shuttle", "modicon-plc", "unimate-robot", "atlas-robot"],
  },
  {
    id: "computing-evolution",
    name: "Tiến hóa của điện toán",
    description:
      "Từ những chiếc máy vi tính đầu tiên cho đến các vi xử lý siêu nhỏ tích hợp trợ lý thông minh trợ giúp con người.",
    color: "#e879f9",
    exhibitIds: ["intel-4004", "altair-8800", "amazon-echo", "iphone-4s"],
  },
  {
    id: "intelligent-voice",
    name: "Giao tiếp thông minh",
    description:
      "Dòng điện thắp sáng và kích hoạt thiết bị, làm nền móng cho các hệ thống máy tính có khả năng giao tiếp ngôn ngữ tự nhiên.",
    color: "#00d4aa",
    exhibitIds: ["dynamo", "edison-phonograph", "altair-8800", "amazon-echo", "iphone-4s"],
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
