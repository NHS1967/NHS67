const pages = Array.from({ length: 19 }, (_, i) => 59 + i);

let currentPage = 0;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let startX = 0;
let startY = 0;

const image = document.getElementById("yearbookImage");
const viewer = document.getElementById("viewer");

function displayPage() {
    image.src = `yearbook-page-${pages[currentPage]}.jpg`;
    resetView();
}

function resetView() {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    updateImage();
}

function updateImage() {
    image.style.transform =
        `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
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
    zoom = Math.min(zoom + 0.25, 4);
    updateImage();
}

function zoomOut() {
    zoom = Math.max(zoom - 0.25, 0.5);
    updateImage();
}

function resetZoom() {
    resetView();
}

document.getElementById("nextBtn").addEventListener("click", nextPage);
document.getElementById("prevBtn").addEventListener("click", previousPage);
document.getElementById("zoomInBtn").addEventListener("click", zoomIn);
document.getElementById("zoomOutBtn").addEventListener("click", zoomOut);
document.getElementById("resetBtn").addEventListener("click", resetZoom);

image.addEventListener("mousedown", function (event) {
    if (zoom <= 1) return;

    dragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    image.style.cursor = "grabbing";
});

window.addEventListener("mousemove", function (event) {
    if (!dragging) return;

    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;

    updateImage();
});

window.addEventListener("mouseup", function () {
    dragging = false;
    image.style.cursor = "grab";
});

image.addEventListener("wheel", function (event) {
    event.preventDefault();

    if (event.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }

    if (event.key === "+") {
        zoomIn();
    }

    if (event.key === "-") {
        zoomOut();
    }
});

displayPage();
