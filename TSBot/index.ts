import {CommandHandler} from 'advanced-command-handler';
import {Intents} from 'discord.js';

process.chdir('dist');

CommandHandler.create({
	prefixes: ['!'],
	commandsDir: 'commands',
	eventsDir: 'events',
})
	.useDefaultEvents()
	.useDefaultCommands()
	.launch({
		clientOptions: {
			intents: [Intents.FLAGS.MESSAGE_CONTENT, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		},
		token: 'token :)',
	});
