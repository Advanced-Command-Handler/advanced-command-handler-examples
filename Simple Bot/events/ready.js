const {dayjs, Event, Logger} = require('advanced-command-handler');

module.exports = new Event(
	{
		name: 'ready',
		once: true,
	},
	async handler => {
		/**
		 * Log information of the bot in the console.
		 * @returns {void}
		 */
		function log() {
			Logger.event(
				`Date : ${Logger.setColor('yellow', dayjs().format('LTS'))}`
			);
			Logger.event(
				`RAM used  : ${Logger.setColor(
					'magenta',
					(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
				)} ` + Logger.setColor('magenta', 'MB')
			);
		}

		Logger.event(
			Logger.setColor(
				'#c0433f',
				`Client online ! Client ${Logger.setColor(
					'orange',
					handler.client.user.username
				)} has ${handler.client.guilds.cache.size} guilds, it sees ${
					handler.client.users.cache.size
				} users.`
			)
		);

		log();
		setInterval(log, 20 * 60 * 1000);
	}
);
