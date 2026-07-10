"use client";

import type { Language } from "./useEngineStore";

/** All UI strings in Vietnamese + English. Access via `t(lang, key)`. */
const STRINGS = {
  vi: {
    // Header
    appTitle: "Động cơ hơi nước Watt 3D",
    appSubtitle: "James Watt · 1776 · Mô hình tương tác",
    running: "Đang chạy",
    stopped: "Dừng",

    // Control panel
    controlPanel: "Bảng điều khiển",
    scenarios: "Kịch bản vận hành",
    scenarioStartup: "Khởi động",
    scenarioNormal: "Vận hành chuẩn",
    scenarioFull: "Tối đa",
    scenarioOverload: "Quá tải",
    pause: "Tạm dừng",
    start: "Khởi động",
    reset: "Đặt lại thông số",
    toggleAudio: "Bật/tắt âm thanh",
    toggleAudioOn: "Tắt âm thanh",
    toggleAudioOff: "Bật âm thanh động cơ",
    audioVolume: "Âm lượng",
    tour: "Hướng dẫn tham quan",
    tourActive: "Đang tham quan…",
    shortcuts: "Phím tắt",
    workshopLight: "Ánh sáng xưởng",
    day: "Ngày",
    dusk: "Hoàng hôn",
    night: "Đêm",
    targetSpeed: "Tốc độ mục tiêu",
    steamPressure: "Áp suất hơi",
    throttle: "Van tiết lưu",
    throttleAuto: "Van tiết lưu (tự động)",
    externalLoad: "Tải ngoài",
    viewAngle: "Góc nhìn",
    viewHero: "Toàn cảnh",
    viewSide: "Bên hông",
    viewTop: "Từ trên",
    viewCylinder: "Xy-lanh",
    viewFlywheel: "Bánh đà",
    governor: "Bộ điều tốc ly tâm",
    governorAuto: "Tự động giữ tốc độ",
    explodedView: "Sơ đồ nổ (tách phụ tùng)",
    pvDiagram: "Sơ đồ P–V chu trình",
    steamEffects: "Hiệu ứng hơi",
    fireCoal: "Lửa & than",
    crossSection: "Cắt ngang xy-lanh",
    partLabels: "Nhãn phụ tùng",
    labelsOff: "Tắt",
    labelsCompact: "Tên",
    labelsFull: "Đầy đủ",
    autoByGov: "(tự động bởi bộ điều tốc)",

    // Gauge panel
    gauges: "Đồng hồ đo",
    revsPerMin: "vòng/phút",
    boilerTemp: "Nhiệt độ lò hơi",
    power: "Công suất",
    revs: "Số vòng",
    runtime: "Thời gian",
    steamValve: "Van hơi",
    governorSleeve: "Bộ điều tốc (sleeve)",
    pistonPos: "Vị trí pít-tông",
    low: "Thấp",
    high: "Cao",

    // P-V panel
    pvTitle: "Sơ đồ P–V chu trình hơi",
    volume: "Thể tích",
    pressureAxis: "Áp suất",
    phase: "Giai đoạn",
    workPerRev: "Công/vòng",
    efficiency: "Hiệu suất",
    cycleSpeed: "Tốc độ chu trình",
    live: "Trực tiếp",
    strokeAdmission: "Nạp hơi",
    strokeExpansion: "Dãn nở",
    strokeExhaust: "Xả hơi",
    strokeCompression: "Nén",
    pvExplain:
      "Diện tích vùng kín bằng công cơ học sinh ra mỗi chu trình. Watt tách bộ ngưng ra khỏi xy-lanh nên đường xả hạ sát đáy — diện tích lớn hơn hẳn so với Newcomen.",

    // Info panel
    partsTitle: "Phụ tùng & nguyên lý",
    partDetail: "Chi tiết phụ tùng",
    categoryStructure: "Kết cấu",
    categorySteam: "Chu trình hơi",
    categoryMotion: "Chuyển động",
    categoryControl: "Điều khiển",
    tip: "Mẹo",
    tipText:
      "Kéo chuột để xoay mô hình, lăn bánh xe để zoom. Bấm vào phụ tùng khác trên mô hình 3D để xem chi tiết.",

    // Tour
    tourTitle: "Hướng dẫn tham quan",
    tourStep: "Bước",
    tourPrev: "Trước",
    tourNext: "Sau",
    tourContinue: "Tiếp tục",

    // Help
    helpTitle: "Phím tắt",
    helpSubtitle: "Điều khiển nhanh bằng bàn phím",
    helpFooter:
      "Phím tắt bị vô hiệu khi đang gõ trong ô nhập liệu. Nhấn Esc để đóng.",

    // Footer
    dragRotate: "Kéo để xoay",
    scrollZoom: "Lăn để zoom",
    clickPart: "Bấm phụ tùng để xem",
    footerCredit: "Z.ai · Mô hình 3D tương tác · Cách mạng Công nghiệp",

    // Mobile
    mControls: "Điều khiển",
    mGauges: "Đồng hồ",
    mParts: "Phụ tùng",
    mCycle: "Chu trình",
    mMetrics: "Đồ thị",

    // Metrics
    metricsTitle: "Đồ thị hiệu suất",
    metricsRpm: "RPM",
    metricsPower: "Công suất (kW)",
    metricsPressure: "Áp suất (%)",
    metricsThrottle: "Van tiết lưu (%)",
    metricsWindow: "Cửa sổ 60 giây cuối",

    // Language
    language: "Ngôn ngữ",
  },
  en: {
    appTitle: "Watt Steam Engine 3D",
    appSubtitle: "James Watt · 1776 · Interactive model",
    running: "Running",
    stopped: "Stopped",

    controlPanel: "Control Panel",
    scenarios: "Operating scenarios",
    scenarioStartup: "Startup",
    scenarioNormal: "Normal",
    scenarioFull: "Maximum",
    scenarioOverload: "Overload",
    pause: "Pause",
    start: "Start",
    reset: "Reset settings",
    toggleAudio: "Toggle audio",
    toggleAudioOn: "Turn audio off",
    toggleAudioOff: "Turn engine audio on",
    audioVolume: "Volume",
    tour: "Guided tour",
    tourActive: "Touring…",
    shortcuts: "Shortcuts",
    workshopLight: "Workshop light",
    day: "Day",
    dusk: "Dusk",
    night: "Night",
    targetSpeed: "Target speed",
    steamPressure: "Steam pressure",
    throttle: "Throttle valve",
    throttleAuto: "Throttle (automatic)",
    externalLoad: "External load",
    viewAngle: "View angle",
    viewHero: "Overview",
    viewSide: "Side",
    viewTop: "Top",
    viewCylinder: "Cylinder",
    viewFlywheel: "Flywheel",
    governor: "Centrifugal governor",
    governorAuto: "Auto speed control",
    explodedView: "Exploded view (separate parts)",
    pvDiagram: "P–V cycle diagram",
    steamEffects: "Steam effects",
    fireCoal: "Fire & coal",
    crossSection: "Cylinder cross-section",
    partLabels: "Part labels",
    labelsOff: "Off",
    labelsCompact: "Names",
    labelsFull: "Full",
    autoByGov: "(auto by governor)",

    gauges: "Gauges",
    revsPerMin: "rev/min",
    boilerTemp: "Boiler temperature",
    power: "Power",
    revs: "Revolutions",
    runtime: "Runtime",
    steamValve: "Steam valve",
    governorSleeve: "Governor sleeve",
    pistonPos: "Piston position",
    low: "Low",
    high: "High",

    pvTitle: "P–V Steam cycle diagram",
    volume: "Volume",
    pressureAxis: "Pressure",
    phase: "Phase",
    workPerRev: "Work/rev",
    efficiency: "Efficiency",
    cycleSpeed: "Cycle speed",
    live: "Live",
    strokeAdmission: "Admission",
    strokeExpansion: "Expansion",
    strokeExhaust: "Exhaust",
    strokeCompression: "Compression",
    pvExplain:
      "The enclosed area equals the mechanical work per cycle. Watt separated the condenser so the exhaust line drops near the bottom — much larger area than Newcomen's.",

    partsTitle: "Parts & principles",
    partDetail: "Part detail",
    categoryStructure: "Structure",
    categorySteam: "Steam cycle",
    categoryMotion: "Motion",
    categoryControl: "Control",
    tip: "Tip",
    tipText:
      "Drag to rotate the model, scroll to zoom. Click another part on the 3D model to see details.",

    tourTitle: "Guided tour",
    tourStep: "Step",
    tourPrev: "Prev",
    tourNext: "Next",
    tourContinue: "Continue",

    helpTitle: "Keyboard shortcuts",
    helpSubtitle: "Quick keyboard controls",
    helpFooter:
      "Shortcuts are disabled while typing in input fields. Press Esc to close.",

    dragRotate: "Drag to rotate",
    scrollZoom: "Scroll to zoom",
    clickPart: "Click a part to inspect",
    footerCredit: "Z.ai · Interactive 3D model · Industrial Revolution",

    mControls: "Controls",
    mGauges: "Gauges",
    mParts: "Parts",
    mCycle: "Cycle",
    mMetrics: "Metrics",

    metricsTitle: "Performance chart",
    metricsRpm: "RPM",
    metricsPower: "Power (kW)",
    metricsPressure: "Pressure (%)",
    metricsThrottle: "Throttle (%)",
    metricsWindow: "Last 60-second window",

    language: "Language",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["vi"];

/** Translate a key for the given language. Falls back to Vietnamese. */
export function t(lang: Language, key: StringKey): string {
  return STRINGS[lang][key] ?? STRINGS.vi[key] ?? key;
}

/** Convenience hook-free translator for components that already have `lang`. */
export function makeT(lang: Language) {
  return (key: StringKey) => t(lang, key);
}
