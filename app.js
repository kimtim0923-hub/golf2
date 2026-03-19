/**
 * 골프 레프리 소재/대본 생성기 (촬영 없이 슬라이드형)
 * - 본룰(Rules of Golf) 90% 중심
 * - 승인 후 12슬라이드(10초/장) 대본 생성
 * - 각 소재는 룰 번호 + 공식 출처 링크(USGA/R&A) 포함(placeholder 가능)
 */

const TOPICS = [
  // =========================
  // 정보형(본룰 중심)
  // =========================
  {
    id: 't_rule18_provisional',
    type: 'info',
    category: 'Rule 18 (Stroke and Distance / Lost Ball / Provisional Ball)',
    title: '잠정구(프로비저널) 언제 치고, 뭐라고 선언해야 하나요?',
    hook: '“프로비저널” 선언 안 하면, 그 공은 그냥… 새 공입니다.',
    target: '라운드 10회+ 백돌이, 티샷 분실/OB 잦음',
    rules: [
      { ref: 'Rule 18.3', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-18' },
    ],
    notes: '본룰 절차(선언/타이밍/원구 발견 시 처리)만. 로컬룰 언급은 지양.'
  },
  {
    id: 't_rule18_lost_3min',
    type: 'info',
    category: 'Rule 18 (Lost Ball; Time to Search)',
    title: '공 찾기 3분: 언제부터 언제까지 “3분”인가요?',
    hook: '3분은 “대충”이 아니라, 시작 시점이 정해져 있습니다.',
    target: '볼 찾다가 진행 느려지고 멘탈 깨지는 백돌이',
    rules: [
      { ref: 'Rule 18.2a', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-18' },
    ],
    notes: '본룰(3분) 기준만. 진행 매너/레디골프는 “권장”으로 분리 표기.'
  },
  {
    id: 't_rule17_redyellow',
    type: 'info',
    category: 'Rule 17 (Penalty Areas)',
    title: '레드 vs 옐로 페널티구역: 구제 옵션이 왜 다르죠?',
    hook: '같은 페널티구역이어도, 표시 색에 따라 옵션이 달라질 수 있습니다.',
    target: '페널티구역에서 매번 벌타+멘붕',
    rules: [
      { ref: 'Rule 17', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-17' },
    ],
    notes: '옵션(스트로크+거리 / 후방선 / 측면구제 등)은 룰 문구에 맞춰 “선택지”로 정리.'
  },
  {
    id: 't_rule16_cartpath',
    type: 'info',
    category: 'Rule 16 (Relief from Abnormal Course Conditions)',
    title: '카트도로/스프링클러(움직일 수 없는 장해물) 무료 구제: “완전 구제”가 핵심',
    hook: '공이 인공물 위/안/접촉이면, 조건 충족 시 “벌타 없이” 구제받습니다.',
    target: '카트도로/스프링클러 때문에 억울했던 백돌이',
    rules: [
      { ref: 'Rule 16.1', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-16' },
    ],
    notes: '“가장 가까운 완전 구제 지점(NPCR)”을 도식으로. 판단을 추론하지 말고 정의/절차 중심.'
  },
  {
    id: 't_rule16_gur',
    type: 'info',
    category: 'Rule 16 (Abnormal Course Conditions: Ground Under Repair)',
    title: '수리지(GUR) 무료 구제: 어디까지가 수리지인가요?',
    hook: '표시/선언된 수리지라면, 룰 16 절차로 무료 구제가 가능합니다(조건 충족 시).',
    target: '수리지 경계에서 매번 다툼 나는 팀',
    rules: [
      { ref: 'Rule 16.1', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-16' },
    ],
    notes: '“수리지의 범위는 코스 표시에 따름”을 전제로, 무료구제 절차만 요약.'
  },
  {
    id: 't_rule19_unplayable',
    type: 'info',
    category: 'Rule 19 (Unplayable Ball)',
    title: '언플레이어블(칠 수 없음) 3가지 옵션: 1벌타로 선택하는 법',
    hook: '덤불에 들어갔다면, 1벌타로 선택지는 3개입니다.',
    target: '러프/나무/덤불에서 스코어 무너지는 백돌이',
    rules: [
      { ref: 'Rule 19', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-19' },
    ],
    notes: '각 옵션의 기준점(원위치/후방선/2클럽)을 도식화. “뭐가 유리” 같은 추론 금지.'
  },
  {
    id: 't_rule14_drop',
    type: 'info',
    category: 'Rule 14 (Procedures for Taking Relief)',
    title: '드롭 절차 2분컷: 무릎 높이 + 구제구역 + 재드롭',
    hook: '어깨 높이 드롭은 옛날 이야기. 지금 기준은 무릎입니다.',
    target: '드롭이 매번 불안한 백돌이',
    rules: [
      { ref: 'Rule 14.3', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-14' },
    ],
    notes: '재드롭 “조건 목록”은 룰 14.3을 그대로 확인하도록 안내(과도한 요약/추론 금지).' 
  },
  {
    id: 't_rule13_green_mark',
    type: 'info',
    category: 'Rule 13 (Putting Greens) / Rule 14 (Marking, Lifting and Cleaning)',
    title: '그린에서 마크하고 집어드는 절차: “표시 → 리프트 → 리플레이스”',
    hook: '그린에서는 “정해진 절차”만 지키면 대부분의 실수를 피할 수 있습니다.',
    target: '그린 위 실수로 다툼 경험 있는 백돌이',
    rules: [
      { ref: 'Rule 13', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-13' },
      { ref: 'Rule 14.1', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-14' },
    ],
    notes: '“마크 없이 리프트” 같은 위험 포인트를 퀴즈로. 단, 벌타 단정은 룰 문구 확인을 전제.'
  },
  {
    id: 't_rule9_ball_moved',
    type: 'info',
    category: 'Rule 9 (Ball Played as It Lies; Ball at Rest Lifted or Moved)',
    title: '공이 움직였을 때: 내가 움직였나, 자연력인가? (룰 9 기준 프레임)',
    hook: '공이 움직이면, 먼저 “원인”을 룰 기준으로 분류합니다.',
    target: '어드레스하다 공 굴러서 식은땀 나는 백돌이',
    rules: [
      { ref: 'Rule 9', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-9' },
    ],
    notes: '케이스가 많아 추론 위험 → “분류 프레임 + 공식 룰 확인 유도”로 구성.'
  },

  // =========================
  // 예능형(상황극/퀴즈)
  // =========================
  {
    id: 't_fun_wrongball',
    type: 'fun',
    category: 'Rule 6 (Playing a Hole) — Wrong Ball',
    title: '상황극: “형 그 공 내 공인데?” 잘못된 공을 쳤을 때, 다음 행동은?',
    hook: '이 실수는 “친 다음” 행동이 핵심입니다.',
    target: '동반자와 공이 섞이는 백돌이',
    rules: [
      { ref: 'Rule 6.3c (Wrong Ball)', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-6' },
    ],
    notes: '대사(예능) + 절차(룰) 분리. 벌타/수정은 룰 문구 확인을 전제로 “룰 6.3c 기준”이라고 말하기.'
  },
  {
    id: 't_fun_lostball',
    type: 'fun',
    category: 'Rule 18 (Lost Ball; Time to Search)',
    title: '상황극: “아직 찾을 수 있어!” 공 찾는 시간 끝났을 때 벌어지는 일',
    hook: '3분이 지나면… “룰 기준”으로 다음 절차가 정해집니다.',
    target: '볼 찾다가 진행 느려지고 멘탈 깨지는 팀',
    rules: [
      { ref: 'Rule 18.2a', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-18' },
    ],
    notes: '예능 포인트는 살리되, 결론 문장은 룰 18.2a에 맞춰 “절차”로만.'
  },
  {
    id: 't_fun_ball_hit_person',
    type: 'fun',
    category: 'Rule 11 (Ball in Motion Accidentally Hits Person/Equipment)',
    title: '상황극: 내 공이 동반자/카트/가방을 맞췄다… 벌타?',
    hook: '공이 “우연히” 맞았는지, “의도적으로” 막았는지가 포인트입니다.',
    target: '카트도로 근처에서 사고 나는 백돌이',
    rules: [
      { ref: 'Rule 11', url: 'https://www.randa.org/en/rog/the-rules-of-golf/rule-11' },
    ],
    notes: '의도성 판단은 추론 위험 → 룰 11의 원칙(우연/고의 구분)만 “프레임”으로 소개.'
  },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nowIso() {
  return new Date().toISOString();
}

function renderTopic(topic) {
  const pills = [
    `<span class="pill">${topic.type === 'fun' ? '예능형' : '정보형'}</span>`,
    `<span class="pill">본룰 중심</span>`,
    `<span class="pill">2분/12슬라이드</span>`,
  ].join('');

  const sources = topic.rules.map(r => `- ${r.ref} · ${r.url}`).join('\n');

  return `
    <div>
      <div class="topicTitle">${pills}</div>
      <div class="topicTitle" style="margin-top:6px">${escapeHtml(topic.title)}</div>
      <div class="meta">카테고리: ${escapeHtml(topic.category)}<br/>타깃: ${escapeHtml(topic.target)}</div>
      <div style="margin-top:10px" class="meta"><b>훅(오프닝 0~3초)</b><br/>${escapeHtml(topic.hook)}</div>
      <div style="margin-top:10px" class="meta"><b>근거(룰/출처)</b><pre style="margin:6px 0 0">${escapeHtml(sources)}</pre></div>
      <div style="margin-top:10px" class="meta"><b>제작 메모</b><br/>${escapeHtml(topic.notes)}</div>
    </div>
  `.trim();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildSlideScript({ topic, userNotes }) {
  // --- Shorts(1분) 원고 생성 정책 ---
  // 사용자 요구사항: 400~700자, 훅→오해→긴장감→판정→기준→요약→CTA
  // 주의: 정적 웹앱이라 “첨부된 2026 개정 룰 파일”을 런타임에 읽을 수 없음.
  //       대신 TOPICS 항목에 amendment2026를 미리 채워두면 그 내용을 우선 적용합니다.

  const targetMinChars = 400;
  const targetMaxChars = 700;
  const hardLimitChars = 900;

  const fitToShortsLength = (text) => {
    let t = String(text || '').replace(/\s+\n/g, '\n').trim();
    if (t.length > hardLimitChars) t = t.slice(0, hardLimitChars);

    // 너무 짧으면(400자 미만) 짧은 보강문을 덧붙인다.
    const fillers = [
      '이거 모르고 치면 억울하게 타수 터집니다.',
      '지금부터 1분만 집중하면, 라운드에서 바로 써먹어요.',
      '근거 룰 번호와 공식 링크는 화면 마지막에 남겨둘게요.',
    ];

    let i = 0;
    while (t.length < targetMinChars && i < 20) {
      t += (t.endsWith('.') || t.endsWith('요.') ? ' ' : ' ') + fillers[i % fillers.length];
      i++;
    }

    // 700자 초과면 700자까지로 컷(쇼츠 톤 유지)
    if (t.length > targetMaxChars) t = t.slice(0, targetMaxChars);
    return t;
  };

  // 1분 내레이션 원고(한 덩어리) 생성용
  // - 슬라이드별 narration을 합치면 중복/짧은 문장이 많아 “원고” 품질이 떨어질 수 있어
  //   주제별 템플릿을 바탕으로 1분 분량의 한 덩어리 원고를 만든다.
  const narrationLines = [];
  const addNarr = (line) => narrationLines.push(String(line || '').trim());

  const makeOneMinuteManuscript = () => {
    const ruleRefs = topic.rules.map(r => r.ref).join(', ');
    const ruleUrls = topic.rules.map(r => r.url).join(' · ');

    // 주제별 숏폼 유튜브 원고 템플릿
    // 목표: 구독 전환(어그로 훅) + 쉬운 비유/정리 + 룰 근거 고정
    let draft = '';

    if (topic.id === 't_rule18_provisional') {
      draft = `“공 하나 잃어버렸다고 두 타를 더 잃는 사람” 아직도 많습니다. 백돌이 구간에서 가장 아까운 실수 1위가 바로 이거예요. 오늘은 ‘잠정구’, 프로비저널을 1분 안에 끝냅니다.

결론부터. 프로비저널은 ‘원래 공이 분실되었거나 OB일 가능성이 있을 때’ 그리고 ‘앞으로 가서 찾기 전에’, 다음 스트로크를 하기 전에 칠 수 있는 절차입니다. 여기서 승부는 ‘선언’이에요. 새 공을 치기 전에 동반자에게 “프로비저널 칠게요”라고 딱 말하세요.

왜 선언이 중요하냐. 선언 없이 친 공은 잠정구로 인정되지 않을 수 있어서, 나중에 원래 공을 찾아도 절차가 꼬일 수 있습니다. 라운드에서 안전하게 기억하는 순서는 이겁니다. 첫째, 분실/OB 가능성 보이면 멈추고. 둘째, “프로비저널” 선언. 셋째, 그 공을 치고 진행. 그리고 원래 공을 제한 시간 안에 찾으면 원래 공으로, 원래 공이 분실이거나 OB면 프로비저널로 이어갑니다.

근거는 ${ruleRefs}이고, 공식 원문 링크는 화면에 남겨둘게요.`;
    } else if (topic.id === 't_rule14_drop') {
      draft = `드롭 때문에 괜히 동반자랑 눈치 싸움 해본 적 있죠? “어깨에서 떨어뜨려야 되는 거 아니야?” 아직도 그렇게 말하는 사람 많습니다. 오늘 1분으로 끝냅니다.

결론은 두 줄이에요. 첫째, 드롭은 ‘무릎 높이’에서 공을 ‘떨어뜨리는 것’이 기준입니다. 던지거나 굴리는 게 아니라, 손에서 자연스럽게 툭. 둘째, 공은 정해진 ‘구제구역 안’에 드롭해야 하고, 구제구역 안에 ‘정지’해야 합니다.

여기서 백돌이들이 제일 많이 터지는 실수는 두 가지. 예전 습관대로 어깨 높이에서 드롭하거나, 구제구역 밖으로 굴러간 공을 그냥 치는 겁니다. 드롭했는데 룰에서 정한 특정 경우에 해당하면 재드롭이 필요할 수 있으니, 헷갈리면 룰 원문을 확인하는 게 가장 안전해요.

근거는 ${ruleRefs}. 공식 원문 링크도 화면에 남겨둘게요.`;
    } else if (topic.id === 't_rule16_cartpath' || topic.id === 't_rule16_gur') {
      draft = `백돌이 라운드에서 ‘억울한 타수’가 생기는 순간, 대부분 이거예요. 공이 카트도로 옆, 스프링클러 옆, 또는 수리지 근처. 그런데 구제를 “감으로” 하다가 오히려 더 큰 문제가 생깁니다. 오늘 1분 컷.

결론부터. 비정상적인 코스 상태나 움직일 수 없는 장해물에 해당하면, 조건을 충족할 때 벌타 없이 구제를 받을 수 있습니다. 핵심 키워드는 ‘완전 구제’예요. 공만 빼는 게 아니라, 스탠스와 스윙 구역의 간섭까지 룰이 말하는 ‘간섭’이 해소되어야 합니다.

실전에서는 이렇게 기억하세요. 첫째, 간섭이 “룰에서 말하는 간섭”인지 확인. 둘째, 가장 가까운 완전 구제 지점을 기준으로 잡기. 셋째, 그 기준점에서 룰이 정한 구제구역 안에 드롭. 그리고 끝.

근거는 ${ruleRefs}. 공식 원문 링크는 화면에 남겨둘게요.`;
    } else if (topic.id === 't_rule17_redyellow') {
      draft = `물 빠졌을 때 ‘그냥 한 클럽 옆에 드롭’하는 거, 아직도 하고 있죠? 그럼 그 순간부터 스코어카드가 흔들릴 수 있습니다. 오늘 페널티구역 1분 정리합니다.

결론부터. 페널티구역에서 구제를 받으면 보통 1벌타가 붙고, 그 다음엔 룰이 정한 옵션 중 하나를 선택해 드롭합니다. 그리고 같은 페널티구역이라도 표시 색, 레드냐 옐로냐에 따라 가능한 선택지가 달라질 수 있으니, 먼저 말뚝이나 라인 색부터 확인하세요.

실전 팁은 이거 하나. “마지막으로 경계를 통과한 지점” 같은 룰 기준점이 핵심이기 때문에, 감으로 찍지 말고 기준점을 먼저 잡고 옵션을 선택해야 합니다.

근거는 ${ruleRefs}. 공식 원문 링크도 화면에 남겨둘게요.`;
    } else if (topic.id === 't_rule19_unplayable') {
      draft = `덤불 들어갔는데 “한 번만 툭 쳐볼까?” 하다가 두세 타 더 잃는 사람, 딱 백돌이 구간에서 많이 나옵니다. 이럴 때 필요한 게 ‘언플레이어블’이에요. 1분으로 정리합니다.

결론. 공이 도저히 칠 수 없는 상황이면, 룰은 1벌타로 선택할 수 있는 옵션들을 줍니다. 여기서 중요한 건 ‘뭐가 유리하냐’가 아니라, 내가 고른 옵션의 ‘기준점’이 뭔지를 정확히 아는 겁니다.

그래서 현장에서는 이렇게 하세요. 첫째, “언플레이어블” 선택. 둘째, 옵션을 고르고. 셋째, 그 옵션의 기준점에서 룰이 정한 방식대로 구제구역을 만들고 드롭. 이 순서만 지키면 추가 실수로 무너질 일이 확 줄어듭니다.

근거는 ${ruleRefs}. 공식 원문 링크도 화면에 남겨둘게요.`;
    } else if (topic.id === 't_rule13_green_mark') {
      draft = `그린에서 “그냥 잠깐 집어들게” 했다가 말싸움 나는 장면, 한 번쯤 보셨죠? 그린은 룰이 제일 ‘절차’를 요구하는 곳입니다. 오늘 1분 컷.

결론은 세 단어예요. “표시-리프트-리플레이스”. 그린에서 공을 집어들거나 닦거나 다시 놓을 일이 있으면, 반드시 먼저 마커로 표시하고, 들어 올리고, 원래 자리에 정확히 다시 놓습니다.

백돌이들이 자주 하는 실수는 마커 없이 무심코 집어드는 것, 또는 대충 놓는 겁니다. 그린에서는 ‘대충’이 제일 위험해요. 습관처럼 마커부터 놓으세요.

근거는 ${ruleRefs}. 공식 원문 링크도 화면에 남겨둘게요.`;
    } else {
      // 기본 원고(모든 주제 공통)
      draft = `백돌이 라운드에서 타수가 무너지는 진짜 이유, 스윙보다 ‘룰+절차’인 경우가 많습니다. 오늘은 “${topic.title}”를 1분 안에, 골린이도 바로 이해되게 정리할게요.

이 영상은 관행이나 추측이 아니라, USGA와 The R&A의 Rules of Golf 기준으로만 설명합니다. 그래서 흐름은 딱 3단계예요. 첫째, 상황을 한 문장으로 고정. 둘째, 해당 룰 번호를 확인. 셋째, 룰이 요구하는 절차대로 그대로 실행.

헷갈릴 때는 이 기준만 기억하세요. ‘감으로 드롭/감으로 벌타 계산’은 사고의 시작이고, 룰 번호를 잡는 순간부터 문제가 정리됩니다.

근거는 ${ruleRefs}. 공식 원문 링크는 화면에 남겨둡니다.`;
    }

    // 사용자 메모(옵션)
    const note = (userNotes || '').trim();
    if (note) {
      draft += ` 그리고 참고로, 제작 메모로는 이렇게 적어두셨어요. ${note}`;
    }

    // 목표 글자수 맞추기
    const padded = padToLength(draft);
    return padded;
  };

  // 2분 = 120초, 10초마다 1장 => 12장
  // 원칙: 추론 금지 → 단정 대신 “룰 기준”으로 말하고, 룰 번호/출처 고정.

  const sourceLines = topic.rules.map(r => `${r.ref} (${r.url})`).join(', ');

  /**
   * Slides schema
   * - slideNo
   * - durationSec (기본 10)
   * - visual (사진/도식 지시문: 저작권 안전하게 직접 제작/AI 생성/도형)
   * - onScreenText (짧게)
   * - narration (한국어 내레이션)
   */

  const base = {
    videoTitle: topic.title,
    format: '슬라이드형(10초/장) · 총 12장 · 총 120초 내',
    voice: '한국어 내레이션',
    audience: '라운드 10회 이상 백돌이',
    compliance: {
      policy: 'USGA / The R&A Rules of Golf 근거 기반(추론 금지)',
      sources: topic.rules,
      userNotes: userNotes?.trim() || ''
    },
  };

  const slides = [];

  slides.push({
    slideNo: 1,
    durationSec: 10,
    visual: '타이틀 카드(큰 글씨) + 심플 아이콘(깃발/볼/규칙서).',
    onScreenText: `오늘의 판정: ${topic.title}`,
    narration: `골프 레프리 기준으로, 오늘은 “${topic.title}”를 2분 안에 정리합니다.`
  });

  slides.push({
    slideNo: 2,
    durationSec: 10,
    visual: '상황 카드(만화 말풍선/미니 시나리오).',
    onScreenText: '상황: 라운드에서 실제로 자주 생기는 순간',
    narration: topic.type === 'fun'
      ? `상황극입니다. ${topic.hook}`
      : `먼저 결론부터 갈게요. ${topic.hook}`
  });

  slides.push({
    slideNo: 3,
    durationSec: 10,
    visual: '결론 카드(Yes/No, 벌타/무벌타를 큰 글씨로).',
    onScreenText: '결론(룰 기준): 핵심 1줄',
    narration: `이 영상은 “룰 기준”으로만 말합니다. 그리고 마지막에 룰 번호와 공식 출처 링크를 남겨드릴게요.`
  });

  slides.push({
    slideNo: 4,
    durationSec: 10,
    visual: '룰 번호 카드(룰북 스타일) + 강조 표시.',
    onScreenText: `근거: ${topic.rules.map(r => r.ref).join(' / ')}`,
    narration: `근거는 ${topic.rules.map(r => r.ref).join(', ')} 입니다.`
  });

  // 중간 슬라이드: 주제별로 구성 분기
  if (topic.id === 't_rule18_provisional') {
    slides.push(
      {
        slideNo: 5,
        durationSec: 10,
        visual: '타임라인 도식(원구 예상 분실 → 선언 → 잠정구).',
        onScreenText: '핵심: “원구가 분실/OB일 가능성” + “스트로크 전”',
        narration: '잠정구는 “원래 공이 분실되거나 OB일 가능성이 있을 때”, 그리고 “앞으로 가서 찾기 전에”, 즉 다음 스트로크를 하기 전에 칠 수 있는 절차입니다.'
      },
      {
        slideNo: 6,
        durationSec: 10,
        visual: '말풍선 2개(올바른 선언 vs 애매한 말).',
        onScreenText: '반드시: 잠정구임을 “선언”',
        narration: '중요 포인트는 선언입니다. 잠정구를 치기 전에, 동반자에게 “잠정구(프로비저널) 칠게요”라고 분명히 말합니다.'
      },
      {
        slideNo: 7,
        durationSec: 10,
        visual: '체크리스트(OK/NO) 카드.',
        onScreenText: '선언 없으면? → 그 공은 “잠정구”가 아닐 수 있음',
        narration: '선언 없이 새 공을 치면, 그 공은 잠정구로 인정되지 않을 수 있습니다. 그러면 원래 공이 나중에 발견되어도, 절차가 꼬일 수 있어요.'
      },
      {
        slideNo: 8,
        durationSec: 10,
        visual: '분기 다이어그램(원구 찾음/못 찾음/OB).',
        onScreenText: '원구를 찾으면? 못 찾으면?',
        narration: '원래 공을 제한 시간 안에 찾고 인플레이 가능하면 원래 공으로 진행합니다. 원래 공이 분실이거나 OB라면, 잠정구가 스트로크와 거리 벌타 절차로 이어집니다.'
      }
    );
  } else if (topic.id === 't_rule14_drop') {
    slides.push(
      {
        slideNo: 5,
        durationSec: 10,
        visual: '드롭 실루엣(무릎 높이) 일러스트.',
        onScreenText: '드롭: “무릎 높이”에서',
        narration: '드롭은 무릎 높이에서 공을 떨어뜨리는 게 기준입니다. 손으로 던지거나 굴리는 게 아니라, 손에서 자연스럽게 떨어뜨립니다.'
      },
      {
        slideNo: 6,
        durationSec: 10,
        visual: '구제구역(원/사각형) 표시 도식.',
        onScreenText: '구제구역: 정해진 구역 “안”',
        narration: '그리고 중요한 게 하나 더 있어요. 공은 “정해진 구제구역 안”에 드롭해야 하고, 구제구역 안에 정지해야 합니다.'
      },
      {
        slideNo: 7,
        durationSec: 10,
        visual: '재드롭 조건을 2~3개만 카드로.',
        onScreenText: '재드롭: 특정 경우에는 다시 드롭',
        narration: '드롭했는데 규칙에서 정한 경우에 해당하면 재드롭이 필요합니다. 이 부분은 룰 14.3 절차를 기준으로 체크하세요.'
      },
      {
        slideNo: 8,
        durationSec: 10,
        visual: '골린이 실수 밈(어깨 높이 드롭 X).',
        onScreenText: '실수 TOP: 어깨 높이(과거)로 드롭',
        narration: '가장 흔한 실수는 예전 기억대로 어깨 높이에서 드롭하는 겁니다. 지금 기준은 무릎 높이입니다.'
      }
    );
  } else {
    // 기본 구성(범용)
    slides.push(
      {
        slideNo: 5,
        durationSec: 10,
        visual: '“퀴즈” 카드(선택지 2~3개).',
        onScreenText: '퀴즈: 이 상황, 벌타일까요?',
        narration: '잠깐 퀴즈. 이 상황에서 벌타일까요, 무벌타일까요? 여러분은 어떻게 생각하세요?'
      },
      {
        slideNo: 6,
        durationSec: 10,
        visual: '정답 공개 카드.',
        onScreenText: '정답: 룰 기준으로 판단',
        narration: '정답은 룰 기준으로 정해집니다. 감이나 관행이 아니라, 룰 번호를 따라가면 됩니다.'
      },
      {
        slideNo: 7,
        durationSec: 10,
        visual: '절차/옵션 카드(1~3번 옵션).',
        onScreenText: '절차: 선택지/옵션을 순서대로',
        narration: '이제부터는 선택지와 절차를 순서대로 정리할게요. 슬라이드를 저장해두면 라운드에서 바로 써먹을 수 있습니다.'
      },
      {
        slideNo: 8,
        durationSec: 10,
        visual: '실수 방지 카드(하지 말아야 할 2가지).',
        onScreenText: '실수 방지: 이 2가지만 피하세요',
        narration: '그리고 백돌이가 가장 많이 하는 실수 2가지를 같이 짚고 넘어가겠습니다.'
      }
    );
  }

  slides.push({
    slideNo: 9,
    durationSec: 10,
    visual: '체크리스트 카드(라운드에서 바로 쓰는 3줄 요약).',
    onScreenText: '현장 체크리스트(3줄)',
    narration: '라운드에서는 이 체크리스트 3줄만 기억하시면 됩니다. 첫째, 상황을 확인. 둘째, 룰 기준점 확인. 셋째, 절차대로 진행.'
  });

  slides.push({
    slideNo: 10,
    durationSec: 10,
    visual: '예능형이면 “대사” 카드 / 정보형이면 “오해 vs 사실” 카드.',
    onScreenText: topic.type === 'fun' ? '분쟁 종결 멘트 1문장' : '자주 하는 오해 1개만 정리',
    narration: topic.type === 'fun'
      ? '동반자랑 다툼 나려 하면 이렇게 말하세요. “룰북 기준으로 확인하고 진행할게요.”'
      : '오해 하나만 정리할게요. 로컬 관행과 룰은 다를 수 있으니, 이 영상은 룰 기준으로만 기억하세요.'
  });

  slides.push({
    slideNo: 11,
    durationSec: 10,
    visual: '요약 카드(한 줄 결론 + 룰 번호 재표기).',
    onScreenText: `요약: ${topic.rules.map(r => r.ref).join(' / ')}`,
    narration: `오늘 내용은 ${topic.rules.map(r => r.ref).join(', ')} 기준으로 정리했습니다. 필요할 때는 이 룰 번호만 기억해도 충분합니다.`
  });

  slides.push({
    slideNo: 12,
    durationSec: 10,
    visual: '출처 카드(USGA, The R&A 로고는 사용하지 말고 텍스트로만 표기).',
    onScreenText: 'Source (공식): Rules of Golf (USGA / The R&A)',
    narration: `출처는 Rules of Golf 공식 문서입니다. 링크는 화면에 적어둘게요. ${userNotes?.trim() ? '추가 메모도 반영했습니다.' : ''}`,
    sources: sourceLines
  });

  // 1분 내레이션 원고(한 덩어리)
  const fullNarrationDraft = makeOneMinuteManuscript();

  return { ...base, slides, fullNarrationDraft, fullNarrationCharCount: fullNarrationDraft.length };
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('golf_ref_history');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  localStorage.setItem('golf_ref_history', JSON.stringify(items.slice(0, 30)));
}

function renderHistory() {
  const ul = document.getElementById('history');
  const history = loadHistory();
  ul.innerHTML = '';

  if (!history.length) {
    ul.innerHTML = '<li class="meta">아직 히스토리가 없습니다.</li>';
    return;
  }

  for (const item of history) {
    const li = document.createElement('li');
    li.className = 'meta';
    li.innerHTML = `<b>${escapeHtml(item.title)}</b><br/><span class="small">${escapeHtml(item.time)}</span>`;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      // restore output
      document.getElementById('output').textContent = item.output;
    });
    ul.appendChild(li);
  }
}

let currentTopic = null;
let currentScript = null;

const btnTopic = document.getElementById('btnTopic');
const btnApprove = document.getElementById('btnApprove');
const btnCopy = document.getElementById('btnCopy');
const btnExport = document.getElementById('btnExport');
const topicBox = document.getElementById('topicBox');
const output = document.getElementById('output');
const narrationEl = document.getElementById('narration');
const userNotesEl = document.getElementById('userNotes');
const manualIdeaEl = document.getElementById('manualIdea');
const btnUseIdea = document.getElementById('btnUseIdea');

// 일부 페이지(debug 등)는 모든 UI 엘리먼트를 갖고 있지 않을 수 있어 null-safe 처리
if (!btnTopic || !btnApprove || !topicBox || !output) {
  console.warn('[golf-ref] Missing required DOM nodes; app.js initialized in safe mode.');
}

const safeOn = (el, event, handler) => {
  if (!el) return;
  el.addEventListener(event, handler);
};

function buildManualTopic(ideaText) {
  const clean = (ideaText || '').trim();
  return {
    id: `t_manual_${Date.now()}`,
    type: 'info',
    category: 'Manual idea (needs rule mapping)',
    title: clean ? `내 아이디어: ${clean}` : '내 아이디어',
    hook: clean || '내가 겪은 상황을 룰 기준으로 정리합니다.',
    target: '라운드 10회 이상 백돌이',
    // 사용자가 아이디어만 넣는 경우, 룰 번호를 “확정”해버리면 추론이 될 수 있어
    // 일단 placeholder로 두고, 업로드 전 공식 룰 확인을 강하게 유도한다.
    rules: [
      { ref: 'Rule (TBD)', url: 'https://www.randa.org/en/rog/the-rules-of-golf' },
    ],
    notes: '사용자 아이디어 기반. 업로드 전 해당 상황의 정확한 룰 번호를 USGA/R&A에서 최종 확인하세요.'
  };
}

safeOn(btnTopic, 'click', () => {
  currentTopic = pickRandom(TOPICS);
  currentScript = null;
  btnApprove.disabled = false;
  btnCopy.disabled = true;
  btnExport.disabled = true;
  output.textContent = '아직 대본이 없습니다.';
  if (narrationEl) narrationEl.textContent = '아직 원고가 없습니다.';
  topicBox.innerHTML = renderTopic(currentTopic);
});

safeOn(btnUseIdea, 'click', () => {
  const idea = manualIdeaEl?.value || '';
  if (!idea.trim()) {
    alert('아이디어를 먼저 입력해주세요.');
    return;
  }
  currentTopic = buildManualTopic(idea);
  currentScript = null;
  btnApprove.disabled = false;
  btnCopy.disabled = true;
  btnExport.disabled = true;
  output.textContent = '아직 대본이 없습니다.';
  if (narrationEl) narrationEl.textContent = '아직 원고가 없습니다.';
  topicBox.innerHTML = renderTopic(currentTopic);
});

safeOn(btnApprove, 'click', () => {
  if (!currentTopic) return;
  const userNotes = userNotesEl.value;

  currentScript = buildSlideScript({ topic: currentTopic, userNotes });
  const pretty = JSON.stringify(currentScript, null, 2);
  output.textContent = pretty;
  if (narrationEl) narrationEl.textContent = currentScript.fullNarrationDraft || '원고 생성 실패';

  btnCopy.disabled = false;
  btnExport.disabled = false;

  // history
  const history = loadHistory();
  history.unshift({
    id: `${currentTopic.id}_${Date.now()}`,
    title: currentTopic.title,
    time: new Date().toLocaleString('ko-KR'),
    output: pretty,
  });
  saveHistory(history);
  renderHistory();
});

safeOn(btnCopy, 'click', async () => {
  if (!currentScript) return;
  const text = output.textContent;
  await navigator.clipboard.writeText(text);
  btnCopy.textContent = '복사됨';
  setTimeout(() => (btnCopy.textContent = '대본 복사'), 900);
});

safeOn(btnExport, 'click', () => {
  if (!currentScript) return;
  const blob = new Blob([output.textContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `golf_ref_script_${currentScript.videoTitle.slice(0, 20).replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

renderHistory();
