import { TOPICS } from './topics.js';
import { escapeHtml, safeOn } from './dom.js';
import { loadHistory, saveHistory } from './storage.js';
import { buildManualTopic, buildSlideScript } from './generator.js';

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
      document.getElementById('output').textContent = item.output;
      const parsed = (() => {
        try { return JSON.parse(item.output); } catch { return null; }
      })();
      if (parsed?.fullNarrationDraft) {
        document.getElementById('narration').textContent = parsed.fullNarrationDraft;
      }
    });
    ul.appendChild(li);
  }
}

export function initUI() {
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

  if (!btnTopic || !btnApprove || !topicBox || !output) {
    console.warn('[golf-ref] Missing required DOM nodes; UI init skipped.');
    return;
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
    const userNotes = userNotesEl?.value || '';

    try {
      currentScript = buildSlideScript({ topic: currentTopic, userNotes });
      const pretty = JSON.stringify(currentScript, null, 2);
      output.textContent = pretty;
      if (narrationEl) narrationEl.textContent = currentScript.fullNarrationDraft || '원고 생성 실패';
    } catch (err) {
      console.error('[golf-ref] script generation failed', err);
      output.textContent = `대본 생성 중 오류가 발생했습니다.\n\n${String(err && err.stack ? err.stack : err)}`;
      if (narrationEl) narrationEl.textContent = '원고 생성 중 오류(콘솔/오류 메시지 확인)';
      return;
    }

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
  });

  safeOn(btnCopy, 'click', async () => {
    if (!currentScript) return;
    await navigator.clipboard.writeText(output.textContent);
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
}
