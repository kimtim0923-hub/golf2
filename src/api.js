export async function generateRuleContent({ topic, type }) {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY;

  const systemPrompt = `
너는 골프룰 전문가다. 2026 개정룰 기준으로 정확한 판정을 골린이 눈높이 구어체로 설명한다.

규칙:
- 전문용어, 영문 약어, 괄호 설명 금지
- "됩니다" → "돼요", "합니다" → "해요" 구어체
- 따옴표로 시작/끝 금지
- 나레이션 텍스트만 출력 (번호, 표, 제목 금지)
- 벌타/숫자/핵심 기준 **Bold** 표시
- 3~5줄 이내로 간결하게
  `.trim();

  const userPrompt = type === 'A'
    ? `주제: ${topic.title}\n훅: ${topic.hook}\n룰 번호: ${topic.rules[0]?.ref}\n\n이 상황의 정확한 판정과 실전 기준을 골린이 눈높이로 설명해줘.`
    : `주제: ${topic.title}\n\n이 주제로 골린이가 알아야 할 핵심 룰 항목 ${topic.n || 5}가지를 각각 3줄 이내로 설명해줘.`;

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
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API 오류 (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}
