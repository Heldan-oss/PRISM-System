import { BagManager } from "./bag-manager.mjs";
import { PrismDialogs } from "./dialogs.mjs";
import { labelPathFromType } from "./utils.mjs";

export class PrismActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["prism", "sheet", "actor"],
            template: "systems/prism/templates/actor-character-sheet.hbs",
            width: 760,
            height: 820,
            resizable: true,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "main"
                }
            ]
        });
    }

    getData(options) {
        const context = super.getData(options);

        context.system = this.actor.system;
        context.traits = this.actor.system.traits ?? [];
        context.adversities = this.actor.system.adversities ?? [];
        context.bag = this.actor.system.bag ?? [];
        context.lastDraw = this.actor.system.lastDraw ?? [];
        context.inventory = this.actor.system.inventory ?? [];

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find("[data-action='add-label']").on("click", this._onAddLabel.bind(this));
        html.find("[data-action='delete-label']").on("click", this._onDeleteLabel.bind(this));
        html.find("[data-action='add-to-bag']").on("click", this._onAddToBag.bind(this));
        html.find("[data-action='remove-from-bag']").on("click", this._onRemoveFromBag.bind(this));
        html.find("[data-action='clear-bag']").on("click", this._onClearBag.bind(this));
        html.find("[data-action='draw-three']").on("click", this._onDrawThree.bind(this));
        html.find("[data-action='risk']").on("click", this._onRisk.bind(this));
        html.find("[data-action='add-fear']").on("click", this._onAddFear.bind(this));
        html.find("[data-action='add-danger']").on("click", this._onAddDanger.bind(this));
        html.find("[data-action='add-inventory-item']").on("click", this._onAddInventoryItem.bind(this));
        html.find("[data-action='delete-inventory-item']").on("click", this._onDeleteInventoryItem.bind(this));
    }

    async _onAddLabel(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const type = event.currentTarget.dataset.type;
        const path = labelPathFromType(type);

        if (!path) return;

        const current = foundry.utils.deepClone(this.actor.system[path] ?? []);

        current.push({
            id: foundry.utils.randomID(),
            name: "",
            type
        });

        await this.actor.update({ [`system.${path}`]: current });
        this.render(false);
    }

    async _onDeleteLabel(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const type = event.currentTarget.dataset.type;
        const id = event.currentTarget.dataset.id;
        const path = labelPathFromType(type);

        if (!path || !id) return;

        const current = foundry.utils.deepClone(this.actor.system[path] ?? []);
        const updated = current.filter(label => label.id !== id);

        await this.actor.update({ [`system.${path}`]: updated });
        this.render(false);
    }

    async _onAddToBag(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const button = event.currentTarget;
        const type = button.dataset.type;
        const id = button.dataset.id;
        const path = labelPathFromType(type);

        if (!path || !id) return;

        const labels = this.actor.system[path] ?? [];
        const label = labels.find(entry => entry.id === id);

        if (!label) return;

        await BagManager.add(this.actor, label);
        this.render(false);
    }

    async _onRemoveFromBag(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const id = event.currentTarget.dataset.id;
        if (!id) return;

        await BagManager.remove(this.actor, id);
        this.render(false);
    }

    async _onClearBag(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        await BagManager.clear(this.actor);
        this.render(false);
    }

    async _onDrawThree(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const drawn = await BagManager.draw(this.actor, 3);

        if (drawn.length > 0) {
            await this._sendDrawToChat("Estrazione PRISM", drawn);
            this.render(false);
        }
    }

    async _onRisk(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const amount = await PrismDialogs.askRiskAmount();
        if (!amount) return;

        const drawn = await BagManager.draw(this.actor, amount);

        if (drawn.length > 0) {
            await this._sendDrawToChat("Rischio PRISM", drawn);
            this.render(false);
        }
    }

    async _onAddFear(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        await BagManager.addGeneric(this.actor, {
            name: "Paura",
            type: "fear"
        });

        this.render(false);
    }

    async _onAddDanger(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        await BagManager.addGeneric(this.actor, {
            name: "Pericolo",
            type: "danger"
        });

        this.render(false);
    }

    async _onAddInventoryItem(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const inventory = foundry.utils.deepClone(this.actor.system.inventory ?? []);

        inventory.push({
            id: foundry.utils.randomID(),
            name: "",
            quantity: 1
        });

        await this.actor.update({ "system.inventory": inventory });
        this.render(false);
    }

    async _onDeleteInventoryItem(event) {
        event.preventDefault();
        event.stopPropagation();

        await this._syncSheetData();

        const id = event.currentTarget.dataset.id;
        if (!id) return;

        const inventory = foundry.utils.deepClone(this.actor.system.inventory ?? []);
        const updated = inventory.filter(item => item.id !== id);

        await this.actor.update({ "system.inventory": updated });
        this.render(false);
    }

    async _sendDrawToChat(title, drawn) {
        const labels = drawn.map(entry => {
            return `<span class="prism-chat-label prism-${entry.type}">${entry.name}</span>`;
        }).join(" ");

        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: `
                <div class="prism-chat-card">
                    <h2>${title}</h2>
                    <p>${labels}</p>
                </div>
            `
        });
    }

    async _syncSheetData() {
        const root = this.element[0];
        if (!root) return;

        const updateData = {
            ...this._getLabelUpdateData(root),
            "system.inventory": this._getInventoryFromSheet(root)
        };

        await this.actor.update(updateData);
    }

    _getLabelUpdateData(root) {
        const configs = [
            { type: "trait", path: "traits" },
            { type: "adversity", path: "adversities" }
        ];

        const updateData = {};

        for (const config of configs) {
            const rows = root.querySelectorAll(`.prism-label-row[data-type="${config.type}"]`);

            updateData[`system.${config.path}`] = Array.from(rows).map(row => ({
                id: row.dataset.id,
                type: config.type,
                name: row.querySelector("input")?.value?.trim() ?? ""
            }));
        }

        return updateData;
    }

    _getInventoryFromSheet(root) {
        const rows = root.querySelectorAll(".prism-inventory-row");

        return Array.from(rows).map(row => {
            const inputs = row.querySelectorAll("input");

            return {
                id: row.dataset.id,
                name: inputs[0]?.value?.trim() ?? "",
                quantity: Number(inputs[1]?.value ?? 0)
            };
        });
    }
}