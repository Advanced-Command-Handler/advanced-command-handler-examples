import {Command, CommandHandler, Tag} from 'advanced-command-handler';
import {Message} from 'discord.js';

export default new Command(
	{
		name: 'test',
		description: 'A simple test command',
		aliases: ['t'],
		clientPermissions: ['MANAGE_GUILD'],
		tags: [Tag.guildOnly],
		cooldown: 5
	},
	async (handler: CommandHandler, message: Message) => {
		await message.channel.send('Hello, Discord!');
	}
);
