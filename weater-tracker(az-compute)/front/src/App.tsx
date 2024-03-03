import './App.css';

import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('world');
  const [greeting, setGreeting] = useState<string | null>(null);
  const url = '/api/get-weather';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (name?: string) => {
    const query = name ? `?name=${name}` : '';
    const response = await fetch(`${url}${query}`);
    const data = await response.text();
    setGreeting(data);
    console.log({ data });
  };

  return (
    <>
      <div>
        <div className='App'>
          {greeting ? (
            <div>
              <h1>Greeting</h1>
              <p>{greeting}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      {/* create div that set name */}
      <div>
        <p>Name: {name}</p>
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
          Set name
        </button>
      </div>
    </>
  );
}

export default App;
