// ============================================================
// CAMERA CAPTURE
// Lets the user take a photo with their device camera instead
// of uploading a file. The captured frame is handed to
// loadImageFromDataUrl() (defined in main.js) so it goes
// through the exact same analysis pipeline as an uploaded file.
// Depends on: nothing at load time — only calls into main.js
// at click time, by which point every script has already run.
// ============================================================

const cameraBtn = document.getElementById("camera-btn");
const cameraContainer = document.getElementById("camera-container");
const cameraVideo = document.getElementById("camera-video");
const captureBtn = document.getElementById("capture-btn");
const cancelCameraBtn = document.getElementById("cancel-camera-btn");

let cameraStream = null;

cameraBtn.addEventListener("click", startCamera);
cancelCameraBtn.addEventListener("click", stopCamera);
captureBtn.addEventListener("click", capturePhoto);

async function startCamera() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Camera access isn't supported in this browser."
        );

        return;
    }

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            });

        cameraVideo.srcObject = cameraStream;

        cameraContainer.hidden = false;

    } catch (error) {

        console.error(
            "Could not access the camera:",
            error
        );

        alert(
            "Couldn't access the camera. Check your browser's " +
            "camera permission for this page."
        );
    }
}

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach((track) => track.stop());

        cameraStream = null;
    }

    cameraVideo.srcObject = null;

    cameraContainer.hidden = true;
}

function capturePhoto() {

    if (
        !cameraVideo.videoWidth ||
        !cameraVideo.videoHeight
    ) {

        // Video metadata hasn't loaded yet — ignore the click
        // rather than capturing a blank frame.
        return;
    }

    const captureCanvas = document.createElement("canvas");

    captureCanvas.width = cameraVideo.videoWidth;
    captureCanvas.height = cameraVideo.videoHeight;

    const ctx = captureCanvas.getContext("2d");

    ctx.drawImage(
        cameraVideo,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    const dataUrl =
        captureCanvas.toDataURL("image/png");

    stopCamera();

    loadImageFromDataUrl(dataUrl);
}