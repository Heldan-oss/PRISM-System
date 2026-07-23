import {shuffleArray} from "./utils.mjs";

const BAG_LIMITS = Object.freeze({
	adversity: 4, fear: 3, danger: 4
});

const BAG_LIMIT_WARNING_KEYS = Object.freeze({
	adversity: "prism.bag.maxAdversities", fear: "prism.bag.maxFears", danger: "prism.bag.maxDangers"
});

const SESSION_PATHS = Object.freeze({
	initialDrawCompleted: "system.bagSession.initialDrawCompleted", riskCompleted: "system.bagSession.riskCompleted"
});

const DRAW_TYPES = Object.freeze({
	initial: "initial", risk: "risk"
});

export class BagManager {
	static getBag(actor) {
		return foundry.utils.deepClone(actor.system.bag ?? []);
	}

	static getBagSize(actor) {
		return actor.system.bag?.length ?? 0;
	}

	static countByType(bag, type) {
		return bag.filter(entry => entry.type === type).length;
	}

	static getSessionState(actor) {
		const hasEntries = this.getBagSize(actor) > 0;

		return {
			initialDrawCompleted: hasEntries && actor.system.bagSession?.initialDrawCompleted === true,

			riskCompleted: hasEntries && actor.system.bagSession?.riskCompleted === true
		};
	}

	static hasCompletedInitialDraw(actor) {
		return this.getSessionState(actor).initialDrawCompleted;
	}

	static hasCompletedRisk(actor) {
		return this.getSessionState(actor).riskCompleted;
	}

	static getViewState(actor) {
		const bagSize = this.getBagSize(actor);
		const {
			initialDrawCompleted, riskCompleted
		} = this.getSessionState(actor);

		const sessionStarted = initialDrawCompleted || riskCompleted;

		return {
			bagSize, initialDrawCompleted, riskCompleted,

			canModifyBag: !sessionStarted, canInitialDraw: !sessionStarted,

			canTakeRisk: initialDrawCompleted && !riskCompleted && bagSize > 0
		};
	}

	static validateRisk(actor) {
		if (this.getBagSize(actor) === 0) {
			this._warn("prism.bag.empty");
			return false;
		}

		const {
			initialDrawCompleted, riskCompleted
		} = this.getSessionState(actor);

		if (!initialDrawCompleted) {
			this._warn("prism.bag.riskRequiresInitialDraw");
			return false;
		}

		if (riskCompleted) {
			this._warn("prism.bag.riskAlreadyCompleted");
			return false;
		}

		return true;
	}

	static async add(actor, label) {
		return this._addEntry(actor, {
			sourceId: label?.id, name: label?.name, type: label?.type
		});
	}

	static async addGeneric(actor, label) {
		return this._addEntry(actor, {
			sourceId: null, name: label?.name, type: label?.type
		});
	}

	static async remove(actor, bagEntryId) {
		if (!this._validateBagUnlocked(actor)) {
			return false;
		}

		if (!bagEntryId) {
			return false;
		}

		const currentBag = this.getBag(actor);
		const updatedBag = currentBag.filter(entry => entry.id !== bagEntryId);

		if (updatedBag.length === currentBag.length) {
			return false;
		}

		const updateData = {
			"system.bag": updatedBag, [SESSION_PATHS.initialDrawCompleted]: false, [SESSION_PATHS.riskCompleted]: false
		};

		if (updatedBag.length === 0) {
			updateData["system.lastDraw"] = [];
		}

		await actor.update(updateData);

		return true;
	}

	static async clear(actor) {
		await actor.update({
			"system.bag": [], "system.lastDraw": [], [SESSION_PATHS.initialDrawCompleted]: false, [SESSION_PATHS.riskCompleted]: false
		});

		return true;
	}

	static async drawInitial(actor, amount = 3) {
		const bag = this.getBag(actor);
		const {
			initialDrawCompleted, riskCompleted
		} = this.getSessionState(actor);

		if (bag.length === 0) {
			this._warn("prism.bag.empty");
			return [];
		}

		if (initialDrawCompleted || riskCompleted) {
			this._warn("prism.bag.initialDrawAlreadyCompleted");

			return [];
		}

		const hasDanger = bag.some(entry => entry.type === "danger");

		if (!hasDanger) {
			this._warn("prism.bag.drawThreeRequiresDanger");

			return [];
		}

		return this._draw(actor, amount, DRAW_TYPES.initial);
	}

	static async drawRisk(actor, amount) {
		if (!this.validateRisk(actor)) {
			return [];
		}

		return this._draw(actor, amount, DRAW_TYPES.risk);
	}

	static async _addEntry(actor, {
		sourceId = null, name, type
	}) {
		if (!this._validateBagUnlocked(actor)) {
			return false;
		}

		const normalizedName = typeof name === "string" ? name.trim() : "";

		if (!normalizedName) {
			this._warn("prism.bag.labelWithoutName");
			return false;
		}

		const bag = this.getBag(actor);
		const startsNewSession = bag.length === 0;

		if (sourceId && bag.some(entry => entry.sourceId === sourceId)) {
			this._warn("prism.bag.duplicateLabel");
			return false;
		}

		if (!this._validateTypeLimit(bag, type)) {
			return false;
		}

		bag.push({
			id: foundry.utils.randomID(), sourceId, name: normalizedName, type
		});

		const updateData = {
			"system.bag": bag, [SESSION_PATHS.initialDrawCompleted]: false, [SESSION_PATHS.riskCompleted]: false
		};

		if (startsNewSession) {
			updateData["system.lastDraw"] = [];
		}

		await actor.update(updateData);

		return true;
	}

	static async _draw(actor, amount, drawType) {
		const bag = this.getBag(actor);
		const requestedAmount = Number(amount);

		if (bag.length === 0) {
			this._warn("prism.bag.empty");
			return [];
		}

		if (!Number.isInteger(requestedAmount) || requestedAmount <= 0) {
			return [];
		}

		const safeAmount = Math.min(requestedAmount, bag.length);

		const shuffledBag = shuffleArray(bag);
		const drawn = shuffledBag.slice(0, safeAmount);
		const remaining = shuffledBag.slice(safeAmount);

		const bagIsEmpty = remaining.length === 0;

		const sessionUpdate = this._getSessionUpdateAfterDraw(drawType, bagIsEmpty);

		await actor.update({
			"system.bag": remaining, "system.lastDraw": drawn, ...sessionUpdate
		});

		return drawn;
	}

	static _getSessionUpdateAfterDraw(drawType, bagIsEmpty) {
		if (bagIsEmpty) {
			return {
				[SESSION_PATHS.initialDrawCompleted]: false, [SESSION_PATHS.riskCompleted]: false
			};
		}

		if (drawType === DRAW_TYPES.initial) {
			return {
				[SESSION_PATHS.initialDrawCompleted]: true, [SESSION_PATHS.riskCompleted]: false
			};
		}

		return {
			[SESSION_PATHS.initialDrawCompleted]: true, [SESSION_PATHS.riskCompleted]: true
		};
	}

	static _validateBagUnlocked(actor) {
		const {
			initialDrawCompleted, riskCompleted
		} = this.getSessionState(actor);

		if (!initialDrawCompleted && !riskCompleted) {
			return true;
		}

		this._warn("prism.bag.bagLocked");

		return false;
	}

	static _validateTypeLimit(bag, type) {
		const limit = BAG_LIMITS[type];

		if (limit === undefined) {
			return true;
		}

		if (this.countByType(bag, type) < limit) {
			return true;
		}

		const warningKey = BAG_LIMIT_WARNING_KEYS[type];

		if (warningKey) {
			this._warn(warningKey);
		}

		return false;
	}

	static _warn(localizationKey) {
		ui.notifications.warn(game.i18n.localize(localizationKey));
	}
}