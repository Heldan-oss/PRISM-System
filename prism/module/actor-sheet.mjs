import {BagManager} from "./bag-manager.mjs";
import {DrawChat} from "./draw-chat.mjs";
import PrismDialogs from "./dialogs.mjs";
import {hasSign, normalizeSign} from "./sign-manager.mjs";
import {labelPathFromType} from "./utils.mjs";

const ACTION_HANDLERS = Object.freeze({
	"add-label": "_onAddLabel",
	"delete-label": "_onDeleteLabel",
	"add-to-bag": "_onAddToBag",
	"remove-from-bag": "_onRemoveFromBag",
	"clear-bag": "_onClearBag",
	"draw-three": "_onDrawThree",
	"risk": "_onRisk",
	"edit-sign": "_onEditSign",
	"add-fear": "_onAddFear",
	"add-danger": "_onAddDanger",
	"add-inventory-item": "_onAddInventoryItem",
	"delete-inventory-item": "_onDeleteInventoryItem"
});

const LABEL_CONFIGS = Object.freeze([{
	type: "trait",
	path: "traits"
}, {
	type: "adversity",
	path: "adversities"
}]);

const DYNAMIC_FIELD_SELECTOR = [
	".prism-label-row input",
	".prism-inventory-row input"
].join(", ");

function normalizeQuantity(value) {
	const quantity = Number.parseInt(value, 10);

	if (!Number.isInteger(quantity)) {
		return 0;
	}

	return Math.max(quantity, 0);
}

export class PrismActorSheet extends ActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(
			super.defaultOptions,
			{
				classes: ["prism", "sheet", "actor"],
				template: "systems/prism/templates/actor-character-sheet.hbs",
				width: 800,
				height: 900,
				resizable: true,

				submitOnChange: false,
				submitOnClose: true,
				closeOnSubmit: false,

				tabs: [{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "main"
				}]
			}
		);
	}

	getData(options) {
		const context = super.getData(options);
		const system = this.actor.system;

		Object.assign(context, {
			system,
			traits: (system.traits ?? []).map(trait => ({
				...trait,
				sign: normalizeSign(trait.sign)
			})),
			adversities: system.adversities ?? [],
			bag: system.bag ?? [],
			lastDraw: system.lastDraw ?? [],
			inventory: system.inventory ?? [],
			...BagManager.getViewState(this.actor)
		});

		return context;
	}

	_getSubmitData(updateData = {}) {
		const submitData = super._getSubmitData(updateData);

		const root =
			this.form ??
			this.element?.[0]?.querySelector("form");

		if (!root) {
			return submitData;
		}

		return {
			...submitData,
			...this._getLabelUpdateData(root),
			"system.inventory": this._getInventoryFromSheet(root)
		};
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.on(
			"click",
			"[data-action]",
			this._onAction.bind(this)
		);

		html.on(
			"change",
			DYNAMIC_FIELD_SELECTOR,
			this._onDynamicFieldChange.bind(this)
		);
	}

	async _onAction(event) {
		const element = event.currentTarget;
		const action = element.dataset.action;
		const handlerName = ACTION_HANDLERS[action];
		const handler = this[handlerName];

		if (typeof handler !== "function") {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		await handler.call(this, element);
	}

	async _onDynamicFieldChange() {
		try {
			await this._queueSheetSubmit();
		} catch (error) {
			console.error(
				"PRISM | Failed to save dynamic sheet data",
				error
			);
		}
	}

	async _onAddLabel(element) {
		await this._syncSheetData();

		const type = element.dataset.type;
		const path = labelPathFromType(type);

		if (!path) {
			return;
		}

		const labels = this._getSystemArray(path);

		labels.push({
			id: foundry.utils.randomID(),
			name: "",
			type,
			...(type === "trait" ? {sign: ""} : {})
		});

		await this.actor.update({
			[`system.${path}`]: labels
		});

		this.render(false);
	}

	async _onDeleteLabel(element) {
		await this._syncSheetData();

		const {type, id} = element.dataset;
		const path = labelPathFromType(type);

		if (!path || !id) {
			return;
		}

		const labels = this
			._getSystemArray(path)
			.filter(label => label.id !== id);

		await this.actor.update({
			[`system.${path}`]: labels
		});

		this.render(false);
	}

	async _onAddToBag(element) {
		await this._syncSheetData();

		const {type, id} = element.dataset;
		const path = labelPathFromType(type);

		if (!path || !id) {
			return;
		}

		const label = (this.actor.system[path] ?? [])
			.find(entry => entry.id === id);

		if (!label) {
			return;
		}

		const added = await BagManager.add(
			this.actor,
			label
		);

		this._renderIfSuccessful(added);
	}

	async _onEditSign(element) {
		await this._syncSheetData();

		const id = element.dataset.id;

		if (!id) {
			return;
		}

		const traits = this._getSystemArray("traits");
		const trait = traits.find(entry => entry.id === id);

		if (!trait || (trait.type && trait.type !== "trait")) {
			return;
		}

		if (!trait.name?.trim()) {
			ui.notifications.warn(
				game.i18n.localize("prism.sign.traitWithoutName")
			);
			return;
		}

		const existingSign = normalizeSign(trait.sign);
		const confirmed = await PrismDialogs.confirmTraitSign(
			hasSign(existingSign)
		);

		if (!confirmed) {
			return;
		}

		const proposedSign = await PrismDialogs.askTraitSign(existingSign);

		if (proposedSign === null) {
			return;
		}

		const sign = normalizeSign(proposedSign);

		if (!hasSign(sign)) {
			ui.notifications.warn(
				game.i18n.localize("prism.sign.empty")
			);
			return;
		}

		if (sign === existingSign) {
			return;
		}

		const updatedTraits = traits.map(entry => (
			entry.id === id
				? {...entry, sign}
				: entry
		));

		await this.actor.update({
			"system.traits": updatedTraits
		});

		this.render(false);
	}

	async _onRemoveFromBag(element) {
		await this._syncSheetData();

		const id = element.dataset.id;

		if (!id) {
			return;
		}

		const removed = await BagManager.remove(
			this.actor,
			id
		);

		this._renderIfSuccessful(removed);
	}

	async _onClearBag() {
		await this._syncSheetData();
		await BagManager.clear(this.actor);

		this.render(false);
	}

	async _onDrawThree() {
		await this._syncSheetData();

		const drawn = await BagManager.drawInitial(
			this.actor,
			3
		);

		await this._completeDraw(
			"prism.chat.draw",
			drawn
		);
	}

	async _onRisk() {
		await this._syncSheetData();

		if (!BagManager.validateRisk(this.actor)) {
			return;
		}

		const amount = await PrismDialogs.askRiskAmount(
			BagManager.getBagSize(this.actor)
		);

		if (!amount) {
			return;
		}

		const drawn = await BagManager.drawRisk(
			this.actor,
			amount
		);

		await this._completeDraw(
			"prism.chat.risk",
			drawn
		);
	}

	async _onAddFear() {
		await this._addGenericBagEntry(
			"fear",
			"prism.bagManager.fear"
		);
	}

	async _onAddDanger() {
		await this._addGenericBagEntry(
			"danger",
			"prism.bagManager.danger"
		);
	}

	async _addGenericBagEntry(type, localizationKey) {
		await this._syncSheetData();

		const added = await BagManager.addGeneric(
			this.actor,
			{
				name: game.i18n.localize(localizationKey),
				type
			}
		);

		this._renderIfSuccessful(added);
	}

	async _onAddInventoryItem() {
		await this._syncSheetData();

		const inventory = this._getSystemArray(
			"inventory"
		);

		inventory.push({
			id: foundry.utils.randomID(),
			name: "",
			quantity: 1
		});

		await this.actor.update({
			"system.inventory": inventory
		});

		this.render(false);
	}

	async _onDeleteInventoryItem(element) {
		await this._syncSheetData();

		const id = element.dataset.id;

		if (!id) {
			return;
		}

		const inventory = this
			._getSystemArray("inventory")
			.filter(item => item.id !== id);

		await this.actor.update({
			"system.inventory": inventory
		});

		this.render(false);
	}

	async _completeDraw(titleKey, drawn) {
		if (
			!Array.isArray(drawn) ||
			drawn.length === 0
		) {
			return false;
		}

		await DrawChat.create(
			this.actor,
			game.i18n.localize(titleKey),
			drawn
		);

		this.render(false);

		return true;
	}

	async _syncSheetData() {
		if (!this.form) {
			return false;
		}

		await this._queueSheetSubmit();

		return true;
	}

	_queueSheetSubmit() {
		const previousSubmit =
			this._sheetSubmitQueue ??
			Promise.resolve();

		const currentSubmit = previousSubmit
			.catch(() => undefined)
			.then(() => this.submit({
				preventClose: true,
				preventRender: true
			}));

		this._sheetSubmitQueue = currentSubmit;

		return currentSubmit.finally(() => {
			if (
				this._sheetSubmitQueue ===
				currentSubmit
			) {
				this._sheetSubmitQueue = null;
			}
		});
	}

	_getLabelUpdateData(root) {
		const updateData = {};

		for (const {type, path} of LABEL_CONFIGS) {
			const storedLabels = new Map(
				(this.actor.system[path] ?? [])
					.map(label => [label.id, label])
			);
			const rows = root.querySelectorAll(
				`.prism-label-row[data-type="${type}"]`
			);

			updateData[`system.${path}`] = Array.from(
				rows,
				row => {
					const id = row.dataset.id;
					const storedLabel = storedLabels.get(id) ?? {};

					return {
						...foundry.utils.deepClone(storedLabel),
						id,
						type,
						name:
							row
								.querySelector("input")
								?.value
								?.trim() ??
							"",
						...(type === "trait"
							? {sign: normalizeSign(storedLabel.sign)}
							: {})
					};
				}
			);
		}

		return updateData;
	}

	_getInventoryFromSheet(root) {
		const rows = root.querySelectorAll(
			".prism-inventory-row"
		);

		return Array.from(rows, row => {
			const inputs =
				row.querySelectorAll("input");

			return {
				id: row.dataset.id,

				name:
					inputs[0]
						?.value
						?.trim() ??
					"",

				quantity: normalizeQuantity(
					inputs[1]?.value
				)
			};
		});
	}

	_getSystemArray(path) {
		return foundry.utils.deepClone(
			this.actor.system[path] ?? []
		);
	}

	_renderIfSuccessful(successful) {
		if (successful) {
			this.render(false);
		}
	}
}
