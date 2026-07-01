import { NextResponse } from "next/server";
import { PHASES, EXHIBITS } from "@/lib/museum-data";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const CEREBRAS_API = "https://api.cerebras.ai/v1/chat/completions";

interface ChatRequest {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}

function buildExhibitContext(): string {
  const lines: string[] = [];
  for (const phase of PHASES) {
    lines.push(`\n[${phase.label} - ${phase.name}] ${phase.era} (${phase.period})`);
    lines.push(`  ${phase.intro}`);
    for (const ex of EXHIBITS.filter((e) => e.phase === phase.id)) {
      const metrics = ex.metrics.map((m) => `${m.label}: ${m.value}`).join(" | ");
      lines.push(
        `- ${ex.name} (${ex.year}) — ${ex.inventor}, ${ex.origin}: ${ex.tagline} [${metrics}]`,
      );
    }
  }
  return lines.join("\n");
}

const SUGGESTED_FOLLOWUPS = [
  "Kể về động cơ hơi nước Watt",
  "Cách mạng 4.0 có gì đặc biệt?",
  "Hiện vật nào nổi bật nhất?",
  "Tại sao gọi là Atrium?",
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "CEREBRAS_API_KEY chưa được cấu hình" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as ChatRequest;
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Thiếu nội dung tin nhắn" },
        { status: 400 },
      );
    }

    const userMsg = messages.filter((m) => m.role === "user").pop();
    if (!userMsg || userMsg.content.length > 1000) {
      return NextResponse.json(
        { error: "Câu hỏi quá dài (tối đa 1000 ký tự)" },
        { status: 400 },
      );
    }

    const exhibitContext = buildExhibitContext();

    const systemPrompt = `Bạn là hướng dẫn viên AI của Bảo tàng Atrium — một bảo tàng lịch sử kỹ thuật số về bốn cuộc cách mạng công nghiệp.

Dưới đây là danh sách đầy đủ các hiện vật trong bảo tàng, phân theo từng kỷ nguyên:

${exhibitContext}

Nhiệm vụ:
- Trả lời bằng tiếng Việt, giọng thân thiện, nhiệt huyết như một người hướng dẫn viên thực thụ.
- Khi được hỏi về hiện vật cụ thể, hãy mô tả chi tiết dựa trên dữ liệu bên trên. Nếu muốn thêm bối cảnh lịch sử, hãy dùng kiến thức của riêng bạn.
- Nếu người dùng hỏi về một hiện vật không có trong danh sách hoặc bạn không biết, hãy nói thật "Mình chưa có thông tin về hiện vật đó".
- Trả lời ngắn gọn, tối đa 4-5 câu.
- TUYET DOI KHONG dung markdown. KHONG duoc dung **, *, ___ de nhan manh. Chi dung van ban thuan tuy. Co the dung emoji va xuong dong.`;

    const cerebraMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages,
    ];

    const res = await fetch(CEREBRAS_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.model || "llama3.3-70b",
        messages: cerebraMessages,
        max_tokens: 750,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[chat] Cerebras error", res.status, errText);
      return NextResponse.json(
        { error: `AI phản hồi lỗi (${res.status})` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const content =
      data.choices?.[0]?.message?.content?.trim() ||
      "Xin lỗi, mình không hiểu câu hỏi. Bạn có thể hỏi lại cách khác không?";

    return NextResponse.json({
      response: content,
      suggestedFollowups: SUGGESTED_FOLLOWUPS,
    });
  } catch (err) {
    console.error("[chat] error", err);
    return NextResponse.json(
      { error: "AI đang bận — vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
