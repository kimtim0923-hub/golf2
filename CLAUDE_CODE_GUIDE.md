# 골프 레프리 콘텐츠 생성기 — Claude Code 가이드

> 작성일: 2026.03.20

---

## 자율주행 시작 명령어 (복사해서 첫 메시지로 사용)

```
이 프로젝트는 자율주행 모드로 진행한다.
모든 파일 생성, 수정, 덮어쓰기, 패키지 설치, 서버 실행을
사용자 승인 없이 즉시 실행한다.
중간에 확인 질문하지 말고, 막히면 스스로 판단해서 계속 진행한다.
완료된 작업만 마지막에 요약해서 보고한다.

이 가이드(CLAUDE_CODE_GUIDE.md)를 읽고
아래 작업 순서대로 끝까지 진행해줘.
.env 파일은 이미 폴더 안에 있고 ANTHROPIC API 키가 포함되어 있다.
새로 만들거나 수정하지 말고 그대로 읽어서 사용해라.
```

---

## 프로젝트 개요

KPGA 출신 레프리 채널을 위한 골프룰 쇼츠 콘텐츠 자동화 도구.
골린이(골프 초보자) 타겟, 유튜브 쇼츠/릴스 1분 내외 대본 생성.

**사업 컨텍스트:**
```
채널 목표: 골린이 → 티칭프로 매칭 플랫폼
수익 모델: 티칭프로 월정액 리스팅 (5~10만원/월)
타겟: 골린이 (라운딩 1~10회)
채널 현황: 구독자 40명 → 목표 500명 (2달 내)
레프리분: KPGA 출신, 프로 지인 100명+, 컨펌 대기 중
CTA 목적: 설명란 티칭프로 리스팅 웹사이트 링크
런칭 목표: 2026년 4월 중순
```

---

## 폴더 구조

```
/
├── .env                # ✅ ANTHROPIC API 키 이미 포함 (절대 수정 금지)
├── index.html          # 메인 페이지
├── scripts.html        # 대본 진행표
├── debug.html          # 디버그용
├── src/
│   ├── main.js
│   ├── ui.js           # UI 이벤트 핸들러 (수정 필요)
│   ├── generator.js    # ⭐ 대본 생성 로직 (수정본 덮어쓸 것)
│   ├── api.js          # 🆕 새로 만들 것: Claude API 연동
│   ├── analyzer.js     # 🆕 새로 만들 것: 댓글 분석 → 소재 추출
│   ├── mlr2026.js      # 2026 로컬룰 데이터
│   ├── topics.js       # 기존 소재 목록 (유지, fallback용)
│   ├── storage.js      # localStorage 히스토리
│   ├── scriptsPage.js  # 진행표 페이지 로직
│   └── dom.js          # DOM 유틸
```

---

## API 키

```javascript
// .env 안에 이미 있음 — 건드리지 말 것
// VITE_ANTHROPIC_API_KEY=sk-ant-...

// 코드에서 읽는 방법
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
```

> ⚠️ 시작 전 `.gitignore`에 `.env` 포함 여부 확인. 없으면 즉시 추가.

---

## 작업 순서

### 1단계: 기본 세팅
```
1. .gitignore에 .env 포함 여부 확인 → 없으면 추가
2. npm install → npm run dev
3. 전달된 generator.js → src/generator.js 덮어쓰기
```

---

### 2단계: src/api.js 새로 생성

```javascript
// src/api.js
export async function generateRuleContent({ topic, type }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

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

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  const data = await response.json();
  return data.content?.[0]?.text || '';
}
```

---

### 3단계: src/analyzer.js 새로 생성

```javascript
// src/analyzer.js
export async function analyzeComments(rawText) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
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

  const data = await response.json();
  const text = data.content?.[0]?.text || '[]';

  try {
    return JSON.parse(text);
  } catch {
    console.error('analyzeComments parse error:', text);
    return [];
  }
}
```

---

### 4단계: index.html 수정

기존 "내 아이디어로 생성" 섹션 바로 위에 아래 블록 추가:

```html
<div style="margin-top:12px">
  <div class="topicTitle">댓글 데이터로 소재 추출</div>
  <div class="meta small">유튜브 영상 댓글을 복붙하면 AI가 소재 5개를 자동 추출합니다.</div>
  <textarea id="commentData" placeholder="유튜브 댓글 전체 복붙..."></textarea>
  <div class="row" style="margin-top:10px">
    <button id="btnAnalyze" class="primary">댓글 분석 → 소재 5개 추출</button>
  </div>
</div>
```

---

### 5단계: src/ui.js 수정

**5-1. 상단 import에 추가:**
```javascript
import { analyzeComments } from './analyzer.js';
```

**5-2. initUI 함수 안 기존 핸들러들 옆에 추가:**
```javascript
const btnAnalyze = document.getElementById('btnAnalyze');
const commentDataEl = document.getElementById('commentData');

safeOn(btnAnalyze, 'click', async () => {
  const raw = commentDataEl?.value || '';
  if (!raw.trim()) {
    alert('댓글 데이터를 붙여넣어 주세요.');
    return;
  }
  btnAnalyze.disabled = true;
  btnAnalyze.textContent = '분석 중...';
  try {
    const topics = await analyzeComments(raw);
    if (!topics.length) {
      alert('소재 추출 실패. 댓글 데이터를 확인해주세요.');
      return;
    }
    renderTopicChoices(topics);
  } catch (err) {
    console.error(err);
    alert('오류가 발생했습니다.');
  } finally {
    btnAnalyze.disabled = false;
    btnAnalyze.textContent = '댓글 분석 → 소재 5개 추출';
  }
});
```

**5-3. renderTopic 함수 아래에 추가:**
```javascript
function renderTopicChoices(topics) {
  topicBox.innerHTML = `
    <div class="topicTitle">추출된 소재 5개 — 하나를 선택하세요</div>
    ${topics.map((t, i) => `
      <div style="margin:8px 0;padding:12px;background:#0a1020;border:1px solid rgba(255,255,255,.08);border-radius:10px;cursor:pointer"
           onclick="window._selectTopic(${i})">
        <div style="font-weight:700;font-size:14px">${escapeHtml(t.title)}</div>
        <div class="meta" style="margin-top:4px">${escapeHtml(t.hook)}</div>
        <div style="margin-top:6px">
          <span class="pill">${escapeHtml(t.emotion || 'info')}</span>
          <span class="pill">${escapeHtml(t.category)}</span>
        </div>
      </div>
    `).join('')}
  `;

  window._analyzedTopics = topics;
  window._selectTopic = (i) => {
    currentTopic = window._analyzedTopics[i];
    currentScript = null;
    btnApprove.disabled = false;
    topicBox.innerHTML = renderTopic(currentTopic);
  };
}
```

**5-4. btnApprove 핸들러를 async로 교체:**
```javascript
safeOn(btnApprove, 'click', async () => {
  if (!currentTopic) return;
  const userNotes = userNotesEl?.value || '';
  btnApprove.disabled = true;
  btnApprove.textContent = '생성 중...';
  try {
    currentScript = await buildSlideScript({ topic: currentTopic, userNotes });
    const pretty = JSON.stringify(currentScript, null, 2);
    output.textContent = pretty;
    if (narrationEl) narrationEl.textContent = currentScript.fullNarrationDraft || '원고 생성 실패';
    btnCopy.disabled = false;
    btnExport.disabled = false;
    const history = loadHistory();
    history.unshift({
      id: `${currentTopic.id}_${Date.now()}`,
      title: currentTopic.title,
      time: new Date().toLocaleString('ko-KR'),
      output: output.textContent,
    });
    saveHistory(history);
    renderHistory();
  } catch (err) {
    console.error(err);
    output.textContent = `오류: ${err}`;
  } finally {
    btnApprove.disabled = false;
    btnApprove.textContent = '승인(대본 생성)';
  }
});
```

---

### 6단계: src/generator.js async 전환

```javascript
// 상단에 import 추가
import { generateRuleContent } from './api.js';

// makeNarration → async function으로 변경
export async function makeNarration({ topic, userNotes }) { ... }

// typeA 판정 ⚠️ 플레이스홀더 부분을 아래로 교체
const ruleContent = await generateRuleContent({ topic, type: 'A' });

// typeB 항목 ⚠️ 플레이스홀더 부분을 아래로 교체
const ruleContent = await generateRuleContent({ topic, type: 'B' });

// buildSlideScript도 async로 변경
export async function buildSlideScript({ topic, userNotes }) { ... }
```

---

### 7단계: 테스트

```
1. 댓글 데이터 붙여넣기 → 소재 5개 추출 확인
2. 소재 선택 → 대본 생성 확인
3. 유형 A/B/C 각각 테스트
```

---

### 8단계: Gemini 썸네일 연동 (여유 있을 때)

```javascript
// .env에 추가
VITE_GEMINI_API_KEY=...

// Nano Banana (gemini-2.5-flash-image) 사용
// 무료 티어: 하루 500개
```

---

## 대본 유형별 구조

| 유형 | 트리거 | 훅 방향 |
|------|--------|--------|
| A | 단일 룰 주제 | 창피/억울 상황 |
| B | N가지, 총정리, 리스트 | N가지 모르면 손해 |
| C | 로컬룰, 대회룰, MLR | 신기함/몰랐던 사실 |

**CTA 고정 문구 (대본 마지막 딱 1번만):**
```
레슨 받고 싶으세요?
KPGA 레프리가 검증한 티칭프로, 설명란 링크에서 확인하세요.
```

---

## 파일 수정 주의사항

| 파일 | 주의사항 |
|------|---------|
| `.env` | 절대 수정 금지. gitignore 확인 필수 |
| `generator.js` | CTA 중복 방지 로직 건드리지 말 것 |
| `mlr2026.js` | R&A 원문 확인 후 수정 |
| `topics.js` | 유지 (fallback용) |
| `scriptsPage.js` | localStorage 키 변경 시 기존 데이터 초기화 |

---

*작성: Claude.ai 대화 기반 | 2026.03.20*
