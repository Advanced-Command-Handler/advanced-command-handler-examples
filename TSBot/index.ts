import {CommandHandler} from 'advanced-command-handler';

process.chdir('dist');

CommandHandler.create({
	prefixes: ['!'],
	commandsDir: 'commands',
	eventsDir: 'events'
});

CommandHandler.launch({
	token: 'token :)'
});
