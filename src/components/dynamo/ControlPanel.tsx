'use client'

import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  RotateCw,
  Zap,
  Eye,
  Tag,
  Maximize2,
  Minimize2,
  Gauge,
  Power,
} from 'lucide-react'
import { DynamoPartsVisibility, DynamoLabels } from './Dynamo3D'

interface ControlPanelProps {
  rotationSpeed: number
  setRotationSpeed: (v: number) => void
  isGenerating: boolean
  setIsGenerating: (v: boolean) => void
  visible: DynamoPartsVisibility
  setVisible: (v: DynamoPartsVisibility) => void
  labels: DynamoLabels
  setLabels: (v: DynamoLabels) => void
  explode: number
  setExplode: (v: number) => void
}

const PART_LIST: { key: keyof DynamoPartsVisibility; name: string; color: string }[] = [
  { key: 'housing', name: 'Vỏ ngoài (Stator)', color: 'bg-slate-500' },
  { key: 'magnets', name: 'Nam châm', color: 'bg-red-500' },
  { key: 'armature', name: 'Lõi rô-to', color: 'bg-zinc-500' },
  { key: 'windings', name: 'Cuộn dây đồng', color: 'bg-orange-500' },
  { key: 'commutator', name: 'Cổ góp', color: 'bg-amber-500' },
  { key: 'brushes', name: 'Chổi than', color: 'bg-gray-700' },
  { key: 'shaft', name: 'Trục quay', color: 'bg-slate-300' },
  { key: 'bearings', name: 'Vòng bi', color: 'bg-yellow-500' },
  { key: 'terminals', name: 'Cực đầu ra', color: 'bg-rose-500' },
]

export default function ControlPanel(props: ControlPanelProps) {
  const {
    rotationSpeed,
    setRotationSpeed,
    isGenerating,
    setIsGenerating,
    visible,
    setVisible,
    labels,
    setLabels,
    explode,
    setExplode,
  } = props

  const toggleAllVisible = (val: boolean) => {
    setVisible({
      housing: val, magnets: val, armature: val, windings: val,
      commutator: val, brushes: val, shaft: val, bearings: val, terminals: val,
    })
  }
  const toggleAllLabels = (val: boolean) => {
    setLabels({
      housing: val, magnets: val, armature: val, windings: val,
      commutator: val, brushes: val, shaft: val, bearings: val, terminals: val,
    })
  }

  // Convert speed (rad/s) to RPM for display
  const rpm = Math.round((rotationSpeed * 60) / (2 * Math.PI))

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar">
      {/* Power & Rotation */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-400 text-base flex items-center gap-2">
            <Power className="w-4 h-4" />
            Điều khiển hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Generating toggle */}
          <div className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2.5 border border-slate-700/40">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${isGenerating ? 'text-amber-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-sm font-medium text-slate-200">Phát điện</div>
                <div className="text-xs text-slate-500">Kích hoạt hiệu ứng dòng điện</div>
              </div>
            </div>
            <Switch checked={isGenerating} onCheckedChange={setIsGenerating} />
          </div>

          {/* Rotation speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-slate-200">
                <RotateCw className="w-4 h-4 text-amber-400" />
                Tốc độ quay
              </Label>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono">
                {rpm} RPM
              </Badge>
            </div>
            <Slider
              value={[rotationSpeed]}
              onValueChange={(v) => setRotationSpeed(v[0])}
              min={0}
              max={20}
              step={0.1}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800"
                onClick={() => setRotationSpeed(0)}
              >
                Dừng
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800"
                onClick={() => setRotationSpeed(5)}
              >
                Chậm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800"
                onClick={() => setRotationSpeed(12)}
              >
                Nhanh
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-700/50" />

          {/* Explode view */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-slate-200">
                {explode > 0.5 ? <Maximize2 className="w-4 h-4 text-amber-400" /> : <Minimize2 className="w-4 h-4 text-amber-400" />}
                Phân tách bộ phận
              </Label>
              <Badge variant="outline" className="border-slate-600 text-slate-300 font-mono">
                {Math.round(explode * 100)}%
              </Badge>
            </div>
            <Slider
              value={[explode]}
              onValueChange={(v) => setExplode(v[0])}
              min={0}
              max={1}
              step={0.05}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parts visibility */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-amber-400 text-base flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Hiển thị bộ phận
          </CardTitle>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              onClick={() => toggleAllVisible(true)}
            >
              Tất cả
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              onClick={() => toggleAllVisible(false)}
            >
              Ẩn hết
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-1.5">
          {PART_LIST.map((p) => (
            <div
              key={p.key}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                <span className="text-sm text-slate-200">{p.name}</span>
              </div>
              <Switch
                checked={visible[p.key]}
                onCheckedChange={(v) => setVisible({ ...visible, [p.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Labels */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-amber-400 text-base flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Nhãn chú thích
          </CardTitle>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              onClick={() => toggleAllLabels(true)}
            >
              Bật hết
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              onClick={() => toggleAllLabels(false)}
            >
              Tắt hết
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-1.5">
          {PART_LIST.map((p) => (
            <div
              key={p.key}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                <span className="text-sm text-slate-200">{p.name}</span>
              </div>
              <Switch
                checked={labels[p.key]}
                onCheckedChange={(v) => setLabels({ ...labels, [p.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick presets */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-400 text-base flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Góc nhìn nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-xs"
            onClick={() => {
              const event = new CustomEvent('dynamo-camera', { detail: { view: 'front' } })
              window.dispatchEvent(event)
            }}
          >
            Mặt trước
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-xs"
            onClick={() => {
              const event = new CustomEvent('dynamo-camera', { detail: { view: 'side' } })
              window.dispatchEvent(event)
            }}
          >
            Bên cạnh
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800 text-xs"
            onClick={() => {
              const event = new CustomEvent('dynamo-camera', { detail: { view: 'top' } })
              window.dispatchEvent(event)
            }}
          >
            Từ trên
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
