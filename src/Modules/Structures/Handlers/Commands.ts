import { CommandData, CommandInterface, CommandConfig } from "../Interfaces/Command";
import { ChatInputCommandInteraction, Message } from "discord.js";
import { readdirSync, lstatSync } from "fs";
import { BrayanBot } from "../BrayanBot";
import { manager } from "../../..";
import Utils from "../../Utils";
import path from "path";

export class CommandHandler {
    public manager: BrayanBot;
    public commandDir: string;
    public commandDirFiles: string[];

    constructor(manager: BrayanBot, commandDir: string) {
        if(!manager) throw new Error("[BrayanBot/CommandHandler] Missing manager parameter.");
        if(!commandDir) throw new Error("[BrayanBot/CommandHandler] Missing commandDir parameter.");

        this.manager = manager;
        this.commandDir = commandDir;
        this.commandDirFiles = readdirSync(commandDir);

        return this;
    }

    async initialize() {
        for (let i = 0; i < this.commandDirFiles.length; i++) {
            const isDir = lstatSync(path.join(this.commandDir, this.commandDirFiles[i])).isDirectory();
            if(!isDir) continue;
            
            const dirFiles = readdirSync(path.join(this.commandDir, this.commandDirFiles[i])).filter(x => x.endsWith(".js"))
            for (let y = 0; y < dirFiles.length; y++) {
                const command: Command = require(path.join(this.commandDir, this.commandDirFiles[i], dirFiles[y])).default;
                this.manager.commands.set(command.commandData.Name, command);
            }
        }

        return this;
    }
}

export class Command {
    commandData: CommandData;
    commandConfig: CommandConfig;
    LegacyRun: ((
        manager: BrayanBot, 
        message: Message, 
        args: string[], 
        prefixUsed: string, 
        commandData: Object
    ) => any) | undefined;
    InteractionRun: ((
        manager: BrayanBot, 
        interaction: ChatInputCommandInteraction, 
        commandData: Object
    ) => any) | undefined;

    constructor(command: CommandInterface) {
        this.commandData = command.commandData;
        this.commandConfig = command.commandConfig
        if(command.LegacyRun && typeof command.LegacyRun == "function") 
            this.LegacyRun = command.LegacyRun;
        if(command.InteractionRun && typeof command.InteractionRun == "function") 
            this.InteractionRun = command.InteractionRun;

        if(this.commandData.SlashCommand?.Enabled && this.commandData.SlashCommand.Data.Name) {
            const parsedSlashCommand = Utils.setupSlashCommand(this.commandData.SlashCommand.Data);
            manager.slashCommands.set(this.commandData.SlashCommand.Data.Name, parsedSlashCommand);
        }
        manager.commands.set(command.commandData.Name, this);
        return this;
    }
}