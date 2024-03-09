import './App.css';

import { useEffect, useState } from 'react';

import appInsights from 'applicationinsights';

function App() {
  appInsights
    .setup(process.env.VITE_INST_KEY)
    .setAutoCollectRequests(true)
    .start();

  return <div className='App'>hello world</div>;
}

export default App;
