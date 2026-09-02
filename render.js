// ============================================================
// RENDER
// Draws the slider list (and an optional pose warning) into
// #sliders-grid.
// ============================================================

function renderResults(sliders, pose, poseWarning) {

    const slidersGrid = document.getElementById("sliders-grid");
    const resultsContainer = document.getElementById("results-container");

    slidersGrid.innerHTML = "";

    if (poseWarning) {

        const warning = document.createElement("div");
        warning.className = "analysis-warning";

        warning.innerHTML = `
            <strong>⚠️ Photo isn't fully front-facing</strong>
            <br>
            Yaw: ${pose.yaw.toFixed(1)}° | Pitch: ${pose.pitch.toFixed(1)}° | Roll: ${pose.roll.toFixed(1)}°
            <br><br>
            For the most accurate sliders, use a photo taken face-on.
        `;

        slidersGrid.appendChild(warning);
    }

    const typeItem = sliders.find(
        (item) => item.category === "Base" && item.name === "Type"
    );

    const genderType = typeItem ? typeItem.val : "A";

    // Sliders and option lists that SHOULD NOT display the "/ 255" suffix badge
    // Note: "Age" is removed so Adjust Face Template > Age (number) gets the badge.
    const no255List = [
        "Name", "Type", "Voice", "Skin RGB",
        "Structure", "Hair", "Brow", "Beard", "Lashes", "Tattoo",
        "Hair RGB", "Brow RGB", "Beard RGB", "Lashes RGB", "Circles RGB",
        "Eyeliner RGB", "Upper RGB", "Lower RGB", "Cheeks RGB", "Lipstick RGB",
        "Tattoo RGB", "Eyepatch RGB", "Body Hair RGB", "Muscle", "Flip", "Eyepatch"
    ];

    sliders.forEach((item) => {

        const card = document.createElement("div");
        card.className = "slider-card";

        const category = document.createElement("span");
        category.className = "slider-category";
        category.textContent = item.category;

        const name = document.createElement("span");
        name.className = "slider-name";
        name.textContent = item.name;

        const valueContainer = document.createElement("div");
        valueContainer.className = "slider-val-container";

        const value = document.createElement("span");
        value.className = "slider-val";
        value.textContent = item.val;

        valueContainer.appendChild(value);

        // Append "/ 255" badge only if this item is a 0-255 numerical slider
        const isExcluded = no255List.includes(item.name) || (typeof item.val === "string" && item.val.includes(","));
        
        if (!isExcluded && typeof item.val === "number") {
            const maxTag = document.createElement("span");
            maxTag.className = "slider-max-tag";
            maxTag.textContent = "/ 255";
            valueContainer.appendChild(maxTag);
        }

        card.appendChild(category);
        card.appendChild(name);
        card.appendChild(valueContainer);

        // Base > Name card gets a reroll button
        if (item.category === "Base" && item.name === "Name") {

            const rerollBtn = document.createElement("button");
            rerollBtn.type = "button";
            rerollBtn.className = "reroll-btn";
            rerollBtn.setAttribute("aria-label", "Generate a new random name");
            rerollBtn.textContent = "🎲";

            rerollBtn.addEventListener("click", () => {
                const newName = generateRandomName(genderType);
                item.val = newName;
                value.textContent = newName;
            });

            card.appendChild(rerollBtn);
        }

        slidersGrid.appendChild(card);
    });

    resultsContainer.hidden = false;
}