"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const advanced_command_handler_1 = require("advanced-command-handler");
exports.default = new advanced_command_handler_1.Command({
    name: 'test',
    description: 'A simple test command',
    aliases: ['t'],
    clientPermissions: ['MANAGE_GUILD'],
    tags: [advanced_command_handler_1.Tag.guildOnly],
    cooldown: 5
}, async (handler, message) => {
    await message.channel.send('Hello, Discord!');
});
