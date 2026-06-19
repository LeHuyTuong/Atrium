import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/narrate
 * Body: { text: string, phase?: string }
 * Returns: audio/wav buffer (streamed directly, no file persistence)
 *
 * Uses z-ai-web-dev-sdk TTS (backend only). Text is split into chunks
 * if > 1000 chars (API limit), then concatenated as a single WAV response.
 */
export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "missing text" }, { status: 400 });
    }

    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // Split text into ≤1000-char chunks at sentence boundaries
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let cur = "";
    for (const s of sentences) {
      if ((cur + s).length <= 1000) {
        cur += s;
      } else {
        if (cur) chunks.push(cur.trim());
        cur = s;
      }
    }
    if (cur) chunks.push(cur.trim());

    // If text was a single long sentence, hard-split
    const finalChunks: string[] = [];
    for (const c of chunks) {
      if (c.length <= 1000) {
        finalChunks.push(c);
      } else {
        for (let i = 0; i < c.length; i += 1000) {
          finalChunks.push(c.slice(i, i + 1000));
        }
      }
    }

    // Use a warm, professional Vietnamese-friendly voice
    // tongtong = warm, xiaochen = steady/professional
    const voiceId = voice || "tongtong";

    if (finalChunks.length === 1) {
      const response = await zai.audio.tts.create({
        input: finalChunks[0],
        voice: voiceId,
        speed: 1.0,
        response_format: "wav",
        stream: false,
      });
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Multi-chunk: fetch all, then concatenate (strip WAV headers from chunks 2..n)
    const buffers: Buffer[] = [];
    for (let i = 0; i < finalChunks.length; i++) {
      const response = await zai.audio.tts.create({
        input: finalChunks[i],
        voice: voiceId,
        speed: 1.0,
        response_format: "wav",
        stream: false,
      });
      const ab = await response.arrayBuffer();
      const buf = Buffer.from(new Uint8Array(ab));
      if (i === 0) {
        buffers.push(buf); // keep header
      } else {
        // Strip 44-byte WAV header for concatenation
        buffers.push(buf.subarray(44));
      }
    }
    const combined = Buffer.concat(buffers);
    return new NextResponse(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": combined.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("Narrate API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "narrate_failed" },
      { status: 500 }
    );
  }
}
