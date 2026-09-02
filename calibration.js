// ============================================================
// ELDEN SLIDER CALIBRATION
//
// min / neutral / max reference points for each measured
// face ratio, used by mapBalanced() in sliders.js.
//
// NOTE: these values are placeholders, not measured from the
// real game yet. To calibrate properly:
//   1. Build an in-game character with one slider at a time
//      set to 0 / 128 / 255 (everything else neutral).
//   2. Screenshot the result and run it through this app's
//      own landmark pipeline.
//   3. Replace the corresponding min/neutral/max below with
//      the measured ratio for that slider.
// This file is intentionally kept separate from the rest of
// the logic so that updating calibration never requires
// touching sliders.js.
// ============================================================

const CALIBRATION = {

    faceSize: {
        min: 2.2,
        neutral: 2.7,
        max: 3.2
    },

    faceRatio: {
        min: 0.75,
        neutral: 0.95,
        max: 1.15
    },

    eyeSize: {
        min: 0.25,
        neutral: 0.38,
        max: 0.50
    },

    eyeSpacing: {
        min: 0.35,
        neutral: 0.52,
        max: 0.70
    },

    noseLength: {
        min: 0.40,
        neutral: 0.58,
        max: 0.80
    },

    noseWidth: {
        min: 0.30,
        neutral: 0.45,
        max: 0.60
    },

    nostrilWidth: {
        min: 0.20,
        neutral: 0.32,
        max: 0.45
    },

    cheekWidth: {
        min: 1.40,
        neutral: 1.80,
        max: 2.20
    },

    mouthWidth: {
        min: 0.70,
        neutral: 0.95,
        max: 1.20
    },

    lipThickness: {
        min: 0.10,
        neutral: 0.22,
        max: 0.35
    },

    chinLength: {
        min: 0.40,
        neutral: 0.62,
        max: 0.85
    },

    chinWidth: {
        min: 0.30,
        neutral: 0.50,
        max: 0.70
    },

    jawWidth: {
        min: 1.10,
        neutral: 1.45,
        max: 1.80
    }

};