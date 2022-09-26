import { Command } from "../../Modules/Structures/Handlers/Commands";
import { InteractionReplyOptions } from "discord.js";
import Utils from "../../Modules/Utils";
import { manager } from "../../index";
import ms from "ms";

export default new Command({
    commandData: manager.configs.commands.General.Ping,
    commandConfig: {
        dmOnly: false,
        guildOnly: false,
        requiredPermissions: {
            user: [],
            bot: []
        }
    },
    LegacyRun: async (manager, message, args, prefixUsed, commandData) => {
        const ping = Math.round((Date.now() - message.createdTimestamp) / 1000);
        const apiPing = Math.round(manager.ws.ping);

        message.reply(Utils.setupMessage({
            configPath: manager.configs.lang.General.Ping,
            variables: [
                { searchFor: /{ping}/g, replaceWith: ms(ping, { long: true }) },
                { searchFor: /{apiPing}/g, replaceWith: ms(apiPing, { long: true }) },
            ]
        }));
    },
    InteractionRun: async (manager, interaction, options, commandData) => {
        const ping = Date.now() - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);
        
        interaction.reply(Utils.setupMessage({
            configPath: manager.configs.lang.General.Ping,
            variables: [
                { searchFor: /{ping}/g, replaceWith: ms(ping, { long: true }) },
                { searchFor: /{apiPing}/g, replaceWith: ms(apiPing, { long: true }) },
            ]
        }) as InteractionReplyOptions);
    },
});