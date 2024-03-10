import { InvocationContext, Timer, app } from '@azure/functions';
import { mailgun, subscriberContainerDB, weather } from '../config';

export async function midnightCheckWindy(
  _myTimer: Timer,
  _context: InvocationContext
): Promise<void> {
  // Fetch all items from the container
  const { resources: items } = await subscriberContainerDB.items
    .readAll()
    .fetchAll();

  // Loop through the items
  for (const item of items) {
    // Get the weather for the city
    weather.setLocationByName = item.city;
    const weatherData = await weather.getCurrent();

    // Check if it's windy
    const windSpeed = weatherData.weather.wind.speed;
    console.log({ email: item.email, windSpeed });
    const mediumWindSpeed = 9;
    if (windSpeed > mediumWindSpeed) {
      // Send an email to the user
      const data = {
        from: 'Weather Alert <me@samples.mailgun.org>',
        to: item.email,
        subject: "Weather Alert: It's windy",
        text: `Hello, it's currently windy in ${item.city}. Stay safe!`,
      };
      mailgun.messages().send(data, (error, body) => {
        console.log(body);
        if (error) {
          console.error(error);
        }
      });
    }
  }
}

app.timer('midnightCheckWindy', {
  schedule: '0 0 0 * * *',
  handler: midnightCheckWindy,
});
