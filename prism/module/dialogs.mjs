import {escapeHtml} from "./utils.mjs";

class PrismDialogs {
	static async confirmTraitSign(hasExistingSign) {
		return new Promise(resolve => {
			let completed = false;

			const finish = value => {
				if (completed) {
					return;
				}

				completed = true;
				resolve(value);
			};

			const questionKey = hasExistingSign
				? "prism.dialog.confirmSignEdit"
				: "prism.dialog.confirmSign";

			new Dialog({
				title: game.i18n.localize("prism.dialog.signTitle"),
				content: `
					<p>${escapeHtml(game.i18n.localize(questionKey))}</p>
				`,
				buttons: {
					confirm: {
						label: game.i18n.localize("prism.dialog.yes"),
						callback: () => finish(true)
					},
					cancel: {
						label: game.i18n.localize("prism.dialog.no"),
						callback: () => finish(false)
					}
				},
				default: "confirm",
				close: () => finish(false)
			}).render(true);
		});
	}

	static async askTraitSign(existingSign = "") {
		return new Promise(resolve => {
			let completed = false;

			const finish = value => {
				if (completed) {
					return;
				}

				completed = true;
				resolve(value);
			};

			new Dialog({
				title: game.i18n.localize("prism.dialog.signTitle"),
				content: `
					<form>
						<div class="form-group">
							<label>
								${escapeHtml(game.i18n.localize("prism.dialog.signPrompt"))}
							</label>
							<input type="text"
								   name="sign"
								   value="${escapeHtml(existingSign)}"
								   autocomplete="off">
						</div>
					</form>
				`,
				buttons: {
					save: {
						label: game.i18n.localize("prism.dialog.save"),
						callback: html => {
							const sign = html.find("[name='sign']").val();
							finish(typeof sign === "string" ? sign : "");
						}
					},
					cancel: {
						label: game.i18n.localize("prism.dialog.cancel"),
						callback: () => finish(null)
					}
				},
				default: "save",
				close: () => finish(null)
			}).render(true);
		});
	}

	static async askRiskAmount(availableAmount) {
		const maxAmount = Math.min(Math.max(Number.parseInt(availableAmount, 10) || 0, 0), 3);

		if (maxAmount === 0) {
			return null;
		}

		const labelKeys = {
			1: "prism.dialog.fLabel", 2: "prism.dialog.sLabel", 3: "prism.dialog.tLabel"
		};

		const options = Array.from({length: maxAmount}, (_, index) => {
			const amount = index + 1;
			const label = game.i18n.localize(labelKeys[amount]);

			return `
                    <option value="${amount}">
                        ${label}
                    </option>
                `;
		}).join("");

		return new Promise(resolve => {
			let completed = false;

			const finish = value => {
				if (completed) {
					return;
				}

				completed = true;
				resolve(value);
			};

			new Dialog({
				title: game.i18n.localize("prism.dialog.risk"),

				content: `
                    <form>
                        <div class="form-group">
                            <label>
                                ${game.i18n.localize("prism.dialog.qLabels")}
                            </label>

                            <select name="amount">
                                ${options}
                            </select>
                        </div>
                    </form>
                `,

				buttons: {
					confirm: {
						label: game.i18n.localize("prism.dialog.extract"),

						callback: html => {
							const amount = Number(html
								.find("[name='amount']")
								.val());

							finish(amount);
						}
					},

					cancel: {
						label: game.i18n.localize("prism.dialog.cancel"),

						callback: () => finish(null)
					}
				},

				default: "confirm", close: () => finish(null)
			}).render(true);
		});
	}
}

export default PrismDialogs;
