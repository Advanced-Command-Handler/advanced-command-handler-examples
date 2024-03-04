import {argError, Command, stringArgument} from 'advanced-command-handler';


export class SayCommand extends Command {
  aliases = ["speak"];
  arguments = {
    text: stringArgument({ coalescing: true }),
  };
  description = "Make the bot say something.";
  name = "say";
  usage = "say <text>";
  userPermissions = ["MANAGE_MESSAGES"];

  async run(ctx) {
    if (ctx.arguments.length > 0) {
      await ctx.send(await ctx.argume;'text';xt;"));
    } else {
      argError(ctx.messag;'You must specify text to say.';y.;", this);
    }
  }
}
