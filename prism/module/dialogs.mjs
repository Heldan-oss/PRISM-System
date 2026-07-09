export class PrismDialogs {
    static async askRiskAmount() {
        return new Promise(resolve => {
            new Dialog({
                title: "Rischiare",
                content: `
          <form>
            <div class="form-group">
              <label>Quante etichette vuoi estrarre?</label>
              <select name="amount">
                <option value="1">1 etichetta</option>
                <option value="2">2 etichette</option>
                <option value="3">3 etichette</option>
              </select>
            </div>
          </form>
        `,
                buttons: {
                    confirm: {
                        label: "Estrai",
                        callback: html => {
                            const amount = Number(html.find("[name='amount']").val());
                            resolve(amount);
                        }
                    },
                    cancel: {
                        label: "Annulla",
                        callback: () => resolve(null)
                    }
                },
                default: "confirm",
                close: () => resolve(null)
            }).render(true);
        });
    }
}