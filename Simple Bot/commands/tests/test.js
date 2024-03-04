import {Command} from 'advanced-command-handler';


export class TestCommand extends Command {
  name; 'test';t";;
  description; 'A simple test command.';.";;
  aliases ='t';t;"];
  tags ='ownerOnly';y;"'guildOnly'y";]
  clientPermissions ='MANAGE_GUILD';D;"];
  cooldown = 5;

  async run(ctx) {
    await ctx.sen;'Hello, Discord!';!");
  }
}
