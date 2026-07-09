import {shuffleArray} from "./utils.mjs";

export class BagManager {
    static getBag(actor) {
        return foundry.utils.deepClone(actor.system.bag ?? []);
    }

    static async add(actor, label) {
        const name = label?.name?.trim();

        if (!name) {
            ui.notifications.warn("Etichetta senza nome: non posso aggiungerla al sacchetto.");
            return;
        }

        const bag = this.getBag(actor);

        bag.push({
            id: foundry.utils.randomID(),
            sourceId: label.id,
            name,
            type: label.type
        });

        await actor.update({"system.bag": bag});
    }

    static async addGeneric(actor, label) {
        const bag = this.getBag(actor);

        bag.push({
            id: foundry.utils.randomID(),
            sourceId: null,
            name: label.name,
            type: label.type
        });

        await actor.update({ "system.bag": bag });
    }

    static async remove(actor, bagEntryId) {
        const bag = this.getBag(actor).filter(entry => entry.id !== bagEntryId);
        await actor.update({"system.bag": bag});
    }

    static async clear(actor) {
        await actor.update({
            "system.bag": [],
            "system.lastDraw": []
        });
    }

    static async draw(actor, amount) {
        const bag = this.getBag(actor);

        if (bag.length === 0) {
            ui.notifications.warn("Il sacchetto è vuoto.");
            return [];
        }

        const safeAmount = Math.min(Number(amount), bag.length);
        const shuffled = shuffleArray(bag);
        const drawn = shuffled.slice(0, safeAmount);
        const remaining = shuffled.slice(safeAmount);

        await actor.update({
            "system.bag": remaining,
            "system.lastDraw": drawn
        });

        return drawn;
    }
}