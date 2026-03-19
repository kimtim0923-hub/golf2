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

  return { ...base, slides };
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
const userNotesEl = document.getElementById('userNotes');

btnTopic.addEventListener('click', () => {
  currentTopic = pickRandom(TOPICS);
  currentScript = null;
  btnApprove.disabled = false;
  btnCopy.disabled = true;
  btnExport.disabled = true;
  output.textContent = '아직 대본이 없습니다.';
  topicBox.innerHTML = renderTopic(currentTopic);
});

btnApprove.addEventListener('click', () => {
  if (!currentTopic) return;
  const userNotes = userNotesEl.value;

  currentScript = buildSlideScript({ topic: currentTopic, userNotes });
  const pretty = JSON.stringify(currentScript, null, 2);
  output.textContent = pretty;

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

btnCopy.addEventListener('click', async () => {
  if (!currentScript) return;
  const text = output.textContent;
  await navigator.clipboard.writeText(text);
  btnCopy.textContent = '복사됨';
  setTimeout(() => (btnCopy.textContent = '대본 복사'), 900);
});

btnExport.addEventListener('click', () => {
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
