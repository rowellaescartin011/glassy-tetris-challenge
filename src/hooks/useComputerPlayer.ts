import { useState, useEffect, useCallback } from 'react';
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

// AI logic to find best position
const evaluatePosition = (board: Board, piece: Tetromino, position: Position): number => {
  const testBoard = mergePieceToBoard(board, { ...piece, position });
  let score = 0;
  
  // Count holes (empty cells with filled cells above)
  for (let x = 0; x < BOARD_WIDTH; x++) {
    let foundBlock = false;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (testBoard[y][x]) {
        foundBlock = true;
      } else if (foundBlock) {
        score -= 5; // Penalty for holes
      }
    }
  }
  
  // Height penalty
  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (testBoard[y][x]) {
        score -= (BOARD_HEIGHT - y) * 0.5;
        break;
      }
    }
  }
  
  // Line clearing bonus
  const { linesCleared } = clearLines(testBoard);
  score += linesCleared * 100;
  
  return score;
};

const findBestMove = (board: Board, piece: Tetromino): { x: number; rotation: number } => {
  let bestScore = -Infinity;
  let bestX = piece.position.x;
  let bestRotation = 0;
  
  for (let rotation = 0; rotation < 4; rotation++) {
    let rotatedPiece = piece;
    for (let r = 0; r < rotation; r++) {
      rotatedPiece = rotateTetromino(rotatedPiece);
    }
    
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let y = 0;
      while (!checkCollision(board, rotatedPiece, { x, y: y + 1 })) {
        y++;
      }
      
      if (!checkCollision(board, rotatedPiece, { x, y })) {
        const score = evaluatePosition(board, rotatedPiece, { x, y });
        if (score > bestScore) {
          bestScore = score;
          bestX = x;
          bestRotation = rotation;
        }
      }
    }
  }
  
  return { x: bestX, rotation: bestRotation };
};

export const useComputerPlayer = () => {
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

  const makeAIMove = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver || !prev.currentPiece) return prev;

      const { x: targetX, rotation } = findBestMove(prev.board, prev.currentPiece);
      
      // Apply rotations
      let piece = prev.currentPiece;
      for (let r = 0; r < rotation; r++) {
        piece = rotateTetromino(piece);
      }
      
      // Move to target X
      piece = { ...piece, position: { ...piece.position, x: targetX } };
      
      // Drop to bottom
      let y = piece.position.y;
      while (!checkCollision(prev.board, piece, { ...piece.position, y: y + 1 })) {
        y++;
      }
      
      const droppedPiece = { ...piece, position: { ...piece.position, y } };
      const mergedBoard = mergePieceToBoard(prev.board, droppedPiece);
      const { newBoard, linesCleared: cleared } = clearLines(mergedBoard);
      
      const newScore = prev.score + (cleared * 100 * prev.level) + y;
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

  useEffect(() => {
    const speed = Math.max(200, 1500 - (gameState.level - 1) * 150);
    
    let interval: NodeJS.Timeout;
    if (!gameState.isPaused && !gameState.isGameOver) {
      interval = setInterval(makeAIMove, speed);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.level, makeAIMove]);

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

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  return {
    gameState,
    resetGame,
    togglePause,
  };
};
