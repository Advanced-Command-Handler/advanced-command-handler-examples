const {CommandHandler} = require('advanced-command-handler');

CommandHandler.create({
	commandsDir: 'commands',
	eventsDir: 'events',
	prefixes: [';', 'bot!'],
});

CommandHandler.launch({
	token: 'NTk0Njg3MjM3NDkzNDg5Njk5.XRgDpg.e160g3E9v2wtulkY5TTbnyhPP4w',
});
