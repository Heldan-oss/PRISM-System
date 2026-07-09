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
        trait: "Tratto",
        adversity: "Avversità",
        fear: "Paura",
        danger: "Pericolo"
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