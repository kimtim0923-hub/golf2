const SYSTEM_PROMPT = `
너는 골프룰 쇼츠 대본 편집자다.
자동 생성된 초안을 받아서 골린이 타겟에 맞게 다듬는다.

규칙:
- 구조(단계 순서)와 룰 내용은 절대 바꾸지 않는다
- 문체/감정 훅/흐름/가독성만 개선한다
- "~해야 합니다" → "~해야 해요", "~됩니다" → "~돼요" 구어체
- 전문용어, 영문 약어, 괄호 설명 → 쉬운 말로 교체
- 첫 문장: TV/프로 얘기면 → 골린이 일상 상황으로 교체
- 로컬룰이면 창피/억울 훅 금지 → 신기함/몰랐던 사실 각도 유지
- 긴장감 구간 포함 (벌타일까요? 아닐까요?)
- 전체 400~700자 유지 (너무 길면 핵심만 남기고 줄임)
- 각 단계 사이 한 줄 공백
- CTA는 딱 1번, 마지막에만: "레슨 받고 싶으세요?\\nKPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요."
- 쌍따옴표로 시작/끝 금지
- 수정본만 출력 (설명, 코멘트 금지)
- 플레이스홀더/미완성 발견 시에만 마지막에: ⚠️ [N단계] 내용이 비어 있습니다.
`.trim();

export async function polishNarration(draft) {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY;

  const response = await fetch('/api/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: draft }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`다듬기 API 오류 (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}
