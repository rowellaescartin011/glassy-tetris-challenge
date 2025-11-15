import { Tetromino, TetrominoType } from '@/types/tetris';

const TETROMINOS: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 'hsl(var(--neon-cyan))',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'hsl(var(--neon-yellow))',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'hsl(var(--neon-purple))',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'hsl(var(--neon-green))',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'hsl(var(--neon-red))',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'hsl(var(--neon-blue))',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'hsl(var(--neon-orange))',
  },
};

export const createTetromino = (type?: TetrominoType): Tetromino => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomType = type || types[Math.floor(Math.random() * types.length)];
  const tetromino = TETROMINOS[randomType];

  return {
    type: randomType,
    shape: tetromino.shape,
    color: tetromino.color,
    position: { x: 3, y: 0 },
  };
};

export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const N = tetromino.shape.length;
  const rotated = Array(N)
    .fill(null)
    .map(() => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[j][N - 1 - i] = tetromino.shape[i][j];
    }
  }

  return { ...tetromino, shape: rotated };
};
