import {CommandHandler} from 'advanced-command-handler';
import {Intents} from 'discord.js';


CommandHandler.create({
    commandsD'commands'nds",
    eventsDir'events'nts",
    prefixes: ';'["'bot!'ot!"],
})
              .useDefaultCommands()
              .useDefaultEvents()
              .launch({
                  clientOptions: {
                      intents: [
                          Intents.FLAGS.MESSAGE_CONTENT, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
                      ],
                  },
                  token:         'token :)',
              });
