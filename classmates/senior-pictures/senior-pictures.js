const pages = Array.from({ length: 19 }, (_, i) => 59 + i);

let currentPage = 0;
let baseScale = 1;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let startX = 0;
let startY = 0;

const image = document.getElementById("yearbookImage");
const viewer = document.getElementById("viewer");

function updateImage() {
    const scale = baseScale * zoom;

    image.style.transform =
        `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

function fitPage() {
    if (!image.naturalWidth || !image.naturalHeight) return;

    const viewerWidth = viewer.clientWidth - 20;
    const viewerHeight = viewer.clientHeight - 20;

    const scaleX = viewerWidth / image.naturalWidth;
    const scaleY = viewerHeight / image.naturalHeight;

    baseScale = Math.min(scaleX, scaleY);

    zoom = 1;
    offsetX = 0;
    offsetY = 0;

    updateImage();
}

    function displayPage() {
        image.onload = function () {
           fitPage();
    };
document.getElementById("viewerPage").textContent = `${currentPage + 1} of ${pages.length}`;

    image.src = `yearbook-page-${pages[currentPage]}.jpg`;
}

function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        displayPage();
    }
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayPage();
    }
}

function zoomIn() {
    zoom = Math.min(zoom * 1.25, 5);
    updateImage();
}

function zoomOut() {
    zoom = Math.max(zoom / 1.25, 1);
    updateImage();
}

function resetZoom() {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    updateImage();
}

document.getElementById("nextBtn").addEventListener("click", nextPage);
document.getElementById("prevBtn").addEventListener("click", previousPage);
document.getElementById("zoomInBtn").addEventListener("click", zoomIn);
document.getElementById("zoomOutBtn").addEventListener("click", zoomOut);
document.getElementById("resetBtn").addEventListener("click", resetZoom);

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", function () {
    if (!document.fullscreenElement) {
        viewer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

viewer.addEventListener("mousedown", function (event) {
   
    dragging = true;
    console.log("DRAG STARTED");
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    viewer.classList.add("dragging");
});

window.addEventListener("mousemove", function (event) {
    if (!dragging) return;

    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;

    updateImage();
});

window.addEventListener("mouseup", function () {
    dragging = false;
    viewer.classList.remove("dragging");
});

viewer.addEventListener("wheel", function (event) {
    event.preventDefault();

    if (event.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }
}, { passive: false });

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") nextPage();
    if (event.key === "ArrowLeft") previousPage();
    if (event.key === "+") zoomIn();
    if (event.key === "-") zoomOut();
});

window.addEventListener("resize", function () {
    fitPage();
});

displayPage();
