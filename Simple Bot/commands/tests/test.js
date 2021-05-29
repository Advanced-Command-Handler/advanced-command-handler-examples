const {Command} = require('advanced-command-handler');

module.exports = new Command(
	{
		name: 'test',
		description: 'A simple test command.',
		aliases: ['t'],
		tags: ['ownerOnly', 'guildOnly'],
		clientPermissions: ['MANAGE_GUILD'],
		cooldown: 5,
	},
	async (handler, message) => await message.channel.send('Hello, Discord!')
);
