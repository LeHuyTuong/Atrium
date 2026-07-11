export type PCPartId = "system-unit" | "monitor" | "keyboard" | "floppy";

export interface PCPart {
  id: PCPartId;
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
  accent: string;
}

export const PC_PARTS: PCPart[] = [
  {
    id: "system-unit",
    name: { vi: "Thùng máy (System Unit)", en: "System Unit" },
    desc: { vi: "Trái tim của IBM PC, chứa CPU Intel 8088 và bo mạch chủ.", en: "The heart of the IBM PC, containing the Intel 8088 CPU and motherboard." },
    accent: "#c8c2b4"
  },
  {
    id: "monitor",
    name: { vi: "Màn hình CRT (Monitor)", en: "CRT Monitor" },
    desc: { vi: "Màn hình IBM 5151 phosphor xanh lá đặc trưng.", en: "The iconic IBM 5151 green phosphor display." },
    accent: "#33ff66"
  },
  {
    id: "keyboard",
    name: { vi: "Bàn phím Model F (Keyboard)", en: "Model F Keyboard" },
    desc: { vi: "Bàn phím cơ học nổi tiếng với tiếng gõ lách cách, 84 phím.", en: "Famous mechanical keyboard with buckling springs, 84 keys." },
    accent: "#a8a294"
  },
  {
    id: "floppy",
    name: { vi: "Đĩa mềm 5.25\" (Floppy Disk)", en: "5.25\" Floppy Disk" },
    desc: { vi: "Chứa hệ điều hành PC-DOS 1.0 và phần mềm.", en: "Contains the PC-DOS 1.0 OS and software." },
    accent: "#1a1a1a"
  }
];
