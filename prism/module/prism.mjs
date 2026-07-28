import { PrismActorSheet } from "./actor-sheet.mjs";
import { DrawChat } from "./draw-chat.mjs";

Hooks.once("init", () => {
    console.log("PRISM | Init");

    Actors.unregisterSheet("core", ActorSheet);

    Actors.registerSheet("prism", PrismActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: game.i18n.localize("prism.sheet.plabel")
    });

    const chatRenderHook = game.release.generation >= 13
        ? "renderChatMessageHTML"
        : "renderChatMessage";

    Hooks.on(chatRenderHook, (message, html) => {
        DrawChat.activateListeners(message, html);
    });
});
