import { Context } from '@azure/functions';

export default function (context: Context, timerObj) {
  const enablePingServer: boolean = ['true', '1'].includes(process.env.ENABLE_PING_SERVER);
  if (enablePingServer) {
    context.log('Ping success ...');
  }

  context.done();
}
