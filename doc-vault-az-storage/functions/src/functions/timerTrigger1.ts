import { InvocationContext, Timer, app } from '@azure/functions';

export async function timerTrigger1(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log('Timer function processed request.');
}

app.timer('timerTrigger1', {
  schedule: '10 * * * * *',
  handler: timerTrigger1,
});
