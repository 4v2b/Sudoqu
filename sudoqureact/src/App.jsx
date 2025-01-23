import { useState, useEffect } from 'react';
import { make } from './api.js';
import { Puzzle } from './components/Puzzle.jsx';
import './App.css';

export default function App() {
  const [data, setData] = useState(null);
  const [showSeedInput, setShowSeedInput] = useState(true);
  const [seedInput, setSeedInput] = useState('');
  const [loading, setLoading] = useState(false);

  const startGame = async (seed = null) => {
    setLoading(true);
    const response = await make(seed);
    const values = new Map();
    
    Object.entries(response.squares).map(([key, value]) => {
      values.set(key, {presetValue: value, actualValue: null});
    });
    
    setData({squares: values, visibleSquares: response.visible, seed: response.seed});
    setShowSeedInput(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (showSeedInput) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Start New Game</h2>
          <input
            type="text"
            placeholder="Enter seed (optional)"
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              color: "#000",
              borderRadius: '4px',
              backgroundColor: '#FFFFFF'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => startGame(seedInput || null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start Game
            </button>
            <button
              onClick={() => startGame()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                color: '#007bff',
                border: '1px solid #007bff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Random Seed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Puzzle squares={data.squares} visibleSquares={data.visibleSquares} seed={data.seed} onReturn={() => setShowSeedInput(true)} />;
}