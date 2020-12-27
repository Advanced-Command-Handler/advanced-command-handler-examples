"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const advanced_command_handler_1 = require("advanced-command-handler");
const discord_js_1 = require("discord.js");
function verifyPerms(message, command) {
    const clientMissingPermissions = [];
    const userMissingPermissions = [];
    if (!message.guild)
        return {
            client: clientMissingPermissions,
            user: userMissingPermissions
        };
    if (!message.guild.me?.hasPermission('ADMINISTRATOR')) {
        command.clientPermissions.forEach(permission => {
            if (!discord_js_1.Permissions.FLAGS[permission]) {
                throw new advanced_command_handler_1.CommandHandlerError('eventMessage', `Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`);
            }
            if (message.channel instanceof discord_js_1.TextChannel && !message.channel?.permissionsFor(message.guild?.me)?.has(permission, false)) {
                clientMissingPermissions.push(permission);
            }
        });
    }
    command.userPermissions.forEach(permission => {
        if (!discord_js_1.Permissions.FLAGS[permission]) {
            throw new advanced_command_handler_1.CommandHandlerError('eventMessage', `Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`);
        }
        if (message.channel instanceof discord_js_1.TextChannel && !message.channel?.permissionsFor(message.member)?.has(permission, false)) {
            userMissingPermissions.push(permission);
        }
    });
    return {
        client: clientMissingPermissions,
        user: userMissingPermissions
    };
}
function missingPermission(permissions, client = false) {
    const embed = new advanced_command_handler_1.BetterEmbed();
    embed.setColor('#ecc333');
    embed.setTitle(client ? 'The bot is missing permissions.' : 'The member is missing permissions.');
    embed.setDescription(`These permissions are missing for the command to succeed : ${permissions}`);
    return embed;
}
function verifyTags(command, message) {
    let error = '';
    for (const tag of command.tags) {
        if (tag === advanced_command_handler_1.Tag.ownerOnly && !advanced_command_handler_1.CommandHandler.instance?.owners?.includes(message.author.id))
            error = 'This command is only available to the owners of the bot.';
        if (tag === advanced_command_handler_1.Tag.nsfw && message.channel instanceof discord_js_1.GuildChannel && !message.channel.nsfw)
            error = 'This command is only available in nsfw channels.';
        if (tag === advanced_command_handler_1.Tag.guildOnly && message.guild === null)
            error = 'This command is only available in a guild.';
        if (tag === advanced_command_handler_1.Tag.guildOwnerOnly && message.guild?.ownerID !== message.author.id)
            error = `This command is only available for <@${message.guild?.ownerID}>`;
        if (tag === advanced_command_handler_1.Tag.dmOnly && message.guild !== null)
            error = 'This command is only available in dm.';
    }
    return advanced_command_handler_1.argError(message, error, command);
}
exports.default = async (handler, message) => {
    if (message.author.bot || message.system)
        return;
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
    const cmd = await advanced_command_handler_1.getThing(advanced_command_handler_1.DataType.command, args[0].toLowerCase().normalize());
    args.shift();
    if (prefix) {
        if (message.content === prefix)
            return message.channel.send(`The current bot prefixes are : \n\`${handler.prefixes?.join('\n')}\``);
        if (cmd) {
            await verifyTags(cmd, message);
            if (!handler.client?.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.tags.includes(advanced_command_handler_1.Tag.ownerOnly))) {
                await message.channel.send('You are not the creator of the bot. You do not have the right to use this command.');
                return advanced_command_handler_1.Logger.log(`${advanced_command_handler_1.Logger.setColor('magenta', message.author.tag)} tried the ownerOnly command ${advanced_command_handler_1.Logger.setColor('gold', cmd.name)} on the guild ${advanced_command_handler_1.Logger.setColor('teal', message.guild?.name)}.`);
            }
            if (message.guild) {
                advanced_command_handler_1.Logger.log(`${advanced_command_handler_1.Logger.setColor('magenta', message.author.tag)} executed the command ${advanced_command_handler_1.Logger.setColor('gold', cmd.name)} on the guild ${advanced_command_handler_1.Logger.setColor('teal', message.guild.name)}.`);
                const verified = verifyPerms(message, cmd);
                if (verified.client.length > 0)
                    return message.channel.send({ embed: missingPermission(verified.client, true) });
                if (verified.user.length > 0)
                    return message.channel.send({ embed: missingPermission(verified.user) });
                if (cmd.tags.includes(advanced_command_handler_1.Tag.nsfw) && message.channel instanceof discord_js_1.TextChannel && !message.channel.nsfw) {
                    const embed = advanced_command_handler_1.BetterEmbed.fromTemplate('title', {
                        title: 'Error :',
                        description: 'NSFW commands are only available on nsfw channels.'
                    });
                    await message.channel.send(embed);
                }
            }
            else {
                advanced_command_handler_1.Logger.log(`${advanced_command_handler_1.Logger.setColor('magenta', message.author.tag)} executed the command ${advanced_command_handler_1.Logger.setColor('gold', cmd.name)} in private messages.`);
                if (cmd.tags.includes(advanced_command_handler_1.Tag.guildOnly)) {
                    await message.channel.send('The command is only available on a guild.');
                    return advanced_command_handler_1.Logger.log(`${advanced_command_handler_1.Logger.setColor('magenta', message.author.tag)} tried the command ${advanced_command_handler_1.Logger.setColor('gold', cmd.name)} only available on guild but in private.`);
                }
            }
            if (handler.cooldowns.has(message.author.id)) {
                return message.channel.send(`This command has a cooldown, wait \`${handler.cooldowns.get(message.author.id)}\` seconds and try again.`);
            }
            else if (cmd.cooldown > 0) {
                handler.cooldowns.set(message.author.id, cmd.cooldown);
                setTimeout(() => {
                    handler.cooldowns.delete(message.author.id);
                }, cmd.cooldown * 1000);
            }
            try {
                cmd.run(handler, message, args);
            }
            catch (warning) {
                advanced_command_handler_1.Logger.warn(`A small error was made somewhere with the command ${advanced_command_handler_1.Logger.setColor('gold', cmd.name)}.
Date : ${advanced_command_handler_1.Logger.setColor('yellow', new Date().toString())}${advanced_command_handler_1.Logger.setColor('red', '\nError : ' + warning.stack)}`);
                if (handler.client?.isOwner(message.author.id)) {
                    const embedLog = new advanced_command_handler_1.BetterEmbed();
                    embedLog.setColor('#dd0000');
                    embedLog.setDescription('An error occurred with the command : **' + cmd.name + '**.');
                    embedLog.addField('Informations :', `\nSent by : ${message.author} (\`${message.author.id}\`)\n\nOnto : **${message.guild?.name}** (\`${message.guild?.id}\`)\n\nInto : ${message.channel} (\`${message.channel.id})\``);
                    embedLog.addField('Error :', warning.stack.length > 1024 ? warning.stack.substring(0, 1021) + '...' : warning.stack);
                    embedLog.addField('Message :', messageToString);
                    return message.channel.send(embedLog);
                }
            }
        }
    }
};
