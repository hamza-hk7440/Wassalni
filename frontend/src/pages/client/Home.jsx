import React, { useState } from 'react';
import '../../App.css';

const Home = () => {
  const [transportType, setTransportType] = useState(null); // 'bus' or 'train'

  return (
    <div className="home-container">

      <main className="main-content">
        <header className="hero-section">
          <h1 className='home-title'>Where are you going today?</h1>
          <p className='home-paragraph'>Select your preferred mode of transport to view live schedules.</p>
        </header>

        <div className="selection-grid">
          <div 
            className={`choice-card ${transportType === 'bus' ? 'active' : ''}`}
            onClick={() => setTransportType('bus')}
          >
            <div className="icon">🚌</div>
            <h3>Bus Services</h3>
          </div>

          <div 
            className={`choice-card ${transportType === 'train' ? 'active' : ''}`}
            onClick={() => setTransportType('train')}
          >
            <div className="icon">🚆</div>
            <h3>Train Lines</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;