import './App.css';

import { useEffect, useState } from 'react';

import appInsights from 'applicationinsights';

function App() {
  appInsights
    .setup(process.env.VITE_INST_KEY)
    .setAutoCollectRequests(true)
    .start();

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

  const getWeather = () => {
    // fetch(`api/get-weather?name=${cityName}`)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setWeatherData(data);
    //   })
    //   .catch((error) => console.error('Error:', error));
  };

  const subscribe = () => {
    // fetch('api/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ city: cityName, email: email }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => setSubscriptionStatus(data.body))
    //   .catch((error) => console.error('Error:', error));
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
