/* Shared renderer for kindergarten.html / primary.html / secondary.html / intermediate.html
   Each page sets window.STAGE_ID and window.STAGE_CLASSES before loading this script. */

const API = 'data';
let eduData = null;
let allVideos = [];

const params = new URLSearchParams(window.location.search);
const initBoard = params.get('board') || 'all';

function renderDiksha(board) {
  const grid = document.getElementById('dikshaGrid');
  if (!eduData) return;
  const boards = board === 'all' ? eduData.boards : eduData.boards.filter(b => b.id === board);
  const cards = boards.map(b => {
    const stage = b.stages.find(s => s.id === STAGE_ID);
    if (!stage) return '';
    return `
      <div class="card">
        <span class="card-badge badge-free">${b.name}</span>
        <h3>${stage.name}</h3>
        <p>${stage.description}</p>
        <p style="margin-top:4px;">${stage.ageGroup} · ${stage.resourceCount} resources</p>
        <div class="card-actions">
          <a href="${stage.dikshaUrl}" target="_blank" class="btn-card-primary">Open in DIKSHA</a>
        </div>
      </div>`;
  }).join('');
  grid.innerHTML = cards || '<p style="color:var(--text-mid);padding:16px;">No resources found.</p>';
}

function renderTextbooks(board) {
  const grid = document.getElementById('textbooksGrid');
  if (!eduData) return;
  if (!STAGE_CLASSES) { grid.innerHTML = '<p style="color:var(--text-mid);padding:16px;">No textbooks published for this stage yet — see the DIKSHA resources above.</p>'; return; }

  const boardName = board === 'ap' ? 'AP Board' : board === 'ts' ? 'TS Board' : null;
  let books = boardName ? eduData.textbooks.filter(t => t.board === boardName) : eduData.textbooks;
  books = books.filter(t => STAGE_CLASSES.includes(t.class));
  if (!books.length) { grid.innerHTML = '<p style="color:var(--text-mid);padding:16px;">No textbooks found.</p>'; return; }
  grid.innerHTML = books.map(t => `
    <div class="card">
      <span class="card-badge badge-free">${t.source}</span>
      <h3>${t.title}</h3>
      <p style="font-weight:500;margin-bottom:6px;">${t.subject} · ${t.class}</p>
      <p>${t.description}</p>
      <div class="card-actions">
        ${t.pdfUrl ? `<a href="${t.pdfUrl}" target="_blank" class="btn-card-primary">📄 Download PDF</a>` : ''}
        <a href="${t.readUrl}" target="_blank" class="btn-card-ghost">${t.pdfUrl ? 'Read Online' : 'Visit Portal'}</a>
      </div>
    </div>`).join('');
}

function renderVideos(board) {
  const grid = document.getElementById('videoGrid');
  if (!STAGE_CLASSES) { grid.innerHTML = '<p style="color:var(--text-mid);padding:16px;">No video lessons for this stage yet.</p>'; return; }

  const boardName = board === 'ap' ? 'AP Board' : board === 'ts' ? 'TS Board' : null;
  let videos = boardName ? allVideos.filter(v => v.board === boardName) : allVideos.filter(v => v.board === 'AP Board' || v.board === 'TS Board');
  videos = videos.filter(v => STAGE_CLASSES.includes(v.class));
  if (!videos.length) { grid.innerHTML = '<p style="color:var(--text-mid);padding:16px;">No videos found.</p>'; return; }
  grid.innerHTML = videos.map(v => `
    <div class="card">
      <span class="card-badge badge-free">VIDEO</span>
      <div class="video-wrapper" style="margin-bottom:12px;">
        <iframe src="https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe>
      </div>
      <h3>${v.title}</h3>
      <p>${v.board} · ${v.class} · ${v.subject}</p>
      <p style="margin-top:4px;">${v.chapter} · ${v.duration} · ${v.language}</p>
    </div>`).join('');
}

const PAPERS_CATEGORY = { secondary: 'secondary', intermediate: 'intermediate' };

function renderPreviousPapers(board) {
  const grid = document.getElementById('papersGrid');
  if (!grid || !eduData) return;
  const categoryKey = PAPERS_CATEGORY[STAGE_ID];
  if (!categoryKey) { grid.innerHTML = '<p style="color:var(--text-mid);padding:16px;">No previous papers for this stage yet.</p>'; return; }

  const boardName = board === 'ap' ? 'AP Board' : board === 'ts' ? 'TS Board' : null;
  let papers = eduData.previousPapers[categoryKey] || [];
  if (boardName) papers = papers.filter(p => p.board === boardName);
  if (!papers.length) { grid.innerHTML = '<p style="color:var(--text-mid);padding:16px;">No previous papers found.</p>'; return; }
  grid.innerHTML = papers.map(p => `
    <div class="card">
      <span class="card-badge badge-free">${p.board || p.stream || p.exam}</span>
      <h3>${p.title}</h3>
      ${p.subject ? `<p style="font-weight:500;margin-bottom:6px;">${p.subject}${p.year ? ' · ' + p.year : ''}</p>` : ''}
      ${p.description ? `<p>${p.description}</p>` : ''}
      <div class="card-actions">
        ${p.pdfUrl ? `<a href="${p.pdfUrl}" target="_blank" class="btn-card-primary">📄 Download PDF</a>` : ''}
        <a href="${p.readUrl}" target="_blank" class="btn-card-ghost">${p.pdfUrl ? 'Official Site' : 'Visit Portal'}</a>
      </div>
    </div>`).join('');
}

function renderEduSections(board) {
  renderDiksha(board);
  renderTextbooks(board);
  renderPreviousPapers(board);
}

document.getElementById('boardTabs').addEventListener('click', e => {
  if (!e.target.matches('.filter-tab')) return;
  document.querySelectorAll('#boardTabs .filter-tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  renderEduSections(e.target.dataset.board);
  renderVideos(e.target.dataset.board);
});

fetch(`${API}/educational.json`)
  .then(r => r.json())
  .then(data => {
    eduData = data;
    document.querySelectorAll('#boardTabs .filter-tab').forEach(t => t.classList.toggle('active', t.dataset.board === initBoard));
    renderEduSections(initBoard);
  })
  .catch(() => {
    ['dikshaGrid', 'textbooksGrid'].forEach(id => {
      document.getElementById(id).innerHTML = '<p style="color:var(--text-mid);padding:16px;">Failed to load content. Please refresh the page.</p>';
    });
  });

fetch(`${API}/videos.json`)
  .then(r => r.json())
  .then(data => { allVideos = data; renderVideos(initBoard); })
  .catch(() => { document.getElementById('videoGrid').innerHTML = '<p style="color:var(--text-mid);padding:16px;">Failed to load videos. Please refresh the page.</p>'; });
