// ============================================================
// CANVAS UTILS
// Draws the uploaded photo to an off-screen canvas and samples
// average RGB color around a given landmark point.
// Depends on: nothing (self-contained state + functions).
// ============================================================

const analysisCanvas = document.createElement("canvas");
const analysisCtx = analysisCanvas.getContext("2d", {
    willReadFrequently: true
});

// Cache of the whole image's pixel data, built once per image
// in prepareAnalysisCanvas(). Sampling functions read from this
// instead of calling getImageData() repeatedly per landmark.
let cachedImageData = null;

function prepareAnalysisCanvas(previewImg) {

    analysisCanvas.width =
        previewImg.naturalWidth || previewImg.width;

    analysisCanvas.height =
        previewImg.naturalHeight || previewImg.height;

    analysisCtx.clearRect(
        0,
        0,
        analysisCanvas.width,
        analysisCanvas.height
    );

    analysisCtx.drawImage(
        previewImg,
        0,
        0,
        analysisCanvas.width,
        analysisCanvas.height
    );

    // Read the whole canvas once per image instead of calling
    // getImageData() separately for every landmark sample later.
    if (analysisCanvas.width > 0 && analysisCanvas.height > 0) {

        cachedImageData = analysisCtx.getImageData(
            0,
            0,
            analysisCanvas.width,
            analysisCanvas.height
        );

    } else {

        cachedImageData = null;
    }
}

function resetAnalysisCanvas() {

    cachedImageData = null;
}

// ------------------------------------------------------------
// RGB SAMPLING (reads from the cached ImageData)
// ------------------------------------------------------------

function getAverageRGB(point, radius = 4) {

    if (
        !cachedImageData ||
        !analysisCanvas.width ||
        !analysisCanvas.height
    ) {

        return {
            r: 128,
            g: 128,
            b: 128
        };
    }

    const canvasWidth = analysisCanvas.width;
    const canvasHeight = analysisCanvas.height;

    const centerX =
        Math.floor(point.x * canvasWidth);

    const centerY =
        Math.floor(point.y * canvasHeight);

    const startX =
        Math.max(0, centerX - radius);

    const startY =
        Math.max(0, centerY - radius);

    const endX =
        Math.min(canvasWidth - 1, centerX + radius);

    const endY =
        Math.min(canvasHeight - 1, centerY + radius);

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    const data = cachedImageData.data;

    for (let y = startY; y <= endY; y++) {

        // Row offset into the full-canvas pixel buffer.
        const rowStart = (y * canvasWidth + startX) * 4;
        const rowEnd = (y * canvasWidth + endX) * 4;

        for (let i = rowStart; i <= rowEnd; i += 4) {

            r += data[i];
            g += data[i + 1];
            b += data[i + 2];

            count++;
        }
    }

    if (count === 0) {

        return {
            r: 128,
            g: 128,
            b: 128
        };
    }

    return {

        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)

    };
}

function rgbString(rgb) {

    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

function brightness(rgb) {

    return (
        rgb.r +
        rgb.g +
        rgb.b
    ) / 3;
}