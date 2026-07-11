export type DynamoPartId =
  | "housing"
  | "magnets"
  | "armature"
  | "windings"
  | "commutator"
  | "brushes"
  | "shaft"
  | "bearings"
  | "terminals";

export interface DynamoPart {
  id: DynamoPartId;
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
  accent: string;
}

export const DYNAMO_PARTS: DynamoPart[] = [
  {
    id: "housing",
    name: { vi: "Vỏ máy (Housing)", en: "Housing" },
    desc: { vi: "Bảo vệ các bộ phận bên trong và tạo khung từ trường.", en: "Protects internal components and provides a magnetic frame." },
    accent: "#6a6e74"
  },
  {
    id: "magnets",
    name: { vi: "Nam châm trường (Field Magnets)", en: "Field Magnets" },
    desc: { vi: "Tạo ra từ trường mạnh, tĩnh để cuộn dây cắt qua.", en: "Creates a strong, static magnetic field for the armature to cut through." },
    accent: "#1e3a8a"
  },
  {
    id: "armature",
    name: { vi: "Lõi thép rô-to (Armature Core)", en: "Armature Core" },
    desc: { vi: "Lõi thép từ tính xoay trong từ trường, dẫn từ thông.", en: "Magnetic steel core that rotates within the magnetic field, guiding flux." },
    accent: "#9ca3af"
  },
  {
    id: "windings",
    name: { vi: "Cuộn dây rô-to (Armature Windings)", en: "Armature Windings" },
    desc: { vi: "Các vòng dây đồng nơi dòng điện cảm ứng được sinh ra.", en: "Copper wire loops where induced current is generated." },
    accent: "#d97706"
  },
  {
    id: "commutator",
    name: { vi: "Cổ góp (Commutator)", en: "Commutator" },
    desc: { vi: "Đảo chiều dòng điện xoay chiều thành dòng điện một chiều.", en: "Reverses the direction of alternating current into direct current." },
    accent: "#b45309"
  },
  {
    id: "brushes",
    name: { vi: "Chổi than (Brushes)", en: "Brushes" },
    desc: { vi: "Truyền điện năng từ cổ góp đang quay ra mạch ngoài.", en: "Transfers electrical power from the rotating commutator to the external circuit." },
    accent: "#374151"
  },
  {
    id: "shaft",
    name: { vi: "Trục quay (Shaft)", en: "Shaft" },
    desc: { vi: "Trục truyền động cơ học quay toàn bộ rô-to.", en: "Mechanical drive shaft that rotates the entire armature assembly." },
    accent: "#d1d5db"
  },
  {
    id: "bearings",
    name: { vi: "Ổ trục (Bearings)", en: "Bearings" },
    desc: { vi: "Giảm ma sát và nâng đỡ trục quay ở hai đầu.", en: "Reduces friction and supports the rotating shaft at both ends." },
    accent: "#9ca3af"
  },
  {
    id: "terminals",
    name: { vi: "Cực điện (Terminals)", en: "Terminals" },
    desc: { vi: "Điểm kết nối điện năng đầu ra với thiết bị tiêu thụ.", en: "Connection points for output electrical power to consumer devices." },
    accent: "#ef4444"
  }
];
