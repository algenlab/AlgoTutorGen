const gateDetails = {
  result: {
    code: 'Cₛ · RESULT GATE',
    title: 'Validate the answer before downstream materialization.',
    body: 'Execute solve, normalize its output, and align it with the expected oracle. Failures remain at the specification layer instead of being wrapped in a webpage.',
  },
  trace: {
    code: 'Cₜ · TRACE GATE',
    title: 'The trace must execute in the sandbox and connect to the result.',
    body: 'SemanticTrace checks events, references, result consistency, and coverage boundaries, turning process states into auditable data rather than implicit JavaScript.',
  },
  process: {
    code: 'Cₚ · PROCESS GATE',
    title: 'Process states must remain continuous, not merely correct at the endpoints.',
    body: 'Validate pointers, dependencies, phases, and key objects step by step so every frame remains traceable to the canonical algorithmic state.',
  },
  scene: {
    code: 'Cɢ · SCENE GATE',
    title: 'The scene is a validated projection, not a second implementation of the algorithm.',
    body: 'A deterministic compiler projects the trace into a SceneGraph and rejects dangling references, illegal objects, and layout-contract violations.',
  },
  release: {
    code: 'Cʙ · RELEASE GATE',
    title: 'Browser behavior and pedagogical state are checked together before release.',
    body: 'The fixed Runtime provides playback, hints, feedback, logging, and answer reveal; the read-only teaching overlay must not modify final answers or algorithmic facts.',
  },
};

const artifacts = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    family: 'Search',
    frames: 5,
    image: './assets/binary-search.png',
    href: './artifacts/binary-search.html',
    summary: 'Animate closed-interval pointer contraction in the fixed Runtime and provide feedback at prediction checkpoints.',
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra Shortest Path',
    family: 'Graph',
    frames: 12,
    image: './assets/dijkstra-shortest-path.png',
    href: './artifacts/dijkstra-shortest-path.html',
    summary: 'Project distance relaxation, the current node, and predecessor updates into a playable graph scene while preserving step-level state.',
  },
  {
    id: 'unique-paths',
    title: 'Unique Paths',
    family: 'Dynamic Programming',
    frames: 25,
    image: './assets/unique-paths.png',
    href: './artifacts/unique-paths.html',
    summary: 'Reveal the dependency window and state transition of the 2D DP table cell by cell, keeping the formula, table, and current frame aligned.',
  },
  {
    id: 'trie',
    title: 'Trie Prefix Match',
    family: 'String / Tree',
    frames: 15,
    image: './assets/trie-prefix-match.png',
    href: './artifacts/trie-prefix-match.html',
    summary: 'Advance the current node along the prefix path and connect prefix counts, string alignment, and pedagogical hints to the same state.',
  },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function selectGate(id) {
  const detail = gateDetails[id];
  if (!detail) return;

  document.querySelectorAll('[data-gate]').forEach((gate) => {
    const selected = gate.dataset.gate === id;
    gate.classList.toggle('is-active', selected);
    gate.setAttribute('aria-pressed', String(selected));
  });

  const detailElement = document.querySelector('#gate-detail');
  detailElement.replaceChildren();

  const code = document.createElement('span');
  code.textContent = detail.code;
  const title = document.createElement('strong');
  title.textContent = detail.title;
  const body = document.createElement('p');
  body.textContent = detail.body;
  detailElement.append(code, title, body);
}

function setupGates() {
  const gates = [...document.querySelectorAll('[data-gate]')];
  gates.forEach((gate, index) => {
    gate.addEventListener('click', () => selectGate(gate.dataset.gate));
    gate.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = gates[(index + delta + gates.length) % gates.length];
      next.focus();
      selectGate(next.dataset.gate);
    });
  });
}

function selectArtifact(id) {
  const artifact = artifacts.find((item) => item.id === id);
  if (!artifact) return;

  const imageWrap = document.querySelector('.artifact-image-wrap');
  const image = document.querySelector('#artifact-image');
  imageWrap.classList.add('is-switching');

  const settle = () => {
    imageWrap.classList.remove('is-switching');
    image.removeEventListener('load', settle);
  };
  image.addEventListener('load', settle);
  image.src = artifact.image;
  image.alt = `${artifact.title} interactive algorithm tutor screenshot`;
  if (image.complete) requestAnimationFrame(settle);

  const index = artifacts.indexOf(artifact) + 1;
  document.querySelector('#artifact-index').textContent = `${String(index).padStart(2, '0')} / ${String(artifacts.length).padStart(2, '0')}`;
  document.querySelector('#artifact-title').textContent = artifact.title;
  document.querySelector('#artifact-summary').textContent = artifact.summary;
  document.querySelector('#artifact-family').textContent = artifact.family;
  document.querySelector('#artifact-frames').textContent = String(artifact.frames);
  document.querySelector('#artifact-link').href = artifact.href;
  document.querySelector('#artifact-link').setAttribute('aria-label', `Open the live ${artifact.title} HTML artifact`);

  document.querySelectorAll('[data-artifact]').forEach((button) => {
    const selected = button.dataset.artifact === id;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    button.closest('.artifact-tab').classList.toggle('is-active', selected);
  });
}

function setupArtifacts() {
  const tabs = [...document.querySelectorAll('[data-artifact]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectArtifact(tab.dataset.artifact));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      selectArtifact(tabs[nextIndex].dataset.artifact);
    });
  });
}

function setupRevealObserver() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  elements.forEach((element) => observer.observe(element));
}

function setupActiveNavigation() {
  if (!('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle('is-active', link.hash === `#${visible.target.id}`));
  }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}

function setupScrollChrome() {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('#scroll-progress-bar');
  let scheduled = false;

  const update = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    progress.style.transform = `scaleX(${ratio})`;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    scheduled = false;
  };

  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function setupMobileNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    menu.hidden = true;
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
    menu.hidden = open;
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      close();
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 720px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
}

function setupTraceCanvas() {
  if (reduceMotion.matches) return;
  const canvas = document.querySelector('#trace-canvas');
  const context = canvas.getContext('2d');
  const traces = [
    { y: .18, bend: .10, speed: .000055, phase: .10, alpha: .13 },
    { y: .32, bend: -.07, speed: .000042, phase: .46, alpha: .09 },
    { y: .51, bend: .08, speed: .000061, phase: .72, alpha: .11 },
    { y: .72, bend: -.09, speed: .000048, phase: .28, alpha: .08 },
  ];
  let width = 0;
  let height = 0;
  let frame = 0;
  let paused = false;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const pointOnCurve = (trace, progress) => {
    const startX = width * .02;
    const endX = width * .98;
    const baseY = height * trace.y;
    const controlY = baseY + height * trace.bend;
    const x = startX + (endX - startX) * progress;
    const y = (1 - progress) * (1 - progress) * baseY + 2 * (1 - progress) * progress * controlY + progress * progress * baseY;
    return { x, y };
  };

  const draw = (time) => {
    if (paused) return;
    context.clearRect(0, 0, width, height);

    traces.forEach((trace) => {
      const startX = width * .02;
      const endX = width * .98;
      const baseY = height * trace.y;
      const controlY = baseY + height * trace.bend;
      context.beginPath();
      context.moveTo(startX, baseY);
      context.quadraticCurveTo(width * .5, controlY, endX, baseY);
      context.strokeStyle = `rgba(126, 234, 223, ${trace.alpha})`;
      context.lineWidth = 1;
      context.setLineDash([2, 10]);
      context.stroke();

      const progress = (time * trace.speed + trace.phase) % 1;
      const point = pointOnCurve(trace, progress);
      const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 14);
      glow.addColorStop(0, 'rgba(52, 232, 211, .92)');
      glow.addColorStop(.2, 'rgba(52, 232, 211, .52)');
      glow.addColorStop(1, 'rgba(52, 232, 211, 0)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(point.x, point.y, 14, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#7eeadf';
      context.beginPath();
      context.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
      context.fill();
    });

    context.setLineDash([]);
    frame = requestAnimationFrame(draw);
  };

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (paused) cancelAnimationFrame(frame);
    else frame = requestAnimationFrame(draw);
  });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  frame = requestAnimationFrame(draw);
}

setupGates();
setupArtifacts();
setupRevealObserver();
setupActiveNavigation();
setupScrollChrome();
setupMobileNavigation();
setupTraceCanvas();
selectGate('result');
selectArtifact('binary-search');
