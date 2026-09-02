// ============================================================
// ELDEN SLIDER TOOL — MAIN
// Wires up the page, reads the uploaded photo, runs FaceMesh,
// then hands the landmarks to landmarks.js -> sliders.js ->
// render.js.
// Depends on: math-utils.js, canvas-utils.js, calibration.js,
// landmarks.js, sliders.js, render.js (all loaded before this
// file — see index.html).
// ============================================================

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const previewImg = document.getElementById("preview-img");
const resultsContainer = document.getElementById("results-container");
const slidersGrid = document.getElementById("sliders-grid");
const newImageBtn = document.getElementById("new-image-btn");

// ------------------------------------------------------------
// GLOBAL STATE
// ------------------------------------------------------------

let modelsLoaded = false;

// ------------------------------------------------------------
// FACE-API
// ------------------------------------------------------------

async function loadModels() {

    const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

    try {

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);

        modelsLoaded = true;

        console.log("Face-API models loaded.");

    } catch (error) {

        console.error(
            "Failed to load Face-API models:",
            error
        );
    }
}

// ------------------------------------------------------------
// MEDIAPIPE FACE MESH
// ------------------------------------------------------------

const faceMesh = new FaceMesh({

    locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`

});

faceMesh.setOptions({

    maxNumFaces: 1,
    refineLandmarks: true,

    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5

});

faceMesh.onResults(handleResults);

loadModels();

// ------------------------------------------------------------
// FILE INPUT
// ------------------------------------------------------------

dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("drag-over");

});

dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("drag-over");

});

dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("drag-over");

    const files = event.dataTransfer.files;

    if (files && files.length > 0) {

        processFile(files[0]);

    }

});

fileInput.addEventListener("change", (event) => {

    const files = event.target.files;

    if (files && files.length > 0) {

        processFile(files[0]);

    }

    // Clear the input value so choosing the exact same file
    // again still fires a "change" event next time.
    event.target.value = "";

});

newImageBtn.addEventListener("click", resetTool);

function resetTool() {

    stopCamera();

    previewImg.src = "";
    previewImg.hidden = true;

    resultsContainer.hidden = true;
    slidersGrid.innerHTML = "";

    resetAnalysisCanvas();

    fileInput.value = "";

}

// ------------------------------------------------------------
// PROCESS IMAGE
// Shared by both the file-input path and the camera-capture
// path (camera.js calls loadImageFromDataUrl directly once it
// has a captured frame).
// ------------------------------------------------------------

function loadImageFromDataUrl(dataUrl) {

    // Set onload BEFORE assigning src, so we never race
    // against the browser firing the load event early.
    previewImg.onload = async () => {

        prepareAnalysisCanvas(previewImg);

        try {

            await faceMesh.send({
                image: previewImg
            });

        } catch (error) {

            console.error(
                "Face Mesh analysis failed:",
                error
            );

            alert(
                "Face analysis failed."
            );
        }

    };

    previewImg.src = dataUrl;

    previewImg.hidden = false;

}

function processFile(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {

        loadImageFromDataUrl(event.target.result);

    };

    reader.onerror = () => {

        console.error("Failed to read the file.");

        alert("Failed to read the image.");

    };

    reader.readAsDataURL(file);
}

// ------------------------------------------------------------
// MAIN ANALYSIS PIPELINE
// landmarks -> (age/gender) -> sliders -> render
// ------------------------------------------------------------

async function handleResults(results) {

    if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
    ) {

        alert(
            "No face detected in the image.\n\n" +
            "Try a photo where the face is clearly visible, facing forward."
        );

        return;
    }

    const p =
        results.multiFaceLandmarks[0];

    // --------------------------------------------------------
    // BASIC VALIDITY CHECK
    // --------------------------------------------------------

    const eyeDist =
        dist2D(p[33], p[263]);

    if (eyeDist <= 0) {

        alert(
            "Face measurement failed."
        );

        return;
    }

    // --------------------------------------------------------
    // HEAD POSE
    // --------------------------------------------------------

    const pose =
        calculateHeadPose(p);

    const poseTooLarge =
        Math.abs(pose.yaw) > 15 ||
        Math.abs(pose.pitch) > 15 ||
        Math.abs(pose.roll) > 12;

    if (poseTooLarge) {

        console.warn(
            "The face isn't fully facing the camera."
        );
    }

    // --------------------------------------------------------
    // MEASUREMENTS (geometry + color)
    // --------------------------------------------------------

    const m = {
        ...computeFaceMeasurements(p),
        ...computeColorMeasurements(p)
    };

    // --------------------------------------------------------
    // AGE / GENDER
    // --------------------------------------------------------

    let detectedType = "A";
    let detectedVoice = "Young 1";
    let detectedAge = null;

    if (modelsLoaded) {

        try {

            const detection =
                await faceapi
                    .detectSingleFace(
                        previewImg,
                        new faceapi.TinyFaceDetectorOptions()
                    )
                    .withAgeAndGender();

            if (detection) {

                detectedAge =
                    Math.round(detection.age);

                if (
                    detection.gender === "female"
                ) {

                    detectedType = "B";
                    detectedVoice = "Young 2";

                } else {

                    detectedType = "A";
                    detectedVoice = "Young 1";
                }
            }

        } catch (error) {

            console.warn(
                "Face-API age/gender analysis failed:",
                error
            );
        }
    }

    // --------------------------------------------------------
    // BUILD + RENDER SLIDERS
    // --------------------------------------------------------

    const calculatedSliders = buildSliders(
        p,
        m,
        pose,
        {
            detectedType,
            detectedAge,
            detectedVoice
        }
    );

    renderResults(
        calculatedSliders,
        pose,
        poseTooLarge
    );
}