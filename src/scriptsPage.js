import { escapeHtml, safeOn } from './dom.js';

const KEY = 'golf_ref_script_board_v1';

function loadBoard() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBoard(rows) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function splitScripts(text) {
  const t = String(text || '').trim();
  if (!t) return [];
  // two+ blank lines as separator
  return t
    .split(/\n\s*\n\s*\n+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function makeTitleFromScript(script) {
  const s = String(script || '').replace(/\s+/g, ' ').trim();

  // 1) Try to capture hook-ish phrase
  const candidates = [];

  // bold markers content
  for (const m of s.matchAll(/\*\*(.+?)\*\*/g)) {
    const txt = m[1].trim();
    if (txt && txt.length <= 22) candidates.push(txt);
  }

  // common Korean anchors
  const anchorPatterns = [
    /결론부터 말하면[, ]\s*([^.!?\n]{6,28})/, 
    /핵심은[, ]\s*([^.!?\n]{6,28})/,
    /한 줄 정리[.:]?\s*([^\n]{6,28})/,
    /이거 모르면[^\n]{0,10}([^\n]{6,28})/,
  ];
  for (const re of anchorPatterns) {
    const m = s.match(re);
    if (m && m[1]) candidates.push(m[1].trim());
  }

  const top = candidates.find(Boolean);
  if (top) {
    return `${top}`.slice(0, 28);
  }

  // 2) fallback: first sentence
  const first = s.split(/[\n.!?]/).map(x => x.trim()).find(Boolean) || '골프 룰 1분 정리';
  return first.slice(0, 28);
}

function toCsv(rows) {
  const header = ['title', 'script', 'videoProduction', 'review', 'upload', 'editor'];
  const escape = (v) => {
    const t = String(v ?? '');
    if (/[",\n]/.test(t)) return '"' + t.replaceAll('"', '""') + '"';
    return t;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([
      r.title,
      r.script,
      r.videoProduction ? '1' : '0',
      r.review ? '1' : '0',
      r.upload ? '1' : '0',
      r.editor,
    ].map(escape).join(','));
  }
  return lines.join('\n');
}

function render(rows) {
  const tbody = document.getElementById('rows');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!rows.length) {
    tbody.innerHTML = '<tr><td class="muted" colspan="6">아직 항목이 없습니다. 위에 원고를 붙여넣고 [리스트 생성]을 눌러주세요.</td></tr>';
    return;
  }

  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');

    const tdTitle = document.createElement('td');
    tdTitle.innerHTML = `
      <div class="meta" style="margin-bottom:6px">썸네일용 제목</div>
      <textarea data-field="title" data-idx="${idx}" style="min-height:68px">${escapeHtml(row.title)}</textarea>
      <div class="meta small">자동생성됨(수정 가능)</div>
    `;

    const tdScript = document.createElement('td');
    tdScript.innerHTML = `
      <div class="meta" style="margin-bottom:6px">대본</div>
      <textarea data-field="script" data-idx="${idx}" style="min-height:120px">${escapeHtml(row.script)}</textarea>
      <div class="meta small">여기 내용 수정 가능(자동 저장)</div>
    `;

    const mkChk = (field, label) => {
      const checked = row[field] ? 'checked' : '';
      return `
        <label class="chk"><input type="checkbox" data-field="${field}" data-idx="${idx}" ${checked}/> ${label}</label>
      `;
    };

    const tdProd = document.createElement('td');
    tdProd.innerHTML = `<div class="meta" style="margin-bottom:6px">체크</div>${mkChk('videoProduction', '완료')}`;

    const tdReview = document.createElement('td');
    tdReview.innerHTML = `<div class="meta" style="margin-bottom:6px">체크</div>${mkChk('review', '완료')}`;

    const tdUpload = document.createElement('td');
    tdUpload.innerHTML = `<div class="meta" style="margin-bottom:6px">체크</div>${mkChk('upload', '완료')}`;

    const tdEditor = document.createElement('td');
    tdEditor.innerHTML = `
      <div class="meta" style="margin-bottom:6px">편집자</div>
      <input data-field="editor" data-idx="${idx}" value="${escapeHtml(row.editor || '')}" style="width:100%;background:#0a1020;border:1px solid rgba(255,255,255,.10);border-radius:10px;color:var(--text);padding:10px;box-sizing:border-box"/>
      <div class="meta small">예: editorA</div>
    `;

    tr.appendChild(tdTitle);
    tr.appendChild(tdScript);
    tr.appendChild(tdProd);
    tr.appendChild(tdReview);
    tr.appendChild(tdUpload);
    tr.appendChild(tdEditor);

    tbody.appendChild(tr);
  });
}

function attachAutoSave(rows) {
  const root = document.body;
  root.addEventListener('input', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const idx = el.getAttribute('data-idx');
    const field = el.getAttribute('data-field');
    if (idx == null || field == null) return;

    const i = parseInt(idx, 10);
    if (!Number.isFinite(i) || !rows[i]) return;

    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      rows[i][field] = el.value;
      saveBoard(rows);
    }
  });

  root.addEventListener('change', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const idx = el.getAttribute('data-idx');
    const field = el.getAttribute('data-field');
    if (idx == null || field == null) return;

    const i = parseInt(idx, 10);
    if (!Number.isFinite(i) || !rows[i]) return;

    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      rows[i][field] = el.checked;
      saveBoard(rows);
    }
  });
}

function mergeScriptsIntoBoard(existingRows, scripts) {
  const now = Date.now();
  const newRows = scripts.map((script, i) => ({
    id: `${now}_${i}`,
    title: makeTitleFromScript(script),
    script,
    videoProduction: false,
    review: false,
    upload: false,
    editor: '',
  }));
  return [...newRows, ...existingRows];
}

function init() {
  const bulk = document.getElementById('bulkScripts');
  const btnParse = document.getElementById('btnParse');
  const btnClear = document.getElementById('btnClear');
  const btnExport = document.getElementById('btnExport');

  let rows = loadBoard();
  render(rows);
  attachAutoSave(rows);

  safeOn(btnParse, 'click', () => {
    const scripts = splitScripts(bulk?.value || '');
    if (!scripts.length) {
      alert('대본을 붙여넣어 주세요. (원고 사이를 빈 줄 2개로 구분)');
      return;
    }
    rows = mergeScriptsIntoBoard(rows, scripts);
    saveBoard(rows);
    render(rows);
    if (bulk) bulk.value = '';
  });

  safeOn(btnClear, 'click', () => {
    if (!confirm('진행표를 초기화할까요? (로컬 저장 데이터가 삭제됩니다)')) return;
    rows = [];
    saveBoard(rows);
    render(rows);
    if (bulk) bulk.value = '';
  });

  safeOn(btnExport, 'click', () => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'golf_ref_script_board.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

init();
