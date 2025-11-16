import { useState, useEffect, useCallback } from 'react';
import { Board, Tetromino, GameState } from '@/types/tetris';
import { createTetromino } from '@/utils/tetrominos';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

const checkCollision = (board: Board, piece: Tetromino, position: { x: number; y: number }): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        if (boardY >= BOARD_HEIGHT || boardX < 0 || boardX >= BOARD_WIDTH) {
          return true;
        }
        
        if (boardY >= 0 && board[boardY][boardX]) {
          return true;
        }
      }
    }
  }
  return false;
};

const mergePieceToBoard = (board: Board, piece: Tetromino): Board => {
  const newBoard = board.map(row => [...row]);
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    });
  });
  return newBoard;
};

const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  return { newBoard, linesCleared };
};

export const useTetrisGame2P = (enabled: boolean = true) => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: createTetromino(),
    nextPiece: createTetromino(),
    score: 0,
    level: 1,
    linesCleared: 0,
    isGameOver: false,
    isPaused: false,
  });

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const newPosition = { ...prev.currentPiece.position, x: prev.currentPiece.position.x - 1 };
      if (!checkCollision(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition }
        };
      }
      return prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const newPosition = { ...prev.currentPiece.position, x: prev.currentPiece.position.x + 1 };
      if (!checkCollision(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition }
        };
      }
      return prev;
    });
  }, []);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const newPosition = { ...prev.currentPiece.position, y: prev.currentPiece.position.y + 1 };
      
      if (!checkCollision(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition }
        };
      }

      const newBoard = mergePieceToBoard(prev.board, prev.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + (linesCleared * 100 * prev.level);
      const newLinesCleared = prev.linesCleared + linesCleared;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;

      const newPiece = prev.nextPiece;
      const isGameOver = checkCollision(clearedBoard, newPiece, newPiece.position);

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: newPiece,
        nextPiece: createTetromino(),
        score: newScore,
        level: newLevel,
        linesCleared: newLinesCleared,
        isGameOver,
      };
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const rotatedShape = prev.currentPiece.shape[0].map((_, i) =>
        prev.currentPiece.shape.map(row => row[i]).reverse()
      );
      const rotatedPiece = { ...prev.currentPiece, shape: rotatedShape };
      
      if (!checkCollision(prev.board, rotatedPiece, prev.currentPiece.position)) {
        return { ...prev, currentPiece: rotatedPiece };
      }
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      let newPosition = { ...prev.currentPiece.position };
      
      while (!checkCollision(prev.board, prev.currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
        newPosition.y += 1;
      }

      const droppedPiece = { ...prev.currentPiece, position: newPosition };
      const newBoard = mergePieceToBoard(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + (linesCleared * 100 * prev.level);
      const newLinesCleared = prev.linesCleared + linesCleared;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;

      const newPiece = prev.nextPiece;
      const isGameOver = checkCollision(clearedBoard, newPiece, newPiece.position);

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: newPiece,
        nextPiece: createTetromino(),
        score: newScore,
        level: newLevel,
        linesCleared: newLinesCleared,
        isGameOver,
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createTetromino(),
      nextPiece: createTetromino(),
      score: 0,
      level: 1,
      linesCleared: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  useEffect(() => {
    if (!enabled || gameState.isGameOver || gameState.isPaused) return;

    const speed = Math.max(100, 1000 - (gameState.level - 1) * 100);
    const gameLoop = setInterval(() => {
      moveDown();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [enabled, gameState.level, gameState.isGameOver, gameState.isPaused, moveDown]);

  return {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    resetGame,
  };
};
