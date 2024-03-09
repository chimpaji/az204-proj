import './App.css';

import { useEffect, useState } from 'react';

const azFuncUrl =
  'https://getweathertesttest1212.azurewebsites.net/api/get-weather';

const azSubUrl =
  'https://getweathertesttest1212.azurewebsites.net/api/subscribe';

function App() {
  const [name, setName] = useState('London');
  const [email, setEmail] = useState('');
  const [greeting, setGreeting] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === 'development';
  const getWeatherUrl = isDev ? '/api/get-weather' : azFuncUrl;
  const subscribeUrl = isDev ? '/api/subscribe' : azSubUrl;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (name?: string) => {
    const query = name ? `?name=${name}` : '';
    const response = await fetch(`${getWeatherUrl}${query}`);
    const data = await response.json();
    setGreeting(data);
    console.log({ data });
  };

  // create subscribeWeather function, save email and city to body, and send to subscribeUrl (post)
  const subscribeWeather = async (email: string, city: string) => {
    await fetch(subscribeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, city }),
    });
  };

  return (
    <>
      <div>
        <div className='App'>
          {greeting ? (
            <div>
              <h1>Weather</h1>
              <p>{JSON.stringify(greeting, null, 2)}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      {/* create div that set name */}
      <div>
        <p>City: {name}</p>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={async () => {
            await fetchData(name);
          }}
        >
          Set citys
        </button>
      </div>

      {/* create a section for subscribe to weather get email and city name */}
      <div>
        <h2>Subscribe to weather</h2>
        <input
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />

        <button
          onClick={async () => {
            await subscribeWeather(email, name);
            setEmail('');
          }}
        >
          Subscribe
        </button>
      </div>
    </>
  );
}

export default App;
