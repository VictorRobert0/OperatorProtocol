import React, { useState } from 'react';
import { User, ChevronRight, Users, Shield, Maximize2, Crown } from 'lucide-react';

interface GameLobbyProps {
  onStartGame: (username: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame }) => {
  const [username, setUsername] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');
  const [isCreatingLobby, setIsCreatingLobby] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsJoining(true);
      setTimeout(() => {
        onStartGame(username);
      }, 1500);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header with fullscreen button */}
      <div className="bg-black bg-opacity-50 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">VALOR FPS</h1>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Join/Create Game Panel */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white">Play Now</h2>
              <p className="text-white opacity-80 mt-2">Join or create a game</p>
            </div>

            {isJoining ? (
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-xl font-medium">Connecting to server...</p>
                  <p className="text-gray-400 mt-2">Setting up your game</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-700 text-white block w-full pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lobbyCode" className="block text-sm font-medium text-gray-400 mb-2">
                    Lobby Code (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Crown className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="lobbyCode"
                      value={lobbyCode}
                      onChange={(e) => setLobbyCode(e.target.value)}
                      className="bg-gray-700 text-white block w-full pl-10 pr-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter lobby code to join friends"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="submit"
                    className="flex items-center justify-between bg-blue-600 hover:bg-blue-500 p-4 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-white mr-2" />
                      <div>
                        <div className="text-white font-medium">Quick Play</div>
                        <div className="text-blue-200 text-sm">Join a random match</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCreatingLobby(true)}
                    className="flex items-center justify-between bg-purple-600 hover:bg-purple-500 p-4 rounded-md transition-colors"
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-white mr-2" />
                      <div>
                        <div className="text-white font-medium">Create Private Lobby</div>
                        <div className="text-purple-200 text-sm">Play with friends</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Server Status & Players Panel */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                <h2 className="text-2xl font-bold text-white">Server Status</h2>
                <p className="text-white opacity-80 mt-2">Current game statistics</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Online Players</span>
                  <span className="text-white font-medium">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Matches</span>
                  <span className="text-white font-medium">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Server Status</span>
                  <span className="text-green-400 font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Operational
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
                <h2 className="text-2xl font-bold text-white">Top Players</h2>
                <p className="text-white opacity-80 mt-2">Weekly leaderboard</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "ProGamer123", score: 2547 },
                    { name: "Ninja_Master", score: 2341 },
                    { name: "ValorKing", score: 2156 }
                  ].map((player, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <span className="text-white">{player.name}</span>
                      </div>
                      <span className="text-yellow-400 font-medium">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;