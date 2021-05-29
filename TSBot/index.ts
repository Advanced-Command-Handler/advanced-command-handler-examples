import {CommandHandler} from 'advanced-command-handler';

process.chdir('dist');

CommandHandler.create({
	prefixes: ['!'],
	commandsDir: 'commands',
	eventsDir: 'events',
})
	.setDefaultEvents()
	.setDefaultCommands()
	.launch({
		token: 'token :)',
	});
