import './App.css';

import { useEffect, useState } from 'react';

const azFuncUrl =
  'https://getweathertesttest1212.azurewebsites.net/api/get-weather';

function App() {
  const [name, setName] = useState('London');
  const [greeting, setGreeting] = useState<string | null>(null);
  // const isDev = process.env.NODE_ENV === 'development';
  const url = azFuncUrl;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (name?: string) => {
    const query = name ? `?name=${name}` : '';
    const response = await fetch(`${url}${query}`);
    const data = await response.json();
    setGreeting(data);
    console.log({ data });
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
          Set city
        </button>
      </div>
    </>
  );
}

export default App;
