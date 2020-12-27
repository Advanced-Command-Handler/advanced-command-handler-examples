"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const advanced_command_handler_1 = require("advanced-command-handler");
exports.default = async (handler) => {
    function log() {
        advanced_command_handler_1.Logger.event(`Date : ${advanced_command_handler_1.Logger.setColor('yellow', new Date().toString())}`);
        advanced_command_handler_1.Logger.event(`RAM used : ${advanced_command_handler_1.Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + advanced_command_handler_1.Logger.setColor('magenta', 'MB'));
    }
    advanced_command_handler_1.Logger.event(`Client online ! Client ${advanced_command_handler_1.Logger.setColor('orange', handler.client?.user?.username)} has ${handler.client?.guilds.cache.size} guilds, it sees ${handler.client?.users.cache.size} users.`);
    log();
    setInterval(() => {
        log();
    }, 20 * 60 * 1000);
};
