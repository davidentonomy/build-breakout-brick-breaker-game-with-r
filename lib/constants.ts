import { GameConfig } from '@/types/game';

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  paddleWidth: 120,
  paddleHeight: 15,
  ballRadius: 8,
  ballSpeed: 4,
  brickRowCount: 5,
  brickColumnCount: 9,
  brickWidth: 75,
  brickHeight: 25,
  brickPadding: 10,
  brickOffsetTop: 60,
  brickOffsetLeft: 35,
};

export const BRICK_COLORS = [
  '#FF6B6B', // Red
  '#FFA500', // Orange
  '#FFD700', // Yellow
  '#4ECDC4', // Cyan
  '#45B7D1', // Blue
];

export const BRICK_POINTS = [50, 40, 30, 20, 10];

export const INITIAL_LIVES = 3;

export const PADDLE_SPEED = 8;
