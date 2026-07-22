class PrismDialogs {
    static async askRiskAmount() {
        return new Promise(resolve => {
            new Dialog({
                title: game.i18n.localize("prism.dialog.risk"),
                content: `
          <form>
            <div class="form-group">
              <label>${game.i18n.localize("prism.dialog.qLabels")}</label>
              <select name="amount">
                <option value="1">${game.i18n.localize("prism.dialog.fLabel")}</option>
                <option value="2">${game.i18n.localize("prism.dialog.sLabel")}</option>
                <option value="3">${game.i18n.localize("prism.dialog.tLabel")}</option>
              </select>
            </div>
          </form>
        `,
                buttons: {
                    confirm: {
                        label: game.i18n.localize("prism.dialog.extract"),
                        callback: html => {
                            const amount = Number(html.find("[name='amount']").val());
                            resolve(amount);
                        }
                    },
                    cancel: {
                        label: game.i18n.localize("prism.dialog.cancel"),
                        callback: () => resolve(null)
                    }
                },
                default: "confirm",
                close: () => resolve(null)
            }).render(true);
        });
    }
}

export default PrismDialogs