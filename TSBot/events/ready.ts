import {Event, EventContext, Logger} from 'advanced-command-handler';
import type {Client} from 'discord.js';

export class ReadyEvent extends Event {
	override readonly name = 'ready';
	override once = true;

	override async run(ctx: EventContext<this>, _client: Client<true>) {
		function log() {
			Logger.event(`Date : ${Logger.setColor('yellow', new Date().toString())}`);
			Logger.event(
				`RAM used : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB')
			);
		}

		Logger.event(
			`Client online ! Client ${Logger.setColor('orange', ctx.client?.username)} has ${ctx.client?.guilds.cache.size} guilds, it sees ${
				ctx.client?.users.cache.size
			} users.`
		);

		log();
		setInterval(log, 20 * 60 * 1000);
	}
}
