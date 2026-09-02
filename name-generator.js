// ============================================================
// NAME GENERATOR
// Procedurally builds an original, Elden-Ring-flavored fantasy
// name from syllable banks — this never reproduces any real
// character name from the game, since it's assembled at random
// from small building blocks rather than picked from a list of
// existing names.
// Depends on: nothing.
// ============================================================

const NAME_SYLLABLES = {

    // Used when the detected/selected slider "Type" is "A".
    A: {
        onset: ["Gor", "Bran", "Thal", "Wulf", "Kaer", "Dor", "Ash", "Old", "Grim", "Vor", "Ren", "Cor"],
        middle: ["en", "al", "ar", "in", "or", "ek", "und", "yn"],
        ending: ["ric", "wyn", "gar", "dor", "mund", "thas", "ek", "ryn"]
    },

    // Used when the detected/selected slider "Type" is "B".
    B: {
        onset: ["Mira", "Ysa", "Sera", "Ama", "Vael", "Nys", "Ela", "Isol", "Thess", "Corin"],
        middle: ["a", "el", "ia", "yn", "ora", "eth"],
        ending: ["lei", "dre", "wen", "ith", "yne", "ara"]
    }

};

const NAME_EPITHETS = [
    "Ashen",
    "of the Erdtree",
    "Nameless",
    "Tarnished",
    "Hollow",
    "Bloodrend",
    "Forsaken",
    "Grave-born",
    "Flamebrand",
    "Unburnt",
    "Wanderer",
    "Duskbound"
];

function pickRandom(list) {

    return list[
        Math.floor(Math.random() * list.length)
    ];
}

function generateRandomName(genderType = "A") {

    const bank =
        NAME_SYLLABLES[genderType] ||
        NAME_SYLLABLES.A;

    const name =
        pickRandom(bank.onset) +
        pickRandom(bank.middle) +
        pickRandom(bank.ending);

    // Roughly half the time, attach an epithet for variety.
    if (Math.random() < 0.5) {

        return `${name}, ${pickRandom(NAME_EPITHETS)}`;
    }

    return name;
}