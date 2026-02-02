'use client';

import { GameState } from '@/types/game';

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onReset: () => void;
  onPause: () => void;
}

export default function GameControls({
  gameState,
  onStart,
  onReset,
  onPause,
}: GameControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      {!gameState.isPlaying && (
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          {gameState.isGameOver || gameState.isWin ? '🔄 NEW GAME' : '▶️ START'}
        </button>
      )}

      {gameState.isPlaying && !gameState.isGameOver && !gameState.isWin && (
        <button
          onClick={onPause}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          {gameState.isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
        </button>
      )}

      <button
        onClick={onReset}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
      >
        🔄 RESET
      </button>
    </div>
  );
}
