// ============================================================
// MATH UTILS
// Generic numeric helpers used by landmarks.js and sliders.js.
// No DOM or canvas access here — pure functions only.
// ============================================================

function clamp(value, min = 0, max = 255) {

    return Math.max(
        min,
        Math.min(max, value)
    );
}

function dist2D(p1, p2) {

    return Math.hypot(
        p1.x - p2.x,
        p1.y - p2.y
    );
}

// ------------------------------------------------------------
// STANDARD LINEAR MAPPING
// ------------------------------------------------------------

function mapToRange(
    value,
    inputMin,
    inputMax,
    outputMin = 0,
    outputMax = 255
) {

    if (
        !Number.isFinite(value) ||
        inputMax === inputMin
    ) {

        return 128;
    }

    const percentage =
        (value - inputMin) /
        (inputMax - inputMin);

    const result =
        outputMin +
        percentage *
        (outputMax - outputMin);

    return Math.round(
        clamp(result, outputMin, outputMax)
    );
}

// ------------------------------------------------------------
// ELDEN BALANCED MAPPING
// 0 = minimum
// 128 = neutral
// 255 = maximum
// ------------------------------------------------------------

function mapBalanced(
    value,
    min,
    neutral,
    max
) {

    if (
        !Number.isFinite(value) ||
        min === neutral ||
        neutral === max
    ) {

        return 128;
    }

    let result;

    if (value <= neutral) {

        result =
            128 *
            ((value - min) /
            (neutral - min));

    } else {

        result =
            128 +
            127 *
            ((value - neutral) /
            (max - neutral));
    }

    return Math.round(
        clamp(result)
    );
}