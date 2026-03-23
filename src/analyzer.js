export async function analyzeComments(rawText) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY;

  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: `
너는 골프 유튜브 댓글을 분석해서 골린이 타겟 쇼츠 소재를 뽑는 전문가다.

댓글에서 아래 감정/상황을 찾아낸다:
- 억울했던 상황 (예: 말뚝 살짝 넘었는데 OB)
- 창피했던 상황 (예: 룰 몰라서 동반자한테 지적당함)
- 동반자와 논쟁한 상황
- 몰랐던 사실 (예: 로컬룰이 있는 줄 몰랐음)

출력 규칙:
- JSON 배열만 출력. 다른 텍스트 절대 금지. 마크다운 코드블록도 금지.
- 소재 정확히 5개
- 각 소재 형식:
{
  "id": "t_generated_1",
  "type": "info",
  "category": "Rule XX",
  "title": "골린이가 클릭할 제목 (의문형 or 상황형)",
  "hook": "골린이가 겪었을 법한 창피/억울 상황 한 줄",
  "target": "어떤 골린이를 위한 소재인지",
  "emotion": "억울 | 창피 | 논쟁 | 몰랐던사실",
  "rules": [{"ref": "Rule XX", "url": "https://www.randa.org/en/rog/the-rules-of-golf/rule-XX"}],
  "notes": "제작 시 주의사항"
}
      `.trim(),
      messages: [{
        role: "user",
        content: `아래 유튜브 댓글 데이터에서 골프룰 쇼츠 소재 5개를 뽑아줘:\n\n${rawText}`
      }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API 오류 (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '[]';

  try {
    return JSON.parse(text);
  } catch {
    console.error('analyzeComments parse error:', text);
    return [];
  }
}
