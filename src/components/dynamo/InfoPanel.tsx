'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Cog,
  Magnet,
  CircleDot,
  Zap,
  Wrench,
  Gauge,
  Activity,
  ArrowRight,
} from 'lucide-react'

const SPECS = [
  { label: 'Công suất định mức', value: '500 W', icon: Zap },
  { label: 'Điện áp đầu ra', value: '12 V DC', icon: Activity },
  { label: 'Dòng điện định mức', value: '41.7 A', icon: Gauge },
  { label: 'Tốc độ danh nghĩa', value: '1500 RPM', icon: Cog },
  { label: 'Số cực từ', value: '2 cực (N-S)', icon: Magnet },
  { label: 'Số khe rãnh rô-to', value: '12 rãnh', icon: CircleDot },
  { label: 'Loại cuộn dây', value: 'Đồng ADC 1.5mm²', icon: Wrench },
  { label: 'Cách điện', value: 'Lớp E (120°C)', icon: Activity },
]

const PRINCIPLE_STEPS = [
  {
    step: 1,
    title: 'Từ trường cố định',
    desc: 'Nam châm vĩnh cửu tạo ra từ trường song song giữa hai cực N và S bên trong vỏ stator. Đây là từ trường kích từ tĩnh, không đổi.',
  },
  {
    step: 2,
    title: 'Rô-to quay cắt từ thông',
    desc: 'Khi trục được dẫn động quay (bởi bánh đai hoặc động cơ), cuộn dây đồng trên rô-to cắt các đường sức từ, tạo ra sức điện động cảm ứng.',
  },
  {
    step: 3,
    title: 'Sức điện động cảm ứng',
    desc: 'Theo định luật Faraday, EMF = N × (dΦ/dt). Mỗi vòng quay làm từ thông qua cuộn dây thay đổi liên tục, sinh ra dòng điện xoay chiều bên trong cuộn.',
  },
  {
    step: 4,
    title: 'Cổ góp đổi chiều',
    desc: 'Cổ góp gồm 12 phiến đồng cách điện với nhau, quay cùng rô-to. Cứ mỗi nửa vòng, cổ góp đảo chiều tiếp xúc với chổi than, đổi AC thành DC ở đầu ra.',
  },
  {
    step: 5,
    title: 'Chổi than tiếp điện',
    desc: 'Hai chổi than bằng carbon ép sát vào cổ góp nhờ lò xo, thu dòng điện từ rô-to quay truyền ra cực (+) và (-) cố định bên ngoài.',
  },
  {
    step: 6,
    title: 'Điện áp DC đầu ra',
    desc: 'Điện áp một chiều có độ gợn sóng nhỏ xuất hiện ở hai cực đầu ra, sẵn sàng cấp cho tải - đèn, acquy, mạch điện...',
  },
]

export default function InfoPanel() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar">
      {/* Principle of operation */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-400 text-base flex items-center gap-2">
            <Cog className="w-4 h-4" />
            Nguyên lý hoạt động
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Dynamo (máy phát điện một chiều) biến cơ năng thành điện năng dựa trên hiện tượng cảm ứng điện từ.
          </p>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {PRINCIPLE_STEPS.map((s, idx) => (
            <div key={s.step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xs font-bold">
                  {s.step}
                </div>
                {idx < PRINCIPLE_STEPS.length - 1 && (
                  <div className="w-px h-full min-h-[20px] bg-slate-700 mt-1" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="text-sm font-semibold text-slate-100">{s.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Technical specs */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-400 text-base flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Thông số kỹ thuật
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2">
          {SPECS.map((spec, i) => {
            const Icon = spec.icon
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-md px-2.5 py-2 bg-slate-800/40 border border-slate-700/30"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-300">{spec.label}</span>
                </div>
                <Badge variant="secondary" className="bg-amber-500/15 text-amber-300 border-amber-500/30 font-mono text-xs">
                  {spec.value}
                </Badge>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Formula card */}
      <Card className="bg-gradient-to-br from-amber-950/40 to-slate-900/70 border-amber-700/40 backdrop-blur-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-400 text-base">Công thức vật lý</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md bg-slate-900/60 p-3 border border-slate-700/40">
            <div className="text-xs text-slate-400 mb-1">Định luật Faraday (sức điện động cảm ứng)</div>
            <div className="font-mono text-amber-300 text-sm">
              E = −N × (dΦ / dt)
            </div>
          </div>
          <div className="rounded-md bg-slate-900/60 p-3 border border-slate-700/40">
            <div className="text-xs text-slate-400 mb-1">Sức điện động động cơ phản ứng</div>
            <div className="font-mono text-amber-300 text-sm">
              E = B × L × v × sin(θ)
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              B: cảm ứng từ • L: chiều dài dây • v: vận tốc • θ: góc cắt
            </div>
          </div>
          <div className="rounded-md bg-slate-900/60 p-3 border border-slate-700/40">
            <div className="text-xs text-slate-400 mb-1">Công suất phát điện</div>
            <div className="font-mono text-amber-300 text-sm">
              P = E × I = E² / R
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-slate-900/70 border-slate-700/60 backdrop-blur-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-400 text-sm flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Mẹo sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside marker:text-amber-400">
            <li>Kéo thả chuột để xoay mô hình</li>
            <li>Cuộn chuột để phóng to/thu nhỏ</li>
            <li>Bật "Phát điện" rồi tăng tốc độ quay để thấy hiệu ứng</li>
            <li>Dùng thanh "Phân tách" để xem từng bộ phận riêng biệt</li>
            <li>Ẩn vỏ ngoài để quan sát cấu trúc bên trong rõ hơn</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
