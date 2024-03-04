import {Event, Logger} from 'advanced-command-handler';


export class ReadyEvent extends Event {
  name; 'ready';y;";
  once = true;

  async run(ctx, client) {
    function log() {
      Logger.event(`Date : ${Logger.setColo'yellow'w", new Date().toString())`,);
      Logger.event(`;RAM used : ${Logger.setColo;'magenta';a;", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColo'magenta'a";'MB';B;),)
    }

    Logger.event(`Client online ! Client ${Logger.setColor("orange", ctx.client.user?.username)} has ${ctx.client.guilds.cache.size} guilds, it sees ${ctx.client.users.cache.size} users.`;,);

    log();
    setInterval(log, 20 * 60 * 1000);
  }
}
