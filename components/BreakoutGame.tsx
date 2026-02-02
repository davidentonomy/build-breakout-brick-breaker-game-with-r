'use client';

import { useRef } from 'react';
import { useBreakout } from '@/hooks/useBreakout';
import { GAME_CONFIG } from '@/lib/constants';
import GameCanvas from './GameCanvas';
import GameStatus from './GameStatus';
import GameControls from './GameControls';

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, startGame, resetGame, togglePause, handleMouseMove } =
    useBreakout(canvasRef);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border-4 border-blue-500">
        <h1 className="text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          BREAKOUT
        </h1>

        <GameStatus gameState={gameState} />

        <div className="my-6">
          <GameCanvas
            canvasRef={canvasRef}
            width={GAME_CONFIG.canvasWidth}
            height={GAME_CONFIG.canvasHeight}
            onMouseMove={handleMouseMove}
          />
        </div>

        <GameControls
          gameState={gameState}
          onStart={startGame}
          onReset={resetGame}
          onPause={togglePause}
        />

        <div className="mt-6 text-center text-gray-300 text-sm space-y-1">
          <p>🖱️ Move mouse or ⬅️ ➡️ arrow keys to control paddle</p>
          <p>⏸️ Press SPACE to pause | 🔄 Press R to restart</p>
        </div>
      </div>
    </div>
  );
}
