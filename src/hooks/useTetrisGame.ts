import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Board, Tetromino, Position } from '@/types/tetris';
import { createTetromino, rotateTetromino } from '@/utils/tetrominos';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createEmptyBoard = (): Board => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));

const checkCollision = (board: Board, piece: Tetromino, position: Position): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newY = position.y + y;
        const newX = position.x + x;
        
        if (newY < 0 || newY >= BOARD_HEIGHT || newX < 0 || newX >= BOARD_WIDTH) {
          return true;
        }
        
        if (board[newY] && board[newY][newX]) {
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
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== null)) {
      linesCleared++;
      return false;
    }
    return true;
  });
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared };
};

export const useTetrisGame = () => {
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

  const gameLoopRef = useRef<NodeJS.Timeout>();

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.currentPiece) return prev;

      const newPosition = { ...prev.currentPiece.position, y: prev.currentPiece.position.y + 1 };
      
      if (checkCollision(prev.board, prev.currentPiece, newPosition)) {
        const mergedBoard = mergePieceToBoard(prev.board, prev.currentPiece);
        const { newBoard, linesCleared: cleared } = clearLines(mergedBoard);
        
        const newScore = prev.score + (cleared * 100 * prev.level);
        const newLinesCleared = prev.linesCleared + cleared;
        const newLevel = Math.floor(newLinesCleared / 10) + 1;
        
        const newPiece = prev.nextPiece;
        const isGameOver = newPiece ? checkCollision(newBoard, newPiece, newPiece.position) : true;
        
        return {
          ...prev,
          board: newBoard,
          currentPiece: newPiece,
          nextPiece: createTetromino(),
          score: newScore,
          level: newLevel,
          linesCleared: newLinesCleared,
          isGameOver,
        };
      }

      return {
        ...prev,
        currentPiece: { ...prev.currentPiece, position: newPosition },
      };
    });
  }, []);

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.currentPiece) return prev;

      const newPosition = { ...prev.currentPiece.position, x: prev.currentPiece.position.x - 1 };
      
      if (!checkCollision(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition },
        };
      }
      
      return prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.currentPiece) return prev;

      const newPosition = { ...prev.currentPiece.position, x: prev.currentPiece.position.x + 1 };
      
      if (!checkCollision(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, position: newPosition },
        };
      }
      
      return prev;
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.currentPiece) return prev;

      const rotated = rotateTetromino(prev.currentPiece);
      
      if (!checkCollision(prev.board, rotated, rotated.position)) {
        return {
          ...prev,
          currentPiece: rotated,
        };
      }
      
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.currentPiece) return prev;

      let newY = prev.currentPiece.position.y;
      while (!checkCollision(prev.board, prev.currentPiece, { ...prev.currentPiece.position, y: newY + 1 })) {
        newY++;
      }

      const droppedPiece = { ...prev.currentPiece, position: { ...prev.currentPiece.position, y: newY } };
      const mergedBoard = mergePieceToBoard(prev.board, droppedPiece);
      const { newBoard, linesCleared: cleared } = clearLines(mergedBoard);
      
      const newScore = prev.score + (cleared * 100 * prev.level) + (newY - prev.currentPiece.position.y);
      const newLinesCleared = prev.linesCleared + cleared;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;
      
      const newPiece = prev.nextPiece;
      const isGameOver = newPiece ? checkCollision(newBoard, newPiece, newPiece.position) : true;
      
      return {
        ...prev,
        board: newBoard,
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
    const speed = Math.max(100, 1000 - (gameState.level - 1) * 100);
    
    if (!gameState.isPaused && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(moveDown, speed);
    }
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.level, moveDown]);

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
