const yearbookPages = Array.from({ length: 19 }, (_, i) => 59 + i);

const viewer = document.getElementById('viewer');
const canvas = document.getElementById('canvas');
const image = document.getElementById('yearbookImage');
const viewerPage = document.getElementById('viewerPage');
const yearbookPage = document.getElementById('yearbookPage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetBtn = document.getElementById('resetBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentIndex = 0;
let scale = 1;
let panX = 0;
let panY = 0;
let dragging = false;
let startX = 0;
let startY = 0;
let startPanX = 0;
let startPanY = 0;

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.25;

function updateTransform() {
  canvas.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;
}

function resetView() {
  scale = 1;
  panX = 0;
  panY = 0;
  updateTransform();
}

function loadPage(index) {
  currentIndex = Math.max(0, Math.min(yearbookPages.length - 1, index));
  const page = yearbookPages[currentIndex];
  image.src = `yearbook-page-${page}.jpg`; = `image.src = `yearbook-page-${page}.jpg`;-${page}.jpg`;
  image.alt = `1967 yearbook senior pictures, yearbook page ${page}`;
  viewerPage.textContent = currentIndex + 1;
  yearbookPage.textContent = page;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === yearbookPages.length - 1;
  resetView();
}

function setZoom(nextScale) {
  const oldScale = scale;
  scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));

  // Keep the page centered when returning to 1x.
  if (scale === 1) {
    panX = 0;
    panY = 0;
  } else if (oldScale !== scale) {
    // Keep the current pan position while zooming.
    const ratio = scale / oldScale;
    panX *= ratio;
    panY *= ratio;
  }
  updateTransform();
}

prevBtn.addEventListener('click', () => loadPage(currentIndex - 1));
nextBtn.addEventListener('click', () => loadPage(currentIndex + 1));
zoomInBtn.addEventListener('click', () => setZoom(scale + ZOOM_STEP));
zoomOutBtn.addEventListener('click', () => setZoom(scale - ZOOM_STEP));
resetBtn.addEventListener('click', resetView);

viewer.addEventListener('wheel', (event) => {
  event.preventDefault();
  setZoom(scale + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
}, { passive: false });

viewer.addEventListener('pointerdown', (event) => {
  dragging = true;
  viewer.classList.add('dragging');
  startX = event.clientX;
  startY = event.clientY;
  startPanX = panX;
  startPanY = panY;
  viewer.setPointerCapture(event.pointerId);
});

viewer.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  panX = startPanX + (event.clientX - startX);
  panY = startPanY + (event.clientY - startY);
  updateTransform();
});

function stopDragging(event) {
  dragging = false;
  viewer.classList.remove('dragging');
  if (event && viewer.hasPointerCapture(event.pointerId)) {
    viewer.releasePointerCapture(event.pointerId);
  }
}

viewer.addEventListener('pointerup', stopDragging);
viewer.addEventListener('pointercancel', stopDragging);
viewer.addEventListener('pointerleave', () => {
  // Pointer capture keeps dragging active when the pointer briefly leaves the viewer.
});

fullscreenBtn.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) {
      await viewer.requestFullscreen();
      fullscreenBtn.textContent = 'Exit Full Screen';
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error('Full-screen mode is not available.', error);
  }
});

document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.textContent = document.fullscreenElement ? 'Exit Full Screen' : 'Full Screen';
});

document.addEventListener('keydown', (event) => {
  if (event.target.matches('input, textarea, select, button')) return;

  if (event.key === 'ArrowLeft') loadPage(currentIndex - 1);
  if (event.key === 'ArrowRight') loadPage(currentIndex + 1);
  if (event.key === '+' || event.key === '=') setZoom(scale + ZOOM_STEP);
  if (event.key === '-' || event.key === '_') setZoom(scale - ZOOM_STEP);
  if (event.key === '0') resetView();
});

loadPage(0);
