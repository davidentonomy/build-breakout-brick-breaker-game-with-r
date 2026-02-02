'use client';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export default function GameCanvas({
  canvasRef,
  width,
  height,
  onMouseMove,
}: GameCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      className="border-4 border-gray-700 rounded-lg shadow-lg cursor-none bg-gray-900"
    />
  );
}
