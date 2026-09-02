// ============================================================
// LANDMARKS
// Turns the raw 468/478-point MediaPipe landmark array (p)
// into named measurements: geometric ratios (relative to
// eye distance) and sampled skin/hair/eye colors.
// Depends on: math-utils.js (dist2D, clamp), canvas-utils.js
// (getAverageRGB, brightness).
// ============================================================

// ------------------------------------------------------------
// HEAD POSE
// Approximate face orientation, used to warn the user when
// a photo isn't close enough to front-facing.
// ------------------------------------------------------------

function calculateHeadPose(p) {

    const leftEye = p[33];
    const rightEye = p[263];

    const nose = p[1];

    const eyeCenter = {

        x: (leftEye.x + rightEye.x) / 2,
        y: (leftEye.y + rightEye.y) / 2,
        z: (leftEye.z + rightEye.z) / 2

    };

    const eyeDistance =
        dist2D(leftEye, rightEye);

    if (eyeDistance === 0) {

        return {
            yaw: 0,
            pitch: 0,
            roll: 0
        };
    }

    const horizontalOffset =
        (nose.x - eyeCenter.x) /
        eyeDistance;

    const verticalOffset =
        (nose.y - eyeCenter.y) /
        eyeDistance;

    const roll =
        Math.atan2(
            rightEye.y - leftEye.y,
            rightEye.x - leftEye.x
        ) *
        180 /
        Math.PI;

    const yaw =
        horizontalOffset * 100;

    const pitch =
        verticalOffset * 100;

    return {

        yaw,
        pitch,
        roll

    };
}

// ------------------------------------------------------------
// FACE GEOMETRY
// All distances are normalized by eye distance so the result
// doesn't depend on how close the photo was taken or on image
// resolution.
// ------------------------------------------------------------

function computeFaceMeasurements(p) {

    const eyeDist =
        dist2D(p[33], p[263]);

    const faceHeight =
        dist2D(p[10], p[152]) /
        eyeDist;

    const faceWidth =
        dist2D(p[234], p[454]) /
        eyeDist;

    const foreheadHeight =
        dist2D(p[10], p[9]) /
        eyeDist;

    const browInner =
        dist2D(p[55], p[285]) /
        eyeDist;

    const eyeVertical =
        (p[145].y - p[10].y) /
        eyeDist;

    const eyeSize =
        dist2D(p[33], p[133]) /
        eyeDist;

    const eyeSpacing =
        dist2D(p[133], p[362]) /
        eyeDist;

    // NOSE

    const noseLength =
        dist2D(p[6], p[2]) /
        eyeDist;

    const noseWidth =
        dist2D(p[129], p[358]) /
        eyeDist;

    const nostrilWidth =
        dist2D(p[49], p[279]) /
        eyeDist;

    const noseDepth =
        p[1].z - p[4].z;

    const noseTipElevation =
        p[4].y - p[2].y;

    const noseSlant =
        p[4].x - p[1].x;

    // CHEEKS

    const cheekWidth =
        dist2D(p[116], p[345]) /
        eyeDist;

    const cheekHeight =
        (p[116].y - p[10].y) /
        eyeDist;

    const cheekDepth =
        p[116].z - p[1].z;

    // MOUTH

    const mouthWidth =
        dist2D(p[61], p[291]) /
        eyeDist;

    const lipThickness =
        dist2D(p[0], p[17]) /
        eyeDist;

    const mouthSlant =
        p[291].y - p[61].y;

    // CHIN

    const chinLength =
        dist2D(p[18], p[152]) /
        eyeDist;

    const chinWidth =
        dist2D(p[148], p[377]) /
        eyeDist;

    const jawWidth =
        dist2D(p[172], p[397]) /
        eyeDist;

    const chinProtrusion =
        p[18].z - p[152].z;

    return {

        eyeDist,

        faceHeight,
        faceWidth,
        foreheadHeight,
        browInner,
        eyeVertical,
        eyeSize,
        eyeSpacing,

        noseLength,
        noseWidth,
        nostrilWidth,
        noseDepth,
        noseTipElevation,
        noseSlant,

        cheekWidth,
        cheekHeight,
        cheekDepth,

        mouthWidth,
        lipThickness,
        mouthSlant,

        chinLength,
        chinWidth,
        jawWidth,
        chinProtrusion

    };
}

// ------------------------------------------------------------
// COLORS
// Samples average RGB around a handful of landmark points to
// estimate skin tone, hair color, lip color, dark circles and
// eyeliner-like contrast around the eyes.
// ------------------------------------------------------------

function computeColorMeasurements(p) {

    const skinRGB =
        getAverageRGB(p[116], 5);

    const hairRGB =
        getAverageRGB(p[10], 4);

    const eyebrowRGB =
        getAverageRGB(p[70], 3);

    const lipRGB =
        getAverageRGB(p[17], 3);

    const eyeUnderRGB =
        getAverageRGB(p[230], 4);

    // Iris

    const rightIrisRGB =
        p[468]
            ? getAverageRGB(p[468], 2)
            : skinRGB;

    const leftIrisRGB =
        p[473]
            ? getAverageRGB(p[473], 2)
            : rightIrisRGB;

    // Skin / eye features derived from brightness differences

    const skinBrightness =
        brightness(skinRGB);

    const underBrightness =
        brightness(eyeUnderRGB);

    const darkCirclesVal =
        Math.round(
            clamp(
                (skinBrightness - underBrightness) * 4
            )
        );

    const upperEyelidRGB =
        getAverageRGB(p[159], 3);

    const eyelidBrightness =
        brightness(upperEyelidRGB);

    const eyelinerVal =
        Math.round(
            clamp(
                (skinBrightness - eyelidBrightness) * 3
            )
        );

    return {

        skinRGB,
        hairRGB,
        eyebrowRGB,
        lipRGB,
        eyeUnderRGB,
        rightIrisRGB,
        leftIrisRGB,

        darkCirclesVal,
        eyelinerVal

    };
}