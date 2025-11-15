import { useEffect } from 'react';
import { useTetrisGame } from '@/hooks/useTetrisGame';
import { useComputerPlayer } from '@/hooks/useComputerPlayer';
import { TetrisBoard } from '@/components/TetrisBoard';
import { NextPieceDisplay } from '@/components/NextPieceDisplay';
import { GameStats } from '@/components/GameStats';
import { GameControls } from '@/components/GameControls';

const Index = () => {
  const {
    gameState: playerState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause: togglePlayerPause,
    resetGame: resetPlayerGame,
  } = useTetrisGame();

  const {
    gameState: computerState,
    togglePause: toggleComputerPause,
    resetGame: resetComputerGame,
  } = useComputerPlayer();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (playerState.isGameOver || playerState.isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, playerState.isGameOver, playerState.isPaused]);

  const handleTogglePause = () => {
    togglePlayerPause();
    toggleComputerPause();
  };

  const handleReset = () => {
    resetPlayerGame();
    resetComputerGame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-text mb-2" style={{ color: 'hsl(var(--neon-purple))' }}>
            TETRIS BATTLE
          </h1>
          <p className="text-muted-foreground">Player vs Computer</p>
        </div>

        {/* Game Controls - Centered */}
        <div className="max-w-xs mx-auto mb-6">
          <GameControls
            isPaused={playerState.isPaused}
            isGameOver={playerState.isGameOver}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
          />
        </div>

        {/* Game Over Message */}
        {playerState.isGameOver && (
          <div className="glass-card text-center py-6 mb-6 max-w-md mx-auto">
            <p className="text-2xl font-bold text-destructive neon-text mb-2">GAME OVER</p>
            <p className="text-lg text-foreground font-semibold">
              {playerState.score > computerState.score ? '🎉 You Win!' : computerState.score > playerState.score ? '🤖 Computer Wins!' : "It's a Tie!"}
            </p>
            <div className="mt-4 flex justify-center gap-8 text-sm">
              <div>
                <p className="text-muted-foreground">Your Score</p>
                <p className="text-xl font-bold text-primary">{playerState.score.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Computer Score</p>
                <p className="text-xl font-bold text-secondary">{computerState.score.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Game Area - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Player Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-cyan))' }}>
                PLAYER
              </h2>
            </div>
            
            <div className="grid grid-cols-[1fr,auto] gap-4">
              <TetrisBoard board={playerState.board} currentPiece={playerState.currentPiece} />
              
              <div className="space-y-4">
                <GameStats
                  score={playerState.score}
                  level={playerState.level}
                  linesCleared={playerState.linesCleared}
                  playerName="Stats"
                />
                <NextPieceDisplay nextPiece={playerState.nextPiece} />
              </div>
            </div>
          </div>

          {/* Computer Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-orange))' }}>
                COMPUTER
              </h2>
            </div>
            
            <div className="grid grid-cols-[1fr,auto] gap-4">
              <TetrisBoard board={computerState.board} currentPiece={computerState.currentPiece} />
              
              <div className="space-y-4">
                <GameStats
                  score={computerState.score}
                  level={computerState.level}
                  linesCleared={computerState.linesCleared}
                  playerName="Stats"
                />
                <NextPieceDisplay nextPiece={computerState.nextPiece} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
