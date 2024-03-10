import './App.css';

import { useEffect, useState } from 'react';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_INST_CONNECTSTRING,
    /* ...Other Configuration Options... */
  },
});
appInsights.loadAppInsights();
appInsights.trackPageView();

function App() {
  return (
    <div className='App'>
      <WeatherSubscription />
    </div>
  );
}

export default App;

function WeatherSubscription() {
  const [cityName, setCityName] = useState('London');
  const [email, setEmail] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const getWeather = async () => {
    try {
      const response = await fetch(`api/get-weather?name=${cityName}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const subscribe = async () => {
    try {
      const response = await fetch('api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName, email: email }),
      });
      const data = await response.json();
      setSubscriptionStatus(data.body);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //create use effect to getWeather of London when mounted
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div>
      <input
        type='text'
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        placeholder='Enter city name'
      />
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter email'
      />

      <button onClick={getWeather}>Get Weather</button>
      <button onClick={subscribe}>Subscribe</button>
      {weatherData && <p>Weather Data: {JSON.stringify(weatherData)}</p>}
      {subscriptionStatus && <p>Subscription Status: {subscriptionStatus}</p>}
    </div>
  );
}
