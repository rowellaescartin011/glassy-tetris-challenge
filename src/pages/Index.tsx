import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTetrisGame } from '@/hooks/useTetrisGame';
import { useTetrisGame2P } from '@/hooks/useTetrisGame2P';
import { TetrisBoard } from '@/components/TetrisBoard';
import { NextPieceDisplay } from '@/components/NextPieceDisplay';
import { GameStats } from '@/components/GameStats';
import { GameControls } from '@/components/GameControls';
import { HeartParticles } from '@/components/HeartParticles';
import { GameModeSelector } from '@/components/GameModeSelector';
import { MobileControls } from '@/components/MobileControls';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [gameMode, setGameMode] = useState<'1-player' | '2-player' | null>(null);
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const player1 = useTetrisGame();
  const player2 = useTetrisGame2P(gameMode === '2-player');

  const [showPlayer1Particles, setShowPlayer1Particles] = useState(false);
  const [showPlayer2Particles, setShowPlayer2Particles] = useState(false);
  const [prevPlayer1Lines, setPrevPlayer1Lines] = useState(0);
  const [prevPlayer2Lines, setPrevPlayer2Lines] = useState(0);

  // Track line clears for player 1
  useEffect(() => {
    if (player1.gameState.linesCleared > prevPlayer1Lines) {
      setShowPlayer1Particles(true);
    }
    setPrevPlayer1Lines(player1.gameState.linesCleared);
  }, [player1.gameState.linesCleared, prevPlayer1Lines]);

  // Track line clears for player 2
  useEffect(() => {
    if (gameMode === '2-player' && player2.gameState.linesCleared > prevPlayer2Lines) {
      setShowPlayer2Particles(true);
    }
    setPrevPlayer2Lines(player2.gameState.linesCleared);
  }, [player2.gameState.linesCleared, prevPlayer2Lines, gameMode]);

  // Player 1 controls (Arrow keys)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (player1.gameState.isGameOver || player1.gameState.isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          player1.moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          player1.moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          player1.moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          player1.rotate();
          break;
        case ' ':
          e.preventDefault();
          player1.hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player1]);

  // Player 2 controls (WASD)
  useEffect(() => {
    if (gameMode !== '2-player') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (player2.gameState.isGameOver || player2.gameState.isPaused) return;

      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          player2.moveLeft();
          break;
        case 'd':
          e.preventDefault();
          player2.moveRight();
          break;
        case 's':
          e.preventDefault();
          player2.moveDown();
          break;
        case 'w':
          e.preventDefault();
          player2.rotate();
          break;
        case 'shift':
          e.preventDefault();
          player2.hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player2, gameMode]);

  const handleTogglePause = () => {
    player1.togglePause();
    if (gameMode === '2-player') {
      player2.togglePause();
    }
  };

  const handleReset = () => {
    player1.resetGame();
    if (gameMode === '2-player') {
      player2.resetGame();
    }
    setPrevPlayer1Lines(0);
    setPrevPlayer2Lines(0);
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    player1.resetGame();
    player2.resetGame();
    setPrevPlayer1Lines(0);
    setPrevPlayer2Lines(0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!gameMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <GameModeSelector onSelectMode={setGameMode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      
      {showPlayer1Particles && (
        <HeartParticles onComplete={() => setShowPlayer1Particles(false)} />
      )}
      {showPlayer2Particles && (
        <HeartParticles onComplete={() => setShowPlayer2Particles(false)} />
      )}
      
      <div className="w-full max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-text mb-2" style={{ color: 'hsl(var(--neon-purple))' }}>
            TETRIS BATTLE
          </h1>
          <p className="text-muted-foreground">
            {gameMode === '1-player' ? 'Single Player' : 'Player 1 vs Player 2'}
          </p>
        </div>

        {/* Game Controls - Centered */}
        <div className="max-w-xs mx-auto mb-6 space-y-2">
          <GameControls
            isPaused={player1.gameState.isPaused}
            isGameOver={player1.gameState.isGameOver || (gameMode === '2-player' && player2.gameState.isGameOver)}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
          />
          <button
            onClick={handleBackToMenu}
            className="w-full px-4 py-2 rounded-md text-sm"
            style={{ backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))' }}
          >
            Back to Menu
          </button>
        </div>

        {/* Game Over Message */}
        {(player1.gameState.isGameOver || (gameMode === '2-player' && player2.gameState.isGameOver)) && (
          <div className="glass-card text-center py-6 mb-6 max-w-md mx-auto">
            <p className="text-2xl font-bold text-destructive neon-text mb-2">GAME OVER</p>
            {gameMode === '1-player' ? (
              <div className="mt-4">
                <p className="text-lg text-foreground font-semibold mb-2">Final Score</p>
                <p className="text-3xl font-bold text-primary">{player1.gameState.score.toLocaleString()}</p>
              </div>
            ) : (
              <>
                <p className="text-lg text-foreground font-semibold">
                  {player1.gameState.isGameOver && !player2.gameState.isGameOver
                    ? '🎉 Player 2 Wins!'
                    : !player1.gameState.isGameOver && player2.gameState.isGameOver
                    ? '🎉 Player 1 Wins!'
                    : player1.gameState.score > player2.gameState.score
                    ? '🎉 Player 1 Wins!'
                    : player2.gameState.score > player1.gameState.score
                    ? '🎉 Player 2 Wins!'
                    : "It's a Tie!"}
                </p>
                <div className="mt-4 flex justify-center gap-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">Player 1 Score</p>
                    <p className="text-xl font-bold text-primary">{player1.gameState.score.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Player 2 Score</p>
                    <p className="text-xl font-bold text-secondary">{player2.gameState.score.toLocaleString()}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Main Game Area */}
        <div className={`grid gap-6 lg:gap-8 ${gameMode === '2-player' ? 'grid-cols-1 lg:grid-cols-2' : 'max-w-md mx-auto'}`}>
          {/* Player 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-cyan))' }}>
                {gameMode === '1-player' ? 'PLAYER' : 'PLAYER 1'}
              </h2>
              {gameMode === '2-player' && (
                <p className="text-sm text-muted-foreground">Arrow Keys + Space</p>
              )}
            </div>
            
            <div className="grid grid-cols-[1fr,auto] gap-4">
              <TetrisBoard board={player1.gameState.board} currentPiece={player1.gameState.currentPiece} />
              
              <div className="space-y-4">
                <GameStats
                  score={player1.gameState.score}
                  level={player1.gameState.level}
                  linesCleared={player1.gameState.linesCleared}
                  playerName="Stats"
                />
                <NextPieceDisplay nextPiece={player1.gameState.nextPiece} />
              </div>
            </div>

            {/* Mobile Controls for Player 1 */}
            <MobileControls
              onMoveLeft={player1.moveLeft}
              onMoveRight={player1.moveRight}
              onMoveDown={player1.moveDown}
              onRotate={player1.rotate}
              onHardDrop={player1.hardDrop}
              disabled={player1.gameState.isGameOver || player1.gameState.isPaused}
            />
          </div>

          {/* Player 2 (only in 2-player mode) */}
          {gameMode === '2-player' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-orange))' }}>
                  PLAYER 2
                </h2>
                <p className="text-sm text-muted-foreground">WASD + Shift</p>
              </div>
              
              <div className="grid grid-cols-[1fr,auto] gap-4">
                <TetrisBoard board={player2.gameState.board} currentPiece={player2.gameState.currentPiece} />
                
                <div className="space-y-4">
                  <GameStats
                    score={player2.gameState.score}
                    level={player2.gameState.level}
                    linesCleared={player2.gameState.linesCleared}
                    playerName="Stats"
                  />
                  <NextPieceDisplay nextPiece={player2.gameState.nextPiece} />
                </div>
              </div>

              {/* Mobile Controls for Player 2 */}
              <MobileControls
                onMoveLeft={player2.moveLeft}
                onMoveRight={player2.moveRight}
                onMoveDown={player2.moveDown}
                onRotate={player2.rotate}
                onHardDrop={player2.hardDrop}
                disabled={player2.gameState.isGameOver || player2.gameState.isPaused}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
