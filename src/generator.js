import { MLR_2026, PREFERRED_LIES } from './mlr2026.js';

export function buildManualTopic(ideaText) {
  const clean = (ideaText || '').trim();
  return {
    id: `t_manual_${Date.now()}`,
    type: 'info',
    category: 'Manual idea',
    title: clean ? `내 아이디어: ${clean}` : '내 아이디어',
    hook: clean || '내가 겪은 상황을 룰 기준으로 정리합니다.',
    target: '라운드 10회 이상 백돌이',
    rules: [{ ref: 'Rule (TBD)', url: 'https://www.randa.org/en/rog/the-rules-of-golf' }],
    notes: '사용자 아이디어 기반. 업로드 전 해당 상황의 정확한 룰을 최종 확인하세요.'
  };
}

function pickNByText(textAll, fallback = 5) {
  const m = textAll.match(/(\d+)\s*가지/);
  const nRaw = m ? parseInt(m[1], 10) : fallback;
  return Math.max(3, Math.min(6, Number.isFinite(nRaw) ? nRaw : fallback));
}

function padToLength(text, { minChars, maxChars }) {
  let t = String(text || '').trim();
  const fillers = [
    '저장해두면 라운드에서 그대로 따라할 수 있어요.',
    '이거 한 번만 제대로 알면, 억울한 타수 손해가 확 줄어듭니다.',
    '댓글로 다음 상황 남겨주시면 다음 편에서 바로 다뤄드릴게요.',
  ];
  let i = 0;
  while (t.length < minChars && i < 120) {
    t += (t.endsWith('.') || t.endsWith('요.') ? ' ' : ' ') + fillers[i % fillers.length];
    i++;
  }
  if (t.length > maxChars) t = t.slice(0, maxChars);
  return t;
}

function ensureNoQuotesAtEdges(text) {
  // “쌍따옴표로 감싼 시작/끝”만 방지 (문장 내부 따옴표는 사용자가 원할 수 있어 그대로 둠)
  let t = String(text || '').trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1).trim();
  return t;
}

function boldImportant(text) {
  // 아주 보수적으로 숫자+벌타, 무벌타, 2클럽/3분/스코어카드 등을 굵게 처리
  return String(text)
    .replaceAll(/\b(\d+\s*벌타)\b/g, '**$1**')
    .replaceAll(/\b(무벌타)\b/g, '**$1**')
    .replaceAll(/\b(\d+\s*클럽)\b/g, '**$1**')
    .replaceAll(/\b(3\s*분|3분)\b/g, '**$1**')
    .replaceAll(/\b(스코어카드\s*길이|스코어카드)\b/g, '**$1**');
}

function detectType(textAll) {
  const isTypeC = /로컬\s*룰|대회\s*룰|레프리|MLR|위원회|특수\s*상황/i.test(textAll);
  if (isTypeC) return 'C';

  const isTypeB = /(\d+\s*가지)|총\s*정리|전체\s*정리|\b정리\b|모음|핵심\s*만|리스트|TOP\s*\d+|자주\s*틀리|꼭\s*알아야\s*할|라운딩\s*전\s*꼭/i.test(textAll);
  if (isTypeB) return 'B';

  return 'A';
}

export function makeNarration({ topic, userNotes }) {
  const minChars = 900;
  const maxChars = 1200;

  const notes = String(userNotes || '').trim();
  const textAll = `${topic.title} ${topic.hook} ${notes}`;

  const type = detectType(textAll);
  const cta = '레슨 받고 싶으세요?\nKPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요.';

  const is2026Summary = /2026.*(총\s*정리|전체\s*정리|리스트)|개정/i.test(textAll);
  const pgaVariant = /PGA|프리퍼드\s*라이|preferred\s*lies/i.test(textAll);

  const paragraphGap = '\n\n';

  const typeA = () => {
    const hook = `라운드에서 ${topic.hook}… 그 순간, 진짜 창피하고 억울하죠?`;
    const misconception = '보통은 이렇게 생각하시잖아요. 관행대로 하면 된다, 그냥 치면 된다.';
    const tension = '그런데 여기서 문제는, 나중에 확인되면 벌타가 붙는 상황이 생긴다는 겁니다. 벌타일까요? 아닐까요?';
    const decision = `결론부터 말하면, 이건 규정상 정해진 절차대로 처리해야 합니다.${is2026Summary ? ' 2026년 변경이 있는 주제라면 그 기준을 우선 적용합니다.' : ''}`;
    const standard = '핵심은 눈으로 재는 기준이에요. 무릎 높이, 클럽 길이처럼 측정 기준을 잡고 그 안에서 처리하면 분쟁이 사라집니다.';
    const summary = '한 줄 정리. 관행 말고, 기준점과 절차로 끝낸다.';

    return [hook, misconception, tension, decision, standard, summary, cta].join(paragraphGap);
  };

  const typeB = () => {
    const n = pickNByText(textAll, 5);
    const open = `이거 모르면 오늘 라운딩에서 바로 손해 봅니다. ${n}가지, 지금 1분에 정리할게요.`;

    const items = [
      { name: '드롭', situation: '구제 받는다고 드롭했는데 높이가 애매한 순간', rule: '무릎 높이에서 툭 떨어뜨리고 구제구역 안에 멈추게.', tip: '어깨 높이 습관 나오면 스코어가 꼬입니다.' },
      { name: '잠정구', situation: '티샷이 애매해서 한 개 더 치고 싶은 순간', rule: '앞으로 가기 전에 잠정구라고 말하고 치기.', tip: '선언이 없으면 절차가 뒤틀릴 수 있어요.' },
      { name: '페널티구역', situation: '물 들어갔을 때 옆으로 그냥 빼고 싶은 순간', rule: '기준점 잡고 옵션대로 진행하기.', tip: '감으로 드롭하면 분쟁이 생깁니다.' },
      { name: '그린', situation: '공을 잠깐 닦으려고 집어드는 순간', rule: '표시하고 들고, 원래 자리에 정확히.', tip: '대충이 제일 위험합니다.' },
      { name: '칠 수 없을 때', situation: '덤불에서 억지로 치고 싶은 순간', rule: '무리하기 전에 선택지를 쓰는 게 안전.', tip: '유불리보다 기준점이 핵심입니다.' },
      { name: '시간', situation: '공 찾느라 계속 헤매는 순간', rule: '정해진 시간 안에 찾고, 아니면 다음 절차로.', tip: '진행이 느려지면 멘탈도 같이 무너집니다.' },
    ].slice(0, n);

    const connectors = ['첫 번째는', '두 번째는', '세 번째는', '네 번째는', '다섯 번째는', '여섯 번째는'];

    const body = items
      .map((it, i) => `${connectors[i]} ${it.situation}이에요. 여기서 문제는, ${it.rule} 실전에서는 ${it.tip}`)
      .join(paragraphGap);

    const summary = `이 ${n}가지만 알면 오늘 라운딩 준비 끝입니다.`;

    // CTA 딱 1번, 마지막
    return [open, body, summary, cta].join(paragraphGap);
  };

  const typeC = () => {
    const n = pickNByText(textAll, 6);
    const open = '골프장 안내판에 적혀 있는 규칙, 솔직히 잘 안 읽게 되죠. 그런데 그게 로컬룰이고, 대회에서는 위원회가 선택해서 적용하는 옵션들도 있습니다.';
    const background = '핵심은 이거예요. 기본 규칙 위에, 코스나 대회가 “선택”해서 추가로 쓰는 규칙이 있다는 것. 그래서 같은 상황이어도 골프장마다 처리 방식이 달라 보일 수 있어요.';

    const useItems = (is2026Summary ? (pgaVariant
      ? [MLR_2026[0], MLR_2026[1], MLR_2026[2], MLR_2026[3], MLR_2026[5], PREFERRED_LIES]
      : MLR_2026)
      : MLR_2026);

    const items = useItems.slice(0, n);
    const connectors = ['첫 번째는', '두 번째는', '세 번째는', '네 번째는', '다섯 번째는', '여섯 번째는'];

    const body = items
      .map((it, i) => `${connectors[i]} ${it.name}입니다. ${it.desc} 실전 팁은 ${it.tip}`)
      .join(paragraphGap);

    const summary = `한 줄 정리. 로컬룰은 “위원회가 채택한 것만” 적용되니까, 라운딩 전 안내판 확인이 핵심입니다.`;

    // CTA 딱 1번, 마지막
    return [open, background, body, summary, cta].join(paragraphGap);
  };

  let draft = type === 'C' ? typeC() : type === 'B' ? typeB() : typeA();
  draft = ensureNoQuotesAtEdges(draft);
  draft = boldImportant(draft);

  // “나레이션 전용” 강제: 아주 기본적인 번호 패턴 제거(예: "1.")
  draft = draft.replaceAll(/^\s*\d+[\.|\)]\s*/gm, '');

  // CTA 반복 방지: 혹시라도 중간에 섞이면 마지막 1회만 남김
  const ctaLines = cta.split('\n');
  const ctaText = ctaLines.join('\n');
  const occurrences = draft.split(ctaText).length - 1;
  if (occurrences > 1) {
    draft = draft.replaceAll(ctaText, '');
    draft = draft.trim() + paragraphGap + ctaText;
  }

  return padToLength(draft, { minChars, maxChars });
}

export function buildSlideScript({ topic, userNotes }) {
  // 슬라이드 JSON 생성은 유지(요청 2번). 나레이션 박스는 원고만 출력.
  const fullNarrationDraft = makeNarration({ topic, userNotes });

  const sourceLines = (topic.rules || []).map(r => `${r.ref} (${r.url})`).join(', ');

  const base = {
    videoTitle: topic.title,
    format: '슬라이드형(10초/장) · 총 12장 · 총 120초 내',
    voice: '한국어 내레이션',
    audience: '라운드 10회 이상 백돌이',
    compliance: {
      policy: 'Rules of Golf + 2026 MLR 업데이트 요약 기반(룰 번호는 내레이션에서 언급 안 함)',
      sources: topic.rules,
      userNotes: (userNotes || '').trim(),
    },
  };

  const slides = [];
  slides.push({
    slideNo: 1,
    durationSec: 10,
    visual: '타이틀 카드(큰 글씨) + 심플 아이콘(깃발/볼/규칙서).',
    onScreenText: `오늘의 주제: ${topic.title}`,
    narration: '오늘은 골프 규칙을 1분 원고로 정리합니다.'
  });

  slides.push({
    slideNo: 2,
    durationSec: 10,
    visual: '상황 카드(만화 말풍선/미니 시나리오).',
    onScreenText: '상황: 라운드에서 실제로 자주 생기는 순간',
    narration: topic.hook
  });

  slides.push({
    slideNo: 3,
    durationSec: 10,
    visual: '원고 안내 카드(문장 몇 개를 크게).',
    onScreenText: '원고는 아래 “1분 내레이션” 박스에서 확인',
    narration: '아래 박스에 1분 원고가 생성됩니다.'
  });

  slides.push({
    slideNo: 4,
    durationSec: 10,
    visual: '룰/출처 카드(텍스트로만).',
    onScreenText: `출처: ${topic.rules.map(r => r.ref).join(' / ')}`,
    narration: '출처는 마지막 카드에 텍스트로 남겨둡니다.'
  });

  for (let i = 5; i <= 11; i++) {
    slides.push({
      slideNo: i,
      durationSec: 10,
      visual: '보조 이미지(아이콘/도식/텍스트).',
      onScreenText: '핵심 문장 1~2줄',
      narration: '원고를 10초 단위로 슬라이드에 배치해 사용하세요.'
    });
  }

  slides.push({
    slideNo: 12,
    durationSec: 10,
    visual: '출처 카드(USGA, The R&A 로고는 사용하지 말고 텍스트로만 표기).',
    onScreenText: 'Source (공식): Rules of Golf',
    narration: '공식 링크는 JSON sources를 확인하세요.',
    sources: sourceLines,
  });

  return { ...base, slides, fullNarrationDraft, fullNarrationCharCount: fullNarrationDraft.length };
}
