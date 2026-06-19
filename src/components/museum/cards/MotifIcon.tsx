"use client";

import { Motif } from "@/lib/museum-data";
import {
  Flame,
  Layers,
  Cog,
  TrainFront,
  Sprout,
  Anvil,
  Lamp,
  ShieldHalf,
  Zap,
  Factory,
  Atom,
  Cylinder,
  Radio,
  Gauge,
  Lightbulb,
  Network,
  Cpu,
  Monitor,
  Barcode,
  Globe,
  Phone,
  Satellite,
  Brain,
  Cloud,
  Printer,
  Car,
  Smartphone,
  Boxes,
  Rocket,
  Bot,
  CircuitBoard,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Partial<Record<Motif, LucideIcon>> = {
  steam: Flame,
  loom: Layers,
  gear: Cog,
  locomotive: TrainFront,
  "cotton-gin": Sprout,
  puddling: Anvil,
  "gas-lamp": Lamp,
  "thames-shield": ShieldHalf,
  bolt: Zap,
  assembly: Factory,
  dynamo: Atom,
  otto: Cylinder,
  marconi: Radio,
  "edison-meter": Gauge,
  "light-bulb": Lightbulb,
  bulb: Lightbulb,
  network: Network,
  chip: Cpu,
  monitor: Monitor,
  upc: Barcode,
  www: Globe,
  phone: Phone,
  gps: Satellite,
  brain: Brain,
  cloud: Cloud,
  printer: Printer,
  car: Car,
  smartphone: Smartphone,
  transformer: Boxes,
  rocket: Rocket,
  robot: Bot,
  "neural-net": CircuitBoard,
};

export function MotifIcon({
  motif,
  className,
  strokeWidth = 1.5,
}: {
  motif: Motif;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[motif] ?? Cog;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
