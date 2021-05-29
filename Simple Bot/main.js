const {CommandHandler} = require('advanced-command-handler');

CommandHandler.create({
	commandsDir: 'commands',
	eventsDir: 'events',
	prefixes: [';', 'bot!'],
})
	.setDefaultCommands()
	.setDefaultEvents()
	.launch({
		token: 'token',
	});
