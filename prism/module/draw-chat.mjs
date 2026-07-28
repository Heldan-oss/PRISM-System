import {
	flipSignCoin,
	hasSign,
	isCoinResult,
	normalizeSign
} from "./sign-manager.mjs";
import {escapeHtml} from "./utils.mjs";

const ALLOWED_CHAT_LABEL_TYPES = new Set([
	"trait",
	"adversity",
	"fear",
	"danger"
]);

function getChatRoot(html) {
	if (html instanceof HTMLElement) {
		return html;
	}

	return html?.[0] ?? null;
}

function normalizeDrawEntry(entry) {
	const type = ALLOWED_CHAT_LABEL_TYPES.has(entry?.type)
		? entry.type
		: "unknown";

	return {
		id: entry?.id ?? foundry.utils.randomID(),
		sourceId: entry?.sourceId ?? null,
		name: typeof entry?.name === "string" ? entry.name : "",
		type,
		sign: type === "trait" ? normalizeSign(entry?.sign) : "",
		coinResult: isCoinResult(entry?.coinResult)
			? entry.coinResult
			: null
	};
}

export class DrawChat {
	static async create(actor, title, drawn) {
		const draw = {
			actorId: actor.id,
			title: String(title ?? ""),
			entries: drawn.map(entry => normalizeDrawEntry({
				...entry,
				coinResult: null
			}))
		};

		await ChatMessage.create({
			speaker: ChatMessage.getSpeaker({actor}),
			content: this._render(draw),
			flags: {
				prism: {draw}
			}
		});
	}

	static activateListeners(message, html) {
		const draw = message.getFlag("prism", "draw");

		if (!draw || !Array.isArray(draw.entries)) {
			return;
		}

		const root = getChatRoot(html);

		if (!root) {
			return;
		}

		for (const button of root.querySelectorAll("[data-prism-action='flip-sign-coin']")) {
			button.addEventListener("click", event => {
				event.preventDefault();
				event.stopPropagation();

				void this._onFlipCoin(message, button);
			});
		}
	}

	static async _onFlipCoin(message, button) {
		button.disabled = true;

		try {
			const currentMessage = game.messages.get(message.id);
			const draw = currentMessage?.getFlag("prism", "draw");
			const entryId = button.dataset.entryId;

			if (
				!currentMessage ||
				!draw ||
				!Array.isArray(draw.entries) ||
				!entryId
			) {
				this._warn("prism.chat.invalidSignFlip");
				return;
			}

			if (!this._canFlip(currentMessage)) {
				this._warn("prism.chat.signFlipForbidden");
				return;
			}

			const entries = foundry.utils.deepClone(draw.entries)
				.map(normalizeDrawEntry);
			const entry = entries.find(candidate => candidate.id === entryId);

			if (!entry || entry.type !== "trait" || !hasSign(entry.sign)) {
				this._warn("prism.chat.invalidSignFlip");
				return;
			}

			if (entry.coinResult) {
				this._warn("prism.chat.signFlipAlreadyResolved");
				return;
			}

			entry.coinResult = flipSignCoin();

			const updatedDraw = {
				...draw,
				entries
			};

			await currentMessage.update({
				content: this._render(updatedDraw),
				"flags.prism.draw": updatedDraw
			});
		} catch (error) {
			button.disabled = false;
			console.error("PRISM | Failed to resolve Sign coin flip", error);
			this._warn("prism.chat.signFlipFailed");
		}
	}

	static _canFlip(message) {
		return message.canUserModify(game.user, "update");
	}

	static _render(draw) {
		const title = escapeHtml(draw?.title);
		const entries = Array.isArray(draw?.entries)
			? draw.entries.map(normalizeDrawEntry)
			: [];

		const results = entries
			.map(entry => this._renderEntry(entry))
			.join("");

		return `
			<div class="prism-chat-card">
				<h2>${title}</h2>
				<div class="prism-chat-results">${results}</div>
			</div>
		`;
	}

	static _renderEntry(entry) {
		const name = escapeHtml(entry.name);

		if (entry.type !== "trait" || !hasSign(entry.sign)) {
			return `
				<div class="prism-chat-result">
					<span class="prism-chat-label prism-${entry.type}">
						${name}
					</span>
				</div>
			`;
		}

		const sign = escapeHtml(entry.sign);
		const signLabel = escapeHtml(game.i18n.localize("prism.chat.sign"));

		return `
			<div class="prism-chat-result prism-chat-marked-result">
				<span class="prism-chat-label prism-trait prism-chat-marked-label">
					<span aria-hidden="true">✦</span>
					${name}
				</span>
				<p class="prism-chat-sign">
					<strong>${signLabel}:</strong>
					${sign}
				</p>
				${this._renderCoinControl(entry)}
			</div>
		`;
	}

	static _renderCoinControl(entry) {
		if (entry.coinResult === "trait") {
			return `
				<div class="prism-chat-coin-result prism-chat-trait-result">
					<strong>${escapeHtml(game.i18n.localize("prism.chat.coinHeadsTrait"))}</strong>
					<span>${escapeHtml(game.i18n.localize("prism.chat.traitResultHelp"))}</span>
				</div>
			`;
		}

		if (entry.coinResult === "sign") {
			return `
				<div class="prism-chat-coin-result prism-chat-sign-result">
					<strong>${escapeHtml(game.i18n.localize("prism.chat.coinTailsSign"))}</strong>
					<span>${escapeHtml(game.i18n.localize("prism.chat.signResultHelp"))}</span>
				</div>
			`;
		}

		return `
			<button type="button"
					class="prism-chat-sign-flip"
					data-prism-action="flip-sign-coin"
					data-entry-id="${escapeHtml(entry.id)}">
				${escapeHtml(game.i18n.localize("prism.chat.flipSignCoin"))}
			</button>
		`;
	}

	static _warn(localizationKey) {
		ui.notifications.warn(game.i18n.localize(localizationKey));
	}
}
