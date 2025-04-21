import React, { useState } from 'react';
import GameLobby from './components/GameLobby';
import Game from './components/Game';

function App() {
  const [username, setUsername] = useState<string | null>(null);

  const handleStartGame = (name: string) => {
    setUsername(name);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {username ? (
        <Game username={username} />
      ) : (
        <GameLobby onStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default App;