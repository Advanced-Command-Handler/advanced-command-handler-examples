const {Command, argError} = require('advanced-command-handler');

module.exports = new Command(
	{
		aliases: ['speak'],
		description: 'Make the bot say something.',
		usage: 'say <text>',
		name: 'say',
		userPermissions: ['MANAGE_MESSAGES'],
	},
	async (handler, message, args) => {
		args.length > 0
			? await message.channel.send(args.join(' '))
			: await argError(message, 'You must specify text to say.', this);
	}
);
