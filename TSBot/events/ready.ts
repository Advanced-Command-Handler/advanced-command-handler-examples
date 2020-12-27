import {CommandHandler, Logger} from 'advanced-command-handler';

export default async (handler: CommandHandler) => {
	function log() {
		Logger.event(`Date : ${Logger.setColor('yellow', new Date().toString())}`);
		Logger.event(`RAM used : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB'));
	}

	Logger.event(
		`Client online ! Client ${Logger.setColor('orange', handler.client?.user?.username)} has ${handler.client?.guilds.cache.size} guilds, it sees ${
			handler.client?.users.cache.size
		} users.`
	);

	log();
	setInterval(() => {
		log();
	}, 20 * 60 * 1000);
}
