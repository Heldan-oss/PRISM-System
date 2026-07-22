export function labelPathFromType(type) {
    const paths = {
        trait: "traits",
        adversity: "adversities",
        fear: "fears",
        danger: "dangers"
    };

    return paths[type];
}

export function labelTypeLabel(type) {
    const labels = {
        trait: game.i18n.localize("prism.sheet.trait"),
        adversity: game.i18n.localize("prism.sheet.adversity"),
        fear: game.i18n.localize("prism.sheet.fear"),
        danger: game.i18n.localize("prism.sheet.danger"),
    };

    return labels[type] ?? type;
}

export function shuffleArray(array) {
    const copy = foundry.utils.deepClone(array);

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}