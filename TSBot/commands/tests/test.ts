import {Command, CommandContext, Tag} from 'advanced-command-handler';

export class TestCommand extends Command {
	override aliases = ['t'];
	override clientPermissions = ['MANAGE_GUILD'];
	override cooldown = 5;
	override description = 'A simple MapToValuesType command';
	override readonly name = 'test';
	override tags = [Tag.guildOnly];

	async run(ctx: CommandContext) {
		await ctx.send('Hello, Discord!');
	}
}
