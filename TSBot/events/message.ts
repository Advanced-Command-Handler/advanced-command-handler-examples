import {
	argError,
	BetterEmbed,
	Command,
	CommandHandler,
	CommandHandlerError,
	DataType,
	getThing,
	Logger,
	Tag
} from 'advanced-command-handler';
import {GuildChannel, Message, PermissionResolvable, Permissions, TextChannel} from 'discord.js';

function verifyPerms(message: Message, command: Command) {
	const clientMissingPermissions: PermissionResolvable[] = [];
	const userMissingPermissions: PermissionResolvable[] = [];
	if (!message.guild)
		return {
			client: clientMissingPermissions,
			user: userMissingPermissions
		};

	if (!message.guild.me?.hasPermission('ADMINISTRATOR')) {
		command.clientPermissions.forEach(permission => {
			if (!Permissions.FLAGS[permission]) {
				throw new CommandHandlerError(
					'eventMessage',
					`Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`
				);
			}

			if (message.channel instanceof TextChannel && !message.channel?.permissionsFor(message.guild?.me!!)?.has(permission, false)) {
				clientMissingPermissions.push(permission);
			}
		});
	}

	command.userPermissions.forEach(permission => {
		if (!Permissions.FLAGS[permission]) {
			throw new CommandHandlerError(
				'eventMessage',
				`Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`
			);
		}

		if (message.channel instanceof TextChannel && !message.channel?.permissionsFor(message.member!!)?.has(permission, false)) {
			userMissingPermissions.push(permission);
		}
	});

	return {
		client: clientMissingPermissions,
		user: userMissingPermissions
	};
}

function missingPermission(permissions: PermissionResolvable[], client: boolean = false): BetterEmbed {
	const embed = new BetterEmbed();
	embed.setColor('#ecc333');
	embed.setTitle(client ? 'The bot is missing permissions.' : 'The member is missing permissions.');
	embed.setDescription(`These permissions are missing for the command to succeed : ${permissions}`);

	return embed;
}

function verifyTags(command: Command, message: Message): Promise<Message> {
	let error = '';
	for (const tag of command.tags) {
		if (tag === Tag.ownerOnly && !CommandHandler.instance?.owners?.includes(message.author.id)) error = 'This command is only available to the owners of the bot.';
		if (tag === Tag.nsfw && message.channel instanceof GuildChannel && !message.channel.nsfw) error = 'This command is only available in nsfw channels.';
		if (tag === Tag.guildOnly && message.guild === null) error = 'This command is only available in a guild.';
		if (tag === Tag.guildOwnerOnly && message.guild?.ownerID !== message.author.id) error = `This command is only available for <@${message.guild?.ownerID}>`;
		if (tag === Tag.dmOnly && message.guild !== null) error = 'This command is only available in dm.';
	}

	return argError(message, error, command);
}

export default async (handler: CommandHandler, message: Message) => {
	if (message.author.bot || message.system) return;

	let prefix = '';
	for (const thisPrefix of handler.prefixes ?? []) {
		if (message.content.startsWith(thisPrefix)) {
			prefix = thisPrefix;
		}
	}

	const messageToString = message.content.length > 1024
	                        ? message.content.substring(0, 1021) + '...'
	                        : message.content;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	/**
	 * The command that have been searched through the message content.
	 * @type {Command | null} -
	 */
	const cmd = await getThing(DataType.command, args[0].toLowerCase().normalize());
	args.shift();

	if (prefix) {
		if (message.content === prefix) return message.channel.send(`The current bot prefixes are : \n\`${handler.prefixes?.join('\n')}\``);

		if (cmd) {
			await verifyTags(cmd, message);

			if (!handler.client?.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.tags.includes(Tag.ownerOnly))) {
				await message.channel.send('You are not the creator of the bot. You do not have the right to use this command.');
				return Logger.log(
					`${Logger.setColor('magenta', message.author.tag)} tried the ownerOnly command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild?.name)}.`
				);
			}

			if (message.guild) {
				Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`);

				const verified = verifyPerms(message, cmd);
				if (verified.client.length > 0) return message.channel.send({embed: missingPermission(verified.client, true)});
				if (verified.user.length > 0) return message.channel.send({embed: missingPermission(verified.user)});

				if (cmd.tags.includes(Tag.nsfw) && message.channel instanceof TextChannel && !message.channel.nsfw) {
					const embed = BetterEmbed.fromTemplate('title', {
						title: 'Error :',
						description: 'NSFW commands are only available on nsfw channels.'
					});

					await message.channel.send(embed);
				}
			} else {
				Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} in private messages.`);
				if (cmd.tags.includes(Tag.guildOnly)) {
					await message.channel.send('The command is only available on a guild.');
					return Logger.log(`${Logger.setColor('magenta', message.author.tag)} tried the command ${Logger.setColor('gold', cmd.name)} only available on guild but in private.`);
				}
			}

			if (handler.cooldowns.has(message.author.id)) {
				return message.channel.send(`This command has a cooldown, wait \`${handler.cooldowns.get(message.author.id)}\` seconds and try again.`);
			} else if (cmd.cooldown > 0) {
				handler.cooldowns.set(message.author.id, cmd.cooldown);
				setTimeout(() => {
					handler.cooldowns.delete(message.author.id);
				}, cmd.cooldown * 1000);
			}
			try {
				cmd.run(handler, message, args);
			} catch (warning) {
				Logger.warn(`A small error was made somewhere with the command ${Logger.setColor('gold', cmd.name)}.
Date : ${Logger.setColor('yellow', new Date().toString())}${Logger.setColor('red', '\nError : ' + warning.stack)}`);

				if (handler.client?.isOwner(message.author.id)) {
					const embedLog = new BetterEmbed();
					embedLog.setColor('#dd0000');
					embedLog.setDescription('An error occurred with the command : **' + cmd.name + '**.');
					embedLog.addField('Informations :',
						`\nSent by : ${message.author} (\`${message.author.id}\`)\n\nOnto : **${message.guild?.name}** (\`${message.guild?.id}\`)\n\nInto : ${message.channel} (\`${message.channel.id})\``
					);

					embedLog.addField(
						'Error :',
						warning.stack.length > 1024 ? warning.stack.substring(0, 1021) + '...' : warning.stack
					);

					embedLog.addField(
						'Message :',
						messageToString
					);

					return message.channel.send(embedLog);
				}
			}
		}
	}
}
