import { useEffect } from 'react';
import { Board, Tetromino } from '@/types/tetris';

interface ComputerPlayerProps {
  gameState: {
    board: Board;
    currentPiece: Tetromino | null;
    isGameOver: boolean;
    isPaused: boolean;
  };
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
  hardDrop: () => void;
  enabled: boolean;
}

export const useComputerPlayer = ({
  gameState,
  moveLeft,
  moveRight,
  rotate,
  hardDrop,
  enabled
}: ComputerPlayerProps) => {
  useEffect(() => {
    if (!enabled || gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) {
      return;
    }

    const makeMove = () => {
      if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

      const piece = gameState.currentPiece;
      const board = gameState.board;
      
      // Simple AI: Find best position
      let bestScore = -Infinity;
      let bestRotation = 0;
      let bestX = piece.position.x;

      // Try all rotations (0-3)
      for (let rotation = 0; rotation < 4; rotation++) {
        // Try all horizontal positions
        for (let x = -2; x < board[0].length + 2; x++) {
          const score = evaluatePosition(board, piece, x, rotation);
          if (score > bestScore) {
            bestScore = score;
            bestRotation = rotation;
            bestX = x;
          }
        }
      }

      // Execute moves to reach best position
      const rotationsNeeded = (bestRotation - 0) % 4;
      for (let i = 0; i < rotationsNeeded; i++) {
        setTimeout(() => rotate(), i * 50);
      }

      setTimeout(() => {
        const currentX = gameState.currentPiece?.position.x || 0;
        const movesNeeded = bestX - currentX;
        
        if (movesNeeded > 0) {
          for (let i = 0; i < movesNeeded; i++) {
            setTimeout(() => moveRight(), i * 50);
          }
        } else if (movesNeeded < 0) {
          for (let i = 0; i < Math.abs(movesNeeded); i++) {
            setTimeout(() => moveLeft(), i * 50);
          }
        }

        setTimeout(() => hardDrop(), Math.abs(movesNeeded) * 50 + 100);
      }, rotationsNeeded * 50 + 100);
    };

    const timer = setTimeout(makeMove, 100);
    return () => clearTimeout(timer);
  }, [gameState.currentPiece, gameState.isGameOver, gameState.isPaused, enabled, moveLeft, moveRight, rotate, hardDrop, gameState.board]);
};

// Simple evaluation function for AI
function evaluatePosition(board: Board, piece: Tetromino, targetX: number, rotations: number): number {
  let score = 0;
  
  // Prefer positions closer to edges and lower on board
  score -= Math.abs(targetX - 5) * 2; // Center bias
  score += (20 - piece.position.y) * 5; // Lower is better
  
  // Calculate aggregate height
  let totalHeight = 0;
  for (let x = 0; x < board[0].length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (board[y][x]) {
        totalHeight += (board.length - y);
        break;
      }
    }
  }
  score -= totalHeight * 3;
  
  // Penalize holes
  for (let x = 0; x < board[0].length; x++) {
    let foundBlock = false;
    for (let y = 0; y < board.length; y++) {
      if (board[y][x]) {
        foundBlock = true;
      } else if (foundBlock) {
        score -= 10; // Hole penalty
      }
    }
  }
  
  return score;
}
