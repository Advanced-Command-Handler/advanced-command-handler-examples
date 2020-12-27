"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const advanced_command_handler_1 = require("advanced-command-handler");
process.chdir('dist');
advanced_command_handler_1.CommandHandler.create({
    prefixes: ['!'],
    commandsDir: 'commands',
    eventsDir: 'events'
});
advanced_command_handler_1.CommandHandler.launch({
    token: 'NTk0Njg3MjM3NDkzNDg5Njk5.XRgDpg.ZuQu8SO9K8_1Fg2YqW9x35J70TQ'
});
