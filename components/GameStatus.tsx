'use client';

import { GameState } from '@/types/game';

interface GameStatusProps {
  gameState: GameState;
}

export default function GameStatus({ gameState }: GameStatusProps) {
  return (
    <div className="flex justify-between items-center mb-4 text-white">
      <div className="flex gap-6">
        <div className="bg-blue-600 px-6 py-3 rounded-lg shadow-lg">
          <div className="text-sm font-semibold text-blue-200">SCORE</div>
          <div className="text-3xl font-bold">{gameState.score}</div>
        </div>
        <div className="bg-red-600 px-6 py-3 rounded-lg shadow-lg">
          <div className="text-sm font-semibold text-red-200">LIVES</div>
          <div className="text-3xl font-bold">
            {'❤️'.repeat(gameState.lives)}
            {'🖤'.repeat(3 - gameState.lives)}
          </div>
        </div>
      </div>

      {gameState.isGameOver && (
        <div className="bg-red-700 px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <div className="text-2xl font-bold">GAME OVER!</div>
        </div>
      )}

      {gameState.isWin && (
        <div className="bg-green-600 px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <div className="text-2xl font-bold">🎉 YOU WIN! 🎉</div>
        </div>
      )}

      {gameState.isPaused && !gameState.isGameOver && !gameState.isWin && (
        <div className="bg-yellow-600 px-6 py-3 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">⏸️ PAUSED</div>
        </div>
      )}
    </div>
  );
}
