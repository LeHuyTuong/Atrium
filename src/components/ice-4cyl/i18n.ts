"use client";

import type { Language } from "./useEngineStore";

const STRINGS = {
  vi: {
    appTitle: "Động cơ đốt trong 4 kỳ 3D",
    appSubtitle: "Nikolaus Otto · 1876 · Mô hình tương tác",
    running: "Đang chạy",
    stopped: "Dừng",

    controlPanel: "Bảng điều khiển",
    scenarios: "Kịch bản vận hành",
    scenarioIdle: "Không tải",
    scenarioNormal: "Vận hành chuẩn",
    scenarioFull: "Toàn tải",
    scenarioOverload: "Quá tải",
    pause: "Tạm dừng",
    start: "Khởi động",
    reset: "Đặt lại thông số",
    targetSpeed: "Tốc độ mục tiêu",
    throttle: "Van tiết lưu",
    externalLoad: "Tải ngoài",
    timingAdvance: "Đánh lửa sớm",
    viewAngle: "Góc nhìn",
    viewHero: "Toàn cảnh",
    viewSide: "Bên hông",
    viewTop: "Từ trên",
    viewCutaway: "Cắt ngang",
    viewCrankshaft: "Trục khuỷu",
    explodedView: "Sơ đồ nổ",
    fuelSpray: "Phun nhiên liệu",
    sparkEffect: "Hiệu ứng đánh lửa",
    crossSection: "Cắt ngang động cơ",
    partLabels: "Nhãn phụ tùng",
    labelsOff: "Tắt",
    labelsCompact: "Tên",
    labelsFull: "Đầy đủ",

    gauges: "Đồng hồ đo",
    revsPerMin: "vòng/phút",
    power: "Công suất",
    revs: "Số vòng",
    runtime: "Thời gian",
    pistonPos: "Vị trí pít-tông",
    cylinderPressure: "Áp suất xy-lanh",
    low: "Thấp",
    high: "Cao",

    partsTitle: "Phụ tùng & nguyên lý",
    partDetail: "Chi tiết phụ tùng",
    categoryBlock: "Thân máy",
    categoryRotating: "Chuyển động quay",
    categoryValvetrain: "Cơ cấu phân phối khí",
    categoryFuel: "Nhiên liệu & đánh lửa",
    tip: "Mẹo",
    tipText: "Kéo chuột để xoay mô hình, lăn bánh xe để zoom. Bấm vào phụ tùng để xem chi tiết.",

    tourTitle: "Hướng dẫn tham quan",
    tourStep: "Bước",
    tourPrev: "Trước",
    tourNext: "Sau",
    tourContinue: "Tiếp tục",

    helpTitle: "Phím tắt",
    helpSubtitle: "Điều khiển nhanh bằng bàn phím",
    helpFooter: "Phím tắt bị vô hiệu khi đang gõ trong ô nhập liệu. Nhấn Esc để đóng.",

    dragRotate: "Kéo để xoay",
    scrollZoom: "Lăn để zoom",
    clickPart: "Bấm phụ tùng để xem",
    footerCredit: "Atrium · Mô hình 3D tương tác · Cách mạng Công nghiệp",

    language: "Ngôn ngữ",

    phaseIntake: "Nạp",
    phaseCompression: "Nén",
    phasePower: "Nổ",
    phaseExhaust: "Xả",
  },
  en: {
    appTitle: "4-Stroke ICE 3D",
    appSubtitle: "Nikolaus Otto · 1876 · Interactive model",
    running: "Running",
    stopped: "Stopped",

    controlPanel: "Control Panel",
    scenarios: "Operating scenarios",
    scenarioIdle: "Idle",
    scenarioNormal: "Normal",
    scenarioFull: "Full load",
    scenarioOverload: "Overload",
    pause: "Pause",
    start: "Start",
    reset: "Reset settings",
    targetSpeed: "Target speed",
    throttle: "Throttle",
    externalLoad: "External load",
    timingAdvance: "Spark advance",
    viewAngle: "View angle",
    viewHero: "Overview",
    viewSide: "Side",
    viewTop: "Top",
    viewCutaway: "Cutaway",
    viewCrankshaft: "Crankshaft",
    explodedView: "Exploded view",
    fuelSpray: "Fuel spray",
    sparkEffect: "Spark effect",
    crossSection: "Cross-section",
    partLabels: "Part labels",
    labelsOff: "Off",
    labelsCompact: "Names",
    labelsFull: "Full",

    gauges: "Gauges",
    revsPerMin: "rev/min",
    power: "Power",
    revs: "Revolutions",
    runtime: "Runtime",
    pistonPos: "Piston position",
    cylinderPressure: "Cylinder pressure",
    low: "Low",
    high: "High",

    partsTitle: "Parts & principles",
    partDetail: "Part detail",
    categoryBlock: "Engine block",
    categoryRotating: "Rotating assembly",
    categoryValvetrain: "Valvetrain",
    categoryFuel: "Fuel & ignition",
    tip: "Tip",
    tipText: "Drag to rotate, scroll to zoom. Click a part to inspect.",

    tourTitle: "Guided tour",
    tourStep: "Step",
    tourPrev: "Prev",
    tourNext: "Next",
    tourContinue: "Continue",

    helpTitle: "Keyboard shortcuts",
    helpSubtitle: "Quick keyboard controls",
    helpFooter: "Shortcuts are disabled while typing in input fields. Press Esc to close.",

    dragRotate: "Drag to rotate",
    scrollZoom: "Scroll to zoom",
    clickPart: "Click a part to inspect",
    footerCredit: "Atrium · Interactive 3D model · Industrial Revolution",

    language: "Language",

    phaseIntake: "Intake",
    phaseCompression: "Compression",
    phasePower: "Power",
    phaseExhaust: "Exhaust",
  },
} as const;

export type StringKey = keyof (typeof STRINGS)["vi"];

export function t(lang: Language, key: StringKey): string {
  return STRINGS[lang][key] ?? STRINGS.vi[key] ?? key;
}

export function makeT(lang: Language) {
  return (key: StringKey) => t(lang, key);
}
