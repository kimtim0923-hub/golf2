import { TOPICS } from './topics.js';
import { escapeHtml, safeOn } from './dom.js';
import { loadHistory, saveHistory } from './storage.js';
import { buildManualTopic, makeNarration } from './generator.js';
import { polishNarration } from './polish.js';
import { analyzeComments } from './analyzer.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderTopic(topic) {
  const pills = [
    `<span class="pill">${topic.type === 'fun' ? '예능형' : '정보형'}</span>`,
    `<span class="pill">본룰 중심</span>`,
    `<span class="pill">2분/12슬라이드</span>`,
  ].join('');

  const sources = (topic.rules || []).map(r => `- ${r.ref} · ${r.url}`).join('\n');

  return `
    <div>
      <div class="topicTitle">${pills}</div>
      <div class="topicTitle" style="margin-top:6px">${escapeHtml(topic.title)}</div>
      <div class="meta">카테고리: ${escapeHtml(topic.category)}<br/>타깃: ${escapeHtml(topic.target)}</div>
      <div style="margin-top:10px" class="meta"><b>훅(오프닝 0~3초)</b><br/>${escapeHtml(topic.hook)}</div>
      <div style="margin-top:10px" class="meta"><b>근거(룰/출처)</b><pre style="margin:6px 0 0">${escapeHtml(sources)}</pre></div>
      <div style="margin-top:10px" class="meta"><b>제작 메모</b><br/>${escapeHtml(topic.notes || '')}</div>
    </div>
  `.trim();
}

function renderHistory(narrationEl) {
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
      if (narrationEl) narrationEl.textContent = item.output;
    });
    ul.appendChild(li);
  }
}

export function initUI() {
  let currentTopic = null;

  const btnTopic = document.getElementById('btnTopic');
  const btnApprove = document.getElementById('btnApprove');
  const btnCopy = document.getElementById('btnCopy');
  const btnPolish = document.getElementById('btnPolish');
  const topicBox = document.getElementById('topicBox');
  const narrationEl = document.getElementById('narration');
  const userNotesEl = document.getElementById('userNotes');
  const manualIdeaEl = document.getElementById('manualIdea');
  const btnUseIdea = document.getElementById('btnUseIdea');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const commentDataEl = document.getElementById('commentData');

  if (!btnTopic || !btnApprove || !topicBox) {
    console.warn('[golf-ref] Missing required DOM nodes; UI init skipped.');
    return;
  }

  safeOn(btnTopic, 'click', () => {
    currentTopic = pickRandom(TOPICS);
    btnApprove.disabled = false;
    btnCopy.disabled = true;
    if (btnPolish) btnPolish.disabled = true;
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
    btnApprove.disabled = false;
    btnCopy.disabled = true;
    if (btnPolish) btnPolish.disabled = true;
    if (narrationEl) narrationEl.textContent = '아직 원고가 없습니다.';
    topicBox.innerHTML = renderTopic(currentTopic);
  });

  safeOn(btnApprove, 'click', async () => {
    if (!currentTopic) return;
    const userNotes = userNotesEl?.value || '';

    btnApprove.disabled = true;
    btnApprove.textContent = '생성 중...';
    if (narrationEl) narrationEl.textContent = '원고 생성 중...';

    let narration;
    try {
      narration = await makeNarration({ topic: currentTopic, userNotes });
      if (narrationEl) narrationEl.textContent = narration;
    } catch (err) {
      console.error('[golf-ref] script generation failed', err);
      if (narrationEl) narrationEl.textContent = `원고 생성 오류: ${String(err.message || err)}`;
      btnApprove.disabled = false;
      btnApprove.textContent = '승인(대본 생성)';
      return;
    }

    btnApprove.disabled = false;
    btnApprove.textContent = '승인(대본 생성)';
    btnCopy.disabled = false;
    if (btnPolish) btnPolish.disabled = false;

    const history = loadHistory();
    history.unshift({
      id: `${currentTopic.id}_${Date.now()}`,
      title: currentTopic.title,
      time: new Date().toLocaleString('ko-KR'),
      output: narration,
    });
    saveHistory(history);
    renderHistory(narrationEl);
  });

  safeOn(btnPolish, 'click', async () => {
    const draft = narrationEl?.textContent;
    if (!draft || draft === '아직 원고가 없습니다.') return;

    btnPolish.disabled = true;
    btnPolish.textContent = '다듬는 중...';

    try {
      const polished = await polishNarration(draft);
      if (narrationEl) narrationEl.textContent = polished;
      btnCopy.disabled = false;
    } catch (err) {
      console.error('[golf-ref] polish failed', err);
      alert(`다듬기 오류: ${err.message}`);
    }

    btnPolish.disabled = false;
    btnPolish.textContent = '✨ 다듬기';
  });

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
        alert('소재 추출에 실패했습니다. 댓글 데이터를 확인해주세요.');
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

  function renderTopicChoices(topics) {
    topicBox.innerHTML = `
      <div class="topicTitle">추출된 소재 5개 — 하나를 선택하세요</div>
      ${topics.map((t, i) => `
        <div style="margin:8px 0;padding:12px;background:#0a1020;border:1px solid rgba(255,255,255,.08);border-radius:10px;cursor:pointer"
             id="topic-choice-${i}">
          <div style="font-weight:700;font-size:14px">${escapeHtml(t.title)}</div>
          <div class="meta" style="margin-top:4px">${escapeHtml(t.hook)}</div>
          <div style="margin-top:6px">
            <span class="pill">${escapeHtml(t.emotion || 'info')}</span>
            <span class="pill">${escapeHtml(t.category)}</span>
          </div>
        </div>
      `).join('')}
    `;

    topics.forEach((t, i) => {
      const el = document.getElementById(`topic-choice-${i}`);
      if (el) {
        el.addEventListener('click', () => {
          currentTopic = t;
          btnApprove.disabled = false;
          topicBox.innerHTML = renderTopic(currentTopic);
        });
      }
    });
  }

  safeOn(btnCopy, 'click', async () => {
    if (!narrationEl || !narrationEl.textContent) return;
    await navigator.clipboard.writeText(narrationEl.textContent);
    btnCopy.textContent = '복사됨';
    setTimeout(() => (btnCopy.textContent = '원고 복사'), 900);
  });

  renderHistory(narrationEl);
}
