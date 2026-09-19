(() => {
  const works = Array.isArray(window.PORTFOLIO_WORKS) ? window.PORTFOLIO_WORKS : [];
  const grid = document.getElementById('galleryGrid');
  const count = document.getElementById('workCount');
  const header = document.getElementById('worksHeader');
  const progress = document.getElementById('worksProgress');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && !matchMedia('(pointer: coarse)').matches && !reduced) {
    let glowRaf = 0, glowX = -200, glowY = -200;
    addEventListener('pointermove', (event) => {
      glowX = event.clientX; glowY = event.clientY;
      if (!glowRaf) glowRaf = requestAnimationFrame(() => {
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        cursorGlow.classList.add('is-visible');
        glowRaf = 0;
      });
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-visible'));
  }
  let activeFilter = 'Все';
  let activeIndex = 0;

  if (count) count.textContent = works.length;

  const cardById = new Map();
  works.forEach((work, index) => {
    const article = document.createElement('article');
    article.className = 'work-card';
    article.dataset.category = work.category;
    article.dataset.index = index;
    article.innerHTML = `
      <button class="work-thumb" type="button" aria-label="Открыть работу ${escapeHtml(work.title)}">
        <img src="${work.file}" alt="${escapeHtml(work.title)}" loading="lazy" decoding="async" />
        <span class="work-open-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </span>
      </button>
      <div class="work-info">
        <div><h2>${escapeHtml(work.title)}</h2><p>${escapeHtml(work.category)}</p></div>
        <span class="work-year">${work.year || ''}</span>
      </div>`;
    article.querySelector('.work-thumb').addEventListener('click', () => openLightbox(index));
    grid.appendChild(article);
    cardById.set(index, article);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '80px 0px' });
  document.querySelectorAll('.work-card').forEach((card) => io.observe(card));

  document.querySelectorAll('.filter-chip').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('.filter-chip').forEach((b) => b.classList.toggle('active', b === button));
      document.querySelectorAll('.work-card').forEach((card) => {
        const show = activeFilter === 'Все' || card.dataset.category === activeFilter;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('visible');
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const title = document.getElementById('lightboxTitle');
  const category = document.getElementById('lightboxCategory');
  const year = document.getElementById('lightboxYear');
  const close = document.getElementById('lightboxClose');
  const prev = document.getElementById('lightboxPrev');
  const next = document.getElementById('lightboxNext');

  function visibleWorks() {
    return works.map((w, index) => ({ ...w, originalIndex: index }))
      .filter((w) => activeFilter === 'Все' || w.category === activeFilter);
  }

  function showLightboxItem(originalIndex) {
    const work = works[originalIndex];
    if (!work) return;
    activeIndex = originalIndex;
    image.src = work.file;
    image.alt = work.title;
    title.textContent = work.title;
    category.textContent = work.category;
    year.textContent = work.year || '';
  }

  function openLightbox(originalIndex) {
    showLightboxItem(originalIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function stepLightbox(direction) {
    const visible = visibleWorks();
    const pos = visible.findIndex((w) => w.originalIndex === activeIndex);
    const nextPos = (pos + direction + visible.length) % visible.length;
    if (visible[nextPos]) showLightboxItem(visible[nextPos].originalIndex);
  }

  close.addEventListener('click', closeLightbox);
  prev.addEventListener('click', () => stepLightbox(-1));
  next.addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });

  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header.classList.toggle('scrolled', scrollY > 36);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const requestedWorkId = Number(new URLSearchParams(location.search).get('work'));
  if (Number.isFinite(requestedWorkId) && requestedWorkId > 0) {
    const requestedIndex = works.findIndex((work) => Number(work.id) === requestedWorkId);
    if (requestedIndex >= 0) {
      requestAnimationFrame(() => openLightbox(requestedIndex));
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    })[char]);
  }
})();
