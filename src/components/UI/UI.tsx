import { useState, useEffect } from 'react';
import './UI.css';

interface UIProps {
  setDexNumber: (value: (number | null)) => void;
  handleGetPokemon: () => void;
  randomPokemon: () => void;
  _typeSelected: (type: string) => void;
  dexNumber: number | null;
}

export default function UI({ setDexNumber, handleGetPokemon, randomPokemon, _typeSelected, dexNumber }: UIProps) {
  const [isNumberMode, setIsNumberMode] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const pokemonTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clear = () => {
    setDexNumber(null);
  }

  const handleSubmit = () => { 
    handleGetPokemon();
  }

  const handleNumberClick = (num: number) => {
    if (!dexNumber) {
      setDexNumber(num);
      return;
    }
    const newDexNumber = parseInt(`${dexNumber}${num}`);
    setDexNumber(newDexNumber);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setDexNumber(value);
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    _typeSelected(e.target.value);
  }

  return (
    <div className='ui'>
      <div className="mode-toggle-buttons mobile-input">
        <button onClick={() => setIsNumberMode(true)} className={isNumberMode ? 'active-mode' : ''}>
          Num
        </button>
        <button onClick={() => setIsNumberMode(false)} className={!isNumberMode ? 'active-mode' : ''}>
          Type
        </button>
        <button className="random-btn" onClick={() => randomPokemon()}>Random</button>
      </div>
      {isNumberMode ? (
        <>
          {isMobile ? (
            <div className="mobile-input">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <input
                  type="number"
                  className="user-input-display"
                  onChange={(e) => handleInputChange(e)}
                />
              </form>
            </div>
          ) : (
            <>
              <div className="user-input-display">
                {dexNumber === null ? '' : dexNumber}
              </div>
              <div className="num-pad">
                {[...Array(10).keys()].map((num) => (
                  <button key={num} onClick={() => handleNumberClick(num)}>
                    {num}
                  </button>
                ))}
                <button className="submit-btn" onClick={() => handleSubmit()}>✔</button>
                <button className="del-btn" onClick={() => clear()}>✖</button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {isMobile ? (
            <div>
                <select onChange={handleTypeChange} defaultValue="">
                  <option value="" disabled>Select a type</option>
                  {pokemonTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
            </div>
          ) : (
            <div className="num-pad">
              {pokemonTypes.map((type) => (
                <button key={type} className={`type type-${type}`} onClick={() => _typeSelected(type)}>
                  {type}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}