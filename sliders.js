// ============================================================
// SLIDERS
// Maps face measurements (m) and raw landmarks (p) to the
// full list of Elden Ring style slider values.
// ============================================================

function buildSliders(p, m, pose, faceInfo) {

    const {
        detectedType,
        detectedAge,
        detectedVoice
    } = faceInfo;

    // --- HAIR STYLE SELECTION LOGIC ---
    // 1 = Bald, 8 = Basic Male, 22 or 24 = Female styles
    let hairVal = 1;
    if (detectedType === "A") {
        hairVal = 8;
    } else {
        hairVal = m.foreheadHeight > 0.85 ? 24 : 22;
    }

    // Structure 1 - 6
    const structureVal = mapToRange(m.faceWidth / m.faceHeight, 0.75, 1.15, 1, 6);
    
    // Eyebrows 1 - 17
    const eyebrowVal = mapToRange(m.browInner, 0.3, 0.6, 1, 17);
    
    // Facial Hair 1 - 12 (Type A only, otherwise OFF)
    const beardVal = detectedType === "B" ? "OFF" : mapToRange(m.chinLength, 0.4, 0.85, 1, 12);
    
    // Eyelashes 1 - 4
    const lashesVal = mapToRange(m.eyelinerVal, 0, 255, 1, 4);

    // --- TATTOO / MARK / SCAR SELECTION ---
    // 7 = Scar, 9 = Mole, 10 = Freckles
    let tattooVal = "OFF";
    if (m.darkCirclesVal > 60) {
        tattooVal = 10;
    }

    // --- AGE SELECTION (Young, Mature, Aged) ---
    let ageText = "Young";
    if (typeof detectedAge === "number") {
        if (detectedAge > 55) {
            ageText = "Aged";
        } else if (detectedAge > 30) {
            ageText = "Mature";
        }
    }

    // --- VOICE SELECTION ---
    // Options: Young Voice 1/2, Mature Voice 1/2, Aged Voice 1/2
    let voiceText = "Young Voice 1";
    if (detectedVoice) {
        voiceText = detectedVoice;
    } else {
        if (ageText === "Aged") voiceText = "Aged Voice 1";
        else if (ageText === "Mature") voiceText = "Mature Voice 1";
    }

    // --- BODY HAIR SLIDER (0 - 255) ---
    const bodyHairVal = detectedType === "B" ? 0 : mapToRange(m.chinLength, 0.4, 0.85, 0, 200);

    // --- MUSCLE SELECTION ("Standard" or "Muscular") ---
    const muscleVal = m.jawWidth > 2.2 ? "Muscular" : "Standard";

    return [

        // ====================================================
        // BASE
        // ====================================================

        {
            category: "Base",
            name: "Name",
            val: generateRandomName(detectedType)
        },

        {
            category: "Base",
            name: "Type",
            val: detectedType
        },

        {
            category: "Base",
            name: "Age",
            val: ageText // "Young", "Mature", or "Aged"
        },

        {
            category: "Base",
            name: "Voice",
            val: voiceText // "Young Voice 1", "Mature Voice 1", etc.
        },

        // ====================================================
        // SKIN
        // ====================================================

        {
            category: "Skin",
            name: "Skin RGB",
            val: rgbString(m.skinRGB)
        },

        // ====================================================
        // ADJUST FACE TEMPLATE
        // ====================================================

        {
            category: "Adjust Face Template",
            name: "Structure",
            val: structureVal // 1 - 6
        },

        {
            category: "Adjust Face Template",
            name: "Emphasis",
            val: 0
        },

        {
            category: "Adjust Face Template",
            name: "Age",
            val: mapBalanced(m.darkCirclesVal, 0, 50, 150)
        },

        {
            category: "Adjust Face Template",
            name: "Aesthetic",
            val: mapBalanced(m.faceWidth / m.faceHeight, 0.80, 0.95, 1.10)
        },

        // ====================================================
        // FACIAL BALANCE
        // ====================================================

        {
            category: "Facial Balance",
            name: "Size",
            val: mapBalanced(m.faceHeight, CALIBRATION.faceSize.min, CALIBRATION.faceSize.neutral, CALIBRATION.faceSize.max)
        },

        {
            category: "Facial Balance",
            name: "Ratio",
            val: mapBalanced(m.faceWidth / m.faceHeight, CALIBRATION.faceRatio.min, CALIBRATION.faceRatio.neutral, CALIBRATION.faceRatio.max)
        },

        {
            category: "Facial Balance",
            name: "Protrusion",
            val: mapBalanced(p[1].z - p[10].z, -0.05, 0, 0.05)
        },

        {
            category: "Facial Balance",
            name: "Vert. Frame",
            val: mapBalanced(m.eyeVertical, 1.4, 1.8, 2.2)
        },

        {
            category: "Facial Balance",
            name: "Slant",
            val: mapBalanced(p[10].x - p[152].x, -0.05, 0, 0.05)
        },

        {
            category: "Facial Balance",
            name: "Horiz. Frame",
            val: mapBalanced(m.faceWidth, 2.2, 2.7, 3.2)
        },

        // ====================================================
        // FOREHEAD / GLABELLA
        // ====================================================

        {
            category: "Forehead/Glabella",
            name: "Depth",
            val: mapBalanced(p[10].z - p[9].z, -0.03, 0, 0.05)
        },

        {
            category: "Forehead/Glabella",
            name: "Protrusion",
            val: mapBalanced(p[1].z - p[10].z, -0.05, 0, 0.05)
        },

        {
            category: "Forehead/Glabella",
            name: "Height",
            val: mapBalanced(m.foreheadHeight, 0.5, 0.85, 1.2)
        },

        {
            category: "Forehead/Glabella",
            name: "Prot 1",
            val: mapBalanced(-p[10].z, -0.02, 0.02, 0.06)
        },

        {
            category: "Forehead/Glabella",
            name: "Prot 2",
            val: mapBalanced(-p[68].z, -0.02, 0.02, 0.06)
        },

        {
            category: "Forehead/Glabella",
            name: "Width",
            val: mapBalanced(dist2D(p[71], p[301]) / m.eyeDist, 0.9, 1.2, 1.5)
        },

        // ====================================================
        // BROW RIDGE
        // ====================================================

        {
            category: "Brow Ridge",
            name: "Height",
            val: mapBalanced(p[107].y - p[9].y, 0.02, 0.08, 0.15)
        },

        {
            category: "Brow Ridge",
            name: "Inner",
            val: mapBalanced(m.browInner, 0.3, 0.45, 0.6)
        },

        {
            category: "Brow Ridge",
            name: "Outer",
            val: mapBalanced(dist2D(p[70], p[300]) / m.eyeDist, 0.9, 1.2, 1.5)
        },

        // ====================================================
        // EYES
        // ====================================================

        {
            category: "Eyes",
            name: "Position",
            val: mapBalanced(m.eyeVertical, 1.4, 1.8, 2.2)
        },

        {
            category: "Eyes",
            name: "Size",
            val: mapBalanced(m.eyeSize, CALIBRATION.eyeSize.min, CALIBRATION.eyeSize.neutral, CALIBRATION.eyeSize.max)
        },

        {
            category: "Eyes",
            name: "Slant",
            val: mapBalanced(p[33].y - p[133].y, -0.03, 0, 0.03)
        },

        {
            category: "Eyes",
            name: "Spacing",
            val: mapBalanced(m.eyeSpacing, CALIBRATION.eyeSpacing.min, CALIBRATION.eyeSpacing.neutral, CALIBRATION.eyeSpacing.max)
        },

        // ====================================================
        // NOSE RIDGE
        // ====================================================

        {
            category: "Nose Ridge",
            name: "Depth",
            val: mapBalanced(m.noseDepth, 0.02, 0.07, 0.12)
        },

        {
            category: "Nose Ridge",
            name: "Length",
            val: mapBalanced(m.noseLength, CALIBRATION.noseLength.min, CALIBRATION.noseLength.neutral, CALIBRATION.noseLength.max)
        },

        {
            category: "Nose Ridge",
            name: "Position",
            val: mapBalanced(p[2].y - p[1].y, 0.05, 0.125, 0.20)
        },

        {
            category: "Nose Ridge",
            name: "Tip",
            val: mapBalanced(m.noseTipElevation, -0.02, 0.03, 0.08)
        },

        {
            category: "Nose Ridge",
            name: "Protrusion",
            val: mapBalanced(m.noseDepth, 0, 0.07, 0.15)
        },

        {
            category: "Nose Ridge",
            name: "Height",
            val: mapBalanced(p[2].y, 0.3, 0.45, 0.6)
        },

        {
            category: "Nose Ridge",
            name: "Slant",
            val: mapBalanced(m.noseSlant, -0.03, 0, 0.03)
        },

        // ====================================================
        // NOSTRILS
        // ====================================================

        {
            category: "Nostrils",
            name: "Slant",
            val: mapBalanced(m.noseSlant, -0.03, 0, 0.03)
        },

        {
            category: "Nostrils",
            name: "Size",
            val: mapBalanced(m.nostrilWidth, CALIBRATION.nostrilWidth.min, CALIBRATION.nostrilWidth.neutral, CALIBRATION.nostrilWidth.max)
        },

        {
            category: "Nostrils",
            name: "Width",
            val: mapBalanced(m.noseWidth, CALIBRATION.noseWidth.min, CALIBRATION.noseWidth.neutral, CALIBRATION.noseWidth.max)
        },

        // ====================================================
        // CHEEKS
        // ====================================================

        {
            category: "Cheeks",
            name: "Height",
            val: mapBalanced(m.cheekHeight, 1.1, 1.45, 1.8)
        },

        {
            category: "Cheeks",
            name: "Depth",
            val: mapBalanced(m.cheekDepth, -0.05, 0, 0.05)
        },

        {
            category: "Cheeks",
            name: "Width",
            val: mapBalanced(m.cheekWidth, CALIBRATION.cheekWidth.min, CALIBRATION.cheekWidth.neutral, CALIBRATION.cheekWidth.max)
        },

        {
            category: "Cheeks",
            name: "Protrusion",
            val: mapBalanced(-p[116].z, -0.02, 0.03, 0.08)
        },

        {
            category: "Cheeks",
            name: "Cheeks",
            val: mapBalanced(m.cheekWidth, CALIBRATION.cheekWidth.min, CALIBRATION.cheekWidth.neutral, CALIBRATION.cheekWidth.max)
        },

        // ====================================================
        // LIPS
        // ====================================================

        {
            category: "Lips",
            name: "Shape",
            val: mapBalanced(p[0].y - p[13].y, 0, 0.03, 0.06)
        },

        {
            category: "Lips",
            name: "Expression",
            val: mapBalanced(m.mouthSlant, -0.03, 0, 0.03)
        },

        {
            category: "Lips",
            name: "Fullness",
            val: mapBalanced(m.lipThickness, CALIBRATION.lipThickness.min, CALIBRATION.lipThickness.neutral, CALIBRATION.lipThickness.max)
        },

        {
            category: "Lips",
            name: "Size",
            val: mapBalanced(m.lipThickness, CALIBRATION.lipThickness.min, CALIBRATION.lipThickness.neutral, CALIBRATION.lipThickness.max)
        },

        {
            category: "Lips",
            name: "Protrusion",
            val: mapBalanced(p[0].z - p[1].z, -0.03, 0, 0.05)
        },

        {
            category: "Lips",
            name: "Thickness",
            val: mapBalanced(m.lipThickness, CALIBRATION.lipThickness.min, CALIBRATION.lipThickness.neutral, CALIBRATION.lipThickness.max)
        },

        // ====================================================
        // MOUTH
        // ====================================================

        {
            category: "Mouth",
            name: "Protrusion",
            val: mapBalanced(p[13].z - p[1].z, -0.03, 0, 0.05)
        },

        {
            category: "Mouth",
            name: "Slant",
            val: mapBalanced(m.mouthSlant, -0.03, 0, 0.03)
        },

        {
            category: "Mouth",
            name: "Occlusion",
            val: mapBalanced(p[13].y - p[14].y, -0.02, 0, 0.02)
        },

        {
            category: "Mouth",
            name: "Position",
            val: mapBalanced(p[13].y - p[2].y, 0.2, 0.35, 0.5)
        },

        {
            category: "Mouth",
            name: "Width",
            val: mapBalanced(m.mouthWidth, CALIBRATION.mouthWidth.min, CALIBRATION.mouthWidth.neutral, CALIBRATION.mouthWidth.max)
        },

        {
            category: "Mouth",
            name: "Distance",
            val: mapBalanced(p[152].y - p[13].y, 0.3, 0.5, 0.7)
        },

        // ====================================================
        // CHIN
        // ====================================================

        {
            category: "Chin",
            name: "Tip",
            val: mapBalanced(-p[152].z, -0.02, 0.02, 0.05)
        },

        {
            category: "Chin",
            name: "Length",
            val: mapBalanced(m.chinLength, CALIBRATION.chinLength.min, CALIBRATION.chinLength.neutral, CALIBRATION.chinLength.max)
        },

        {
            category: "Chin",
            name: "Protrusion",
            val: mapBalanced(m.chinProtrusion, -0.05, 0, 0.05)
        },

        {
            category: "Chin",
            name: "Depth",
            val: mapBalanced(p[152].z - p[1].z, -0.05, 0, 0.05)
        },

        {
            category: "Chin",
            name: "Size",
            val: mapBalanced(m.chinWidth, CALIBRATION.chinWidth.min, CALIBRATION.chinWidth.neutral, CALIBRATION.chinWidth.max)
        },

        {
            category: "Chin",
            name: "Height",
            val: mapBalanced(m.chinLength, CALIBRATION.chinLength.min, CALIBRATION.chinLength.neutral, CALIBRATION.chinLength.max)
        },

        {
            category: "Chin",
            name: "Width",
            val: mapBalanced(m.chinWidth, CALIBRATION.chinWidth.min, CALIBRATION.chinWidth.neutral, CALIBRATION.chinWidth.max)
        },

        // ====================================================
        // JAW
        // ====================================================

        {
            category: "Jaw",
            name: "Protrusion",
            val: mapBalanced(-p[152].z, -0.02, 0.02, 0.05)
        },

        {
            category: "Jaw",
            name: "Width",
            val: mapBalanced(m.jawWidth, CALIBRATION.jawWidth.min, CALIBRATION.jawWidth.neutral, CALIBRATION.jawWidth.max)
        },

        {
            category: "Jaw",
            name: "Lower",
            val: mapBalanced(dist2D(p[172], p[152]) / m.eyeDist, 0.5, 0.85, 1.2)
        },

        {
            category: "Jaw",
            name: "Contour",
            val: mapBalanced(m.jawWidth / m.faceWidth, 0.5, 0.70, 0.9)
        },

        // ====================================================
        // HAIR
        // ====================================================

        {
            category: "Hair",
            name: "Hair",
            val: hairVal // 1 - 37
        },

        {
            category: "Hair",
            name: "Hair RGB",
            val: rgbString(m.hairRGB)
        },

        {
            category: "Hair",
            name: "Luster",
            val: 50
        },

        {
            category: "Hair",
            name: "Roots",
            val: 0
        },

        {
            category: "Hair",
            name: "White",
            val: 0
        },

        // ====================================================
        // EYEBROWS
        // ====================================================

        {
            category: "Eyebrows",
            name: "Brow",
            val: eyebrowVal // 1 - 17
        },

        {
            category: "Eyebrows",
            name: "Brow RGB",
            val: rgbString(m.eyebrowRGB)
        },

        {
            category: "Eyebrows",
            name: "Luster",
            val: 50
        },

        {
            category: "Eyebrows",
            name: "Roots",
            val: 0
        },

        {
            category: "Eyebrows",
            name: "White",
            val: 0
        },

        // ====================================================
        // FACIAL HAIR
        // ====================================================

        {
            category: "Facial Hair",
            name: "Beard",
            val: beardVal // 1 - 12 or OFF
        },

        {
            category: "Facial Hair",
            name: "Beard RGB",
            val: rgbString(m.eyebrowRGB)
        },

        {
            category: "Facial Hair",
            name: "Luster",
            val: 50
        },

        {
            category: "Facial Hair",
            name: "Roots",
            val: 0
        },

        {
            category: "Facial Hair",
            name: "White",
            val: 0
        },

        {
            category: "Facial Hair",
            name: "Stubble",
            val: 0
        },

        // ====================================================
        // EYELASHES
        // ====================================================

        {
            category: "Eyelashes",
            name: "Lashes",
            val: lashesVal // 1 - 4
        },

        {
            category: "Eyelashes",
            name: "Lashes RGB",
            val: rgbString(m.eyebrowRGB)
        },

        // ====================================================
        // RIGHT EYE
        // ====================================================

        {
            category: "Right Eye",
            name: "Iris Size",
            val: 110
        },

        {
            category: "Right Eye",
            name: "Iris RGB",
            val: rgbString(m.rightIrisRGB)
        },

        {
            category: "Right Eye",
            name: "Clouding",
            val: 0
        },

        {
            category: "Right Eye",
            name: "Clouding RGB",
            val: "255, 255, 255"
        },

        {
            category: "Right Eye",
            name: "White RGB",
            val: "255, 255, 255"
        },

        {
            category: "Right Eye",
            name: "Position",
            val: 128
        },

        // ====================================================
        // LEFT EYE
        // ====================================================

        {
            category: "Left Eye",
            name: "Iris Size",
            val: 110
        },

        {
            category: "Left Eye",
            name: "Iris RGB",
            val: rgbString(m.leftIrisRGB)
        },

        {
            category: "Left Eye",
            name: "Clouding",
            val: 0
        },

        {
            category: "Left Eye",
            name: "Clouding RGB",
            val: "255, 255, 255"
        },

        {
            category: "Left Eye",
            name: "White RGB",
            val: "255, 255, 255"
        },

        {
            category: "Left Eye",
            name: "Position",
            val: 128
        },

        // ====================================================
        // SKIN FEATURES
        // ====================================================

        {
            category: "Skin Features",
            name: "Pores",
            val: mapToRange(m.darkCirclesVal, 0, 100, 0, 150)
        },

        {
            category: "Skin Features",
            name: "Luster",
            val: 0
        },

        {
            category: "Skin Features",
            name: "Circles",
            val: m.darkCirclesVal
        },

        {
            category: "Skin Features",
            name: "Circles RGB",
            val: `${Math.round(m.eyeUnderRGB.r * 0.7)}, ${Math.round(m.eyeUnderRGB.g * 0.7)}, ${Math.round(m.eyeUnderRGB.b * 0.7)}`
        },

        // ====================================================
        // COSMETICS
        // ====================================================

        {
            category: "Cosmetics",
            name: "Eyeliner",
            val: m.eyelinerVal
        },

        {
            category: "Cosmetics",
            name: "Eyeliner RGB",
            val: "0, 0, 0"
        },

        {
            category: "Cosmetics",
            name: "Upper",
            val: 0
        },

        {
            category: "Cosmetics",
            name: "Upper RGB",
            val: "0, 0, 0"
        },

        {
            category: "Cosmetics",
            name: "Lower",
            val: 0
        },

        {
            category: "Cosmetics",
            name: "Lower RGB",
            val: "0, 0, 0"
        },

        {
            category: "Cosmetics",
            name: "Cheeks",
            val: 0
        },

        {
            category: "Cosmetics",
            name: "Cheeks RGB",
            val: "0, 0, 0"
        },

        {
            category: "Cosmetics",
            name: "Lipstick",
            val: mapToRange(m.lipThickness, 0.01, 0.05, 50, 180)
        },

        {
            category: "Cosmetics",
            name: "Lipstick RGB",
            val: rgbString(m.lipRGB)
        },

        // ====================================================
        // TATTOO / MARK / EYEPATCH
        // ====================================================

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Tattoo",
            val: tattooVal // OFF, 7, 9, 10, or 1 - 38
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Tattoo RGB",
            val: "0, 0, 0"
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Vert.",
            val: 128
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Horiz.",
            val: 128
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Angle",
            val: 128
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Expansion",
            val: 128
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Flip",
            val: "OFF"
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Eyepatch",
            val: "OFF" // OFF, 1, 2, 3, or 4
        },

        {
            category: "Tattoo/Mark/Eyepatch",
            name: "Eyepatch RGB",
            val: "0, 0, 0"
        },

        // ====================================================
        // BODY
        // ====================================================

        {
            category: "Body",
            name: "Head",
            val: mapBalanced(m.faceWidth, 2.0, 2.6, 3.2)
        },

        {
            category: "Body",
            name: "Chest",
            val: 128
        },

        {
            category: "Body",
            name: "Abdomen",
            val: 128
        },

        {
            category: "Body",
            name: "Arms",
            val: 128
        },

        {
            category: "Body",
            name: "Legs",
            val: 128
        },

        {
            category: "Body",
            name: "Body Hair",
            val: bodyHairVal // 0 - 255 numerical range
        },

        {
            category: "Body",
            name: "Body Hair RGB",
            val: rgbString(m.hairRGB)
        },

        {
            category: "Body",
            name: "Muscle",
            val: muscleVal // "Standard" or "Muscular"
        }

    ];
}