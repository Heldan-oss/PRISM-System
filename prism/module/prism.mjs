import { PrismActorSheet } from "./actor-sheet.mjs";

Hooks.once("init", () => {
    console.log("PRISM | Init");

    Actors.unregisterSheet("core", ActorSheet);

    Actors.registerSheet("prism", PrismActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: game.i18n.localize("prism.sheet.plabel")
    });
});