const {BetterEmbed, Command, getThing} = require('advanced-command-handler');

module.exports = new Command(
	{
		name: 'help',
		description: 'A simple help command.',
		usage: 'help <command>',
		aliases: ['h'],
	},
	async (handler, message, args) => {
		const embed = new BetterEmbed();
		let command;

		if (args[0]) {
			if ((command = await getThing('command', args[0]))) {
				embed.setTitle(`Help on command: ${command.name}`);
				embed.setDescription(`_<> = Required, [] = Optional_
Category : **${command.category}**
Available in private messages : **${
					command.tags.includes('guildOnly') ? 'no' : 'yes'
				}**
${
	command.tags.includes('ownerOnly')
		? `**Only available to the owner(s).**`
		: ''
}`);
				// Feel free to handle more tags.

				embed.addField('Description : ', command.description);

				if (command.usage) embed.addField('Syntax :', command.usage);

				if (command.userPermissions) {
					embed.addField(
						'User Permissions required :',
						`${command.userPermissions.sort().join(' ')}`
					);
				}

				if (command.clientPermissions) {
					embed.addField(
						'Bot permissions required :',
						`${command.clientPermissions.sort().join(' ')}`
					);
				}

				if (command.aliases) {
					embed.addField(
						'Aliases :',
						command.aliases.sort().join(' ')
					);
				}
			}
		} else {
			embed.setTitle('handler is the list of commands :');
			embed.setDescription(
				`Type ${
					handler.prefixes[0]
				}\`help <command>\` To get info on a command\n\n${handler.commands
					.map(c => `**${c.name}** : ${c.description}`)
					.sort()
					.join('\n\n')}`
			);
		}

		await message.channel.send(embed);
	}
);
