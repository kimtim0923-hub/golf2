import { MLR_2026, PREFERRED_LIES } from './mlr2026.js';
import { generateRuleContent } from './api.js';

export function buildManualTopic(ideaText) {
  const clean = (ideaText || '').trim();
  return {
    id: `t_manual_${Date.now()}`,
    type: 'info',
    category: 'Manual idea',
    title: clean ? clean : '내 아이디어',
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

function ensureNoQuotesAtEdges(text) {
  let t = String(text || '').trim();
  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1).trim();
  return t;
}

function boldImportant(text) {
  return String(text)
    .replace(/(\d+\s*벌타)/g, '**$1**')
    .replace(/(무벌타)/g, '**$1**')
    .replace(/(\d+\s*클럽(?:\s*길이)?)/g, '**$1**')
    .replace(/(3\s*분|3분)/g, '**$1**')
    .replace(/(스코어카드\s*길이|스코어카드)/g, '**$1**')
    .replace(/(무릎\s*높이)/g, '**$1**');
}

function detectType(textAll) {
  if (/로컬\s*룰|대회\s*룰|레프리|MLR|위원회|모델\s*로컬/i.test(textAll)) return 'C';
  if (/(\d+\s*가지)|총\s*정리|전체\s*정리|모음|리스트|TOP\s*\d+|자주\s*틀리|꼭\s*알아야|라운딩\s*전\s*꼭/i.test(textAll)) return 'B';
  return 'A';
}

function extractSituation(topic) {
  const title = topic.title || '';
  const hook = topic.hook || '';
  if (hook && hook.length > 5) return hook;
  const q = title.split('?')[0];
  if (q && q.length > 4) return q.trim();
  return title;
}

const paragraphGap = '\n\n';

// ─── 유형 A: 단일 룰 ───────────────────────────────────────────
async function typeA(topic, userNotes) {
  const situation = extractSituation(topic);
  const title = topic.title || '';

  const hook = `라운드에서 ${situation} 경험해본 적 있으시죠?\n그 순간 어떻게 해야 할지 몰라서 당황했던 분들, 생각보다 많아요.`;

  const misconception = `보통은 이렇게 생각하시잖아요.\n"대충 알고 있으니까 괜찮겠지", "동반자 하는 대로 따라 하면 되겠지." 라고요.`;

  const tension = `그런데 여기서 문제가 생깁니다.\n이 상황에서 잘못 처리하면 벌타가 붙을 수 있어요. 벌타일까요? 아닐까요?`;

  // Claude API로 실제 판정 내용 생성
  const ruleContent = await generateRuleContent({ topic, type: 'A' });

  const standard = `실전에서 기억할 건 하나예요.\n감으로 처리하지 말고, 눈으로 확인할 수 있는 기준으로 처리하세요.\n무릎 높이, 클럽 길이처럼 명확한 기준이 있으면 분쟁이 사라집니다.`;

  const summary = `한 줄 정리.\n${title.length > 20 ? '기준점과 절차' : title}로 끝낸다.`;

  const cta = `레슨 받고 싶으세요?\nKPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요.`;

  return [hook, misconception, tension, ruleContent, standard, summary, cta].join(paragraphGap);
}

// ─── 유형 B: 리스트형 (일반 룰) ───────────────────────────────
async function typeB(topic, userNotes, textAll) {
  const n = pickNByText(textAll, 5);
  const title = topic.title || '골프 룰';

  const open = `이거 모르면 오늘 라운딩에서 바로 손해 봅니다.\n${title} ${n}가지, 지금 1분에 정리할게요.`;

  // Claude API로 실제 항목 내용 생성
  const ruleContent = await generateRuleContent({ topic: { ...topic, n }, type: 'B' });

  const summary = `이 ${n}가지만 알면 오늘 라운딩 준비 끝입니다.`;

  const cta = `레슨 받고 싶으세요?\nKPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요.`;

  return [open, ruleContent, summary, cta].join(paragraphGap);
}

// ─── 유형 C: 리스트형 (로컬룰/대회룰) ────────────────────────
function typeC(topic, userNotes, textAll) {
  const n = pickNByText(textAll, 6);
  const pgaVariant = /PGA|프리퍼드\s*라이|preferred\s*lies/i.test(textAll);

  const open = `골프장 안내판에 적혀 있는 규칙, 솔직히 잘 안 읽게 되죠?\n그런데 그게 로컬룰이고, 2026년에 6가지가 업데이트됐습니다.`;

  const background = `핵심은 이거예요.\n기본 룰 위에 골프장이나 대회가 선택해서 추가로 쓰는 규칙이 있어요.\n그래서 같은 상황인데 골프장마다 처리가 달라 보일 수 있습니다.`;

  const useItems = pgaVariant
    ? [MLR_2026[0], MLR_2026[1], MLR_2026[2], MLR_2026[3], MLR_2026[5], PREFERRED_LIES]
    : MLR_2026;

  const items = useItems.slice(0, n);
  const connectors = ['첫 번째는', '두 번째는', '세 번째는', '네 번째는', '다섯 번째는', '여섯 번째는'];

  const body = items.map((it, i) => {
    const cleanName = it.name.replace(/\(.*?\)/g, '').trim();

    const cleanDesc = it.desc
      .replace(/되었습니다/g, '됐어요')
      .replace(/있습니다/g, '있어요')
      .replace(/됩니다/g, '돼요')
      .replace(/합니다/g, '해요')
      .replace(/[가-힣]+\([A-Za-z\s]+\)/g, (m) => m.split('(')[0])
      .replace(/\(.*?\)/g, '')
      .trim();

    const cleanTip = it.tip
      .replace(/됩니다/g, '돼요')
      .replace(/있습니다/g, '있어요')
      .replace(/합니다/g, '해요')
      .trim();

    return `${connectors[i]} ${cleanName}입니다.\n${cleanDesc}\n실전 팁: ${cleanTip}`;
  }).join(paragraphGap);

  const summary = `한 줄 정리.\n로컬룰은 위원회가 채택한 것만 적용되니까, 라운딩 전 안내판 확인이 핵심입니다.`;

  const cta = `레슨 받고 싶으세요?\nKPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요.`;

  return [open, background, body, summary, cta].join(paragraphGap);
}

// ─── 메인 나레이션 생성 (async) ───────────────────────────────
export async function makeNarration({ topic, userNotes }) {
  const notes = String(userNotes || '').trim();
  const textAll = `${topic.title} ${topic.hook} ${notes}`;

  const type = detectType(textAll);

  let draft;
  if (type === 'C') {
    draft = typeC(topic, notes, textAll);
  } else if (type === 'B') {
    draft = await typeB(topic, notes, textAll);
  } else {
    draft = await typeA(topic, notes);
  }

  draft = ensureNoQuotesAtEdges(draft);
  draft = boldImportant(draft);

  // 번호 패턴 제거
  draft = draft.replace(/^\s*\d+[.)]\s*/gm, '');

  // CTA 중복 제거: 마지막 1개만 남김
  const cta = `레슨 받고 싶으세요?\nKPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요.`;
  const parts = draft.split(cta);
  if (parts.length > 2) {
    draft = parts.slice(0, -1).join('').trim() + paragraphGap + cta;
  }

  return draft.trim();
}

