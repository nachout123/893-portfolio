const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
const count = document.querySelector('#result-count');
document.querySelector('.filters').hidden = false;
const grid = document.querySelector('.project-grid');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  grid.classList.toggle('is-filtered', category !== 'all');
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let visible = 0;
  projects.forEach(project => {
    project.hidden = category !== 'all' && project.dataset.category !== category;
    if (!project.hidden) visible++;
  });
  count.textContent = `${visible} ${visible === 1 ? 'pieza' : 'piezas'}`;
}));
const viewer = document.querySelector('#viewer');
const image = document.querySelector('#viewer-image');
let opener;
const viewerStatus = document.querySelector('#viewer-status');
image.addEventListener('load', () => { viewerStatus.textContent = ''; });
image.addEventListener('error', () => {
  if (viewer.open) viewerStatus.textContent = 'No se pudo cargar la pieza. Cierra esta vista e inténtalo de nuevo.';
});
document.querySelectorAll('[data-viewer]').forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof viewer.showModal !== 'function') return;
  event.preventDefault();
  opener = link;
  viewerStatus.textContent = 'Cargando pieza…';
  image.src = link.href;
  image.alt = link.querySelector('img')?.alt || link.dataset.title;
  document.querySelector('#viewer-title').textContent = link.dataset.title;
  viewer.showModal();
  document.body.classList.add('viewer-open');
}));
document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) { const box = viewer.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close(); } });
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  image.removeAttribute('src');
  opener?.focus();
});
