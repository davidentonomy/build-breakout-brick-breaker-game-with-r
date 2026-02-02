import { useEffect, useRef, useState, useCallback } from 'react';
import { Paddle, Ball, Brick, GameState } from '@/types/game';
import {
  GAME_CONFIG,
  BRICK_COLORS,
  BRICK_POINTS,
  INITIAL_LIVES,
  PADDLE_SPEED,
} from '@/lib/constants';

export function useBreakout(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: INITIAL_LIVES,
    level: 1,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isWin: false,
  });

  const paddleRef = useRef<Paddle>({
    x: GAME_CONFIG.canvasWidth / 2 - GAME_CONFIG.paddleWidth / 2,
    y: GAME_CONFIG.canvasHeight - 40,
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
    speed: PADDLE_SPEED,
  });

  const ballRef = useRef<Ball>({
    x: GAME_CONFIG.canvasWidth / 2,
    y: GAME_CONFIG.canvasHeight - 60,
    radius: GAME_CONFIG.ballRadius,
    dx: GAME_CONFIG.ballSpeed,
    dy: -GAME_CONFIG.ballSpeed,
    speed: GAME_CONFIG.ballSpeed,
  });

  const bricksRef = useRef<Brick[][]>([]);
  const animationRef = useRef<number>();
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Initialize bricks
  const initializeBricks = useCallback(() => {
    const bricks: Brick[][] = [];
    for (let row = 0; row < GAME_CONFIG.brickRowCount; row++) {
      bricks[row] = [];
      for (let col = 0; col < GAME_CONFIG.brickColumnCount; col++) {
        bricks[row][col] = {
          x:
            col * (GAME_CONFIG.brickWidth + GAME_CONFIG.brickPadding) +
            GAME_CONFIG.brickOffsetLeft,
          y:
            row * (GAME_CONFIG.brickHeight + GAME_CONFIG.brickPadding) +
            GAME_CONFIG.brickOffsetTop,
          width: GAME_CONFIG.brickWidth,
          height: GAME_CONFIG.brickHeight,
          status: 1,
          color: BRICK_COLORS[row],
          points: BRICK_POINTS[row],
        };
      }
    }
    bricksRef.current = bricks;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    paddleRef.current = {
      x: GAME_CONFIG.canvasWidth / 2 - GAME_CONFIG.paddleWidth / 2,
      y: GAME_CONFIG.canvasHeight - 40,
      width: GAME_CONFIG.paddleWidth,
      height: GAME_CONFIG.paddleHeight,
      speed: PADDLE_SPEED,
    };

    ballRef.current = {
      x: GAME_CONFIG.canvasWidth / 2,
      y: GAME_CONFIG.canvasHeight - 60,
      radius: GAME_CONFIG.ballRadius,
      dx: GAME_CONFIG.ballSpeed,
      dy: -GAME_CONFIG.ballSpeed,
      speed: GAME_CONFIG.ballSpeed,
    };

    initializeBricks();

    setGameState({
      score: 0,
      lives: INITIAL_LIVES,
      level: 1,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isWin: false,
    });
  }, [initializeBricks]);

  // Reset ball position (after losing a life)
  const resetBall = useCallback(() => {
    ballRef.current = {
      x: GAME_CONFIG.canvasWidth / 2,
      y: GAME_CONFIG.canvasHeight - 60,
      radius: GAME_CONFIG.ballRadius,
      dx: GAME_CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
      dy: -GAME_CONFIG.ballSpeed,
      speed: GAME_CONFIG.ballSpeed,
    };
  }, []);

  // Draw paddle
  const drawPaddle = useCallback((ctx: CanvasRenderingContext2D) => {
    const paddle = paddleRef.current;
    ctx.fillStyle = '#3B82F6';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#3B82F6';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
  }, []);

  // Draw ball
  const drawBall = useCallback((ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#F59E0B';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
  }, []);

  // Draw bricks
  const drawBricks = useCallback((ctx: CanvasRenderingContext2D) => {
    const bricks = bricksRef.current;
    for (let row = 0; row < GAME_CONFIG.brickRowCount; row++) {
      for (let col = 0; col < GAME_CONFIG.brickColumnCount; col++) {
        const brick = bricks[row][col];
        if (brick.status === 1) {
          ctx.fillStyle = brick.color;
          ctx.shadowBlur = 5;
          ctx.shadowColor = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeStyle = '#1F2937';
          ctx.lineWidth = 2;
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
          ctx.shadowBlur = 0;
        }
      }
    }
  }, []);

  // Collision detection
  const detectCollision = useCallback(() => {
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    const bricks = bricksRef.current;

    // Wall collision
    if (ball.x + ball.dx > GAME_CONFIG.canvasWidth - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    }

    // Paddle collision
    if (
      ball.y + ball.dy > paddle.y - ball.radius &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      // Calculate hit position on paddle (-1 to 1)
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      // Adjust ball angle based on where it hits the paddle
      ball.dx = hitPos * ball.speed * 0.8;
      ball.dy = -Math.abs(ball.dy);
    }

    // Bottom wall (lose life)
    if (ball.y + ball.dy > GAME_CONFIG.canvasHeight - ball.radius) {
      setGameState((prev) => {
        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          return { ...prev, lives: 0, isPlaying: false, isGameOver: true };
        }
        return { ...prev, lives: newLives };
      });
      resetBall();
    }

    // Brick collision
    for (let row = 0; row < GAME_CONFIG.brickRowCount; row++) {
      for (let col = 0; col < GAME_CONFIG.brickColumnCount; col++) {
        const brick = bricks[row][col];
        if (brick.status === 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
            setGameState((prev) => {
              const newScore = prev.score + brick.points;
              // Check if all bricks are destroyed
              const allDestroyed = bricks.every((row) =>
                row.every((b) => b.status === 0)
              );
              if (allDestroyed) {
                return { ...prev, score: newScore, isPlaying: false, isWin: true };
              }
              return { ...prev, score: newScore };
            });
          }
        }
      }
    }
  }, [resetBall]);

  // Update paddle position
  const updatePaddle = useCallback(() => {
    const paddle = paddleRef.current;
    if (keysRef.current['ArrowLeft'] && paddle.x > 0) {
      paddle.x -= paddle.speed;
    }
    if (keysRef.current['ArrowRight'] && paddle.x < GAME_CONFIG.canvasWidth - paddle.width) {
      paddle.x += paddle.speed;
    }
  }, []);

  // Update ball position
  const updateBall = useCallback(() => {
    const ball = ballRef.current;
    ball.x += ball.dx;
    ball.y += ball.dy;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current || gameState.isPaused || !gameState.isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);

    // Draw game elements
    drawBricks(ctx);
    drawPaddle(ctx);
    drawBall(ctx);

    // Update positions
    updatePaddle();
    updateBall();
    detectCollision();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [
    canvasRef,
    gameState.isPaused,
    gameState.isPlaying,
    drawBricks,
    drawPaddle,
    drawBall,
    updatePaddle,
    updateBall,
    detectCollision,
  ]);

  // Start game
  const startGame = useCallback(() => {
    if (gameState.isGameOver || gameState.isWin) {
      resetGame();
    }
    setGameState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
  }, [gameState.isGameOver, gameState.isWin, resetGame]);

  // Pause game
  const togglePause = useCallback(() => {
    if (gameState.isPlaying && !gameState.isGameOver && !gameState.isWin) {
      setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    }
  }, [gameState.isPlaying, gameState.isGameOver, gameState.isWin]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const paddle = paddleRef.current;

    let newX = mouseX - paddle.width / 2;
    if (newX < 0) newX = 0;
    if (newX > GAME_CONFIG.canvasWidth - paddle.width) {
      newX = GAME_CONFIG.canvasWidth - paddle.width;
    }
    paddle.x = newX;
  }, [canvasRef]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetGame();
      } else {
        keysRef.current[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [togglePause, resetGame]);

  // Initialize game
  useEffect(() => {
    initializeBricks();
  }, [initializeBricks]);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameLoop]);

  return {
    gameState,
    startGame,
    resetGame,
    togglePause,
    handleMouseMove,
  };
}
