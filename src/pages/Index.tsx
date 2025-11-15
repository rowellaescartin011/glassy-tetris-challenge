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
          <h1 className="text-5xl font-bold neon-text mb-2" style={{ color: 'hsl(var(--neon-purple))' }}>
            TETRIS BATTLE
          </h1>
          <p className="text-muted-foreground">Player vs Computer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Section */}
          <div className="space-y-4">
            <GameStats
              score={playerState.score}
              level={playerState.level}
              linesCleared={playerState.linesCleared}
              playerName="PLAYER"
            />
            <NextPieceDisplay nextPiece={playerState.nextPiece} />
            <GameControls
              isPaused={playerState.isPaused}
              isGameOver={playerState.isGameOver}
              onTogglePause={handleTogglePause}
              onReset={handleReset}
            />
          </div>

          {/* Player Board */}
          <div className="space-y-4">
            <TetrisBoard board={playerState.board} currentPiece={playerState.currentPiece} />
            {playerState.isGameOver && (
              <div className="glass-card text-center py-6">
                <p className="text-2xl font-bold text-destructive neon-text">GAME OVER</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {playerState.score > computerState.score ? '🎉 You Win!' : computerState.score > playerState.score ? '🤖 Computer Wins!' : "It's a Tie!"}
                </p>
              </div>
            )}
          </div>

          {/* Computer Section */}
          <div className="space-y-4">
            <div className="lg:order-last">
              <GameStats
                score={computerState.score}
                level={computerState.level}
                linesCleared={computerState.linesCleared}
                playerName="COMPUTER"
              />
            </div>
            <NextPieceDisplay nextPiece={computerState.nextPiece} />
            
            {/* Computer Board (Mobile) */}
            <div className="lg:hidden">
              <TetrisBoard board={computerState.board} currentPiece={computerState.currentPiece} />
            </div>
          </div>

          {/* Computer Board (Desktop) - positioned after player board */}
          <div className="hidden lg:block lg:col-start-2 space-y-4">
            <TetrisBoard board={computerState.board} currentPiece={computerState.currentPiece} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
