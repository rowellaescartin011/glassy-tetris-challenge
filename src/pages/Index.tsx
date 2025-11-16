import { useEffect, useState } from 'react';
import { useTetrisGame } from '@/hooks/useTetrisGame';
import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import { TetrisBoard } from '@/components/TetrisBoard';
import { NextPieceDisplay } from '@/components/NextPieceDisplay';
import { GameStats } from '@/components/GameStats';
import { GameControls } from '@/components/GameControls';
import { HeartParticles } from '@/components/HeartParticles';
import { MultiplayerLobby } from '@/components/MultiplayerLobby';
import { Button } from '@/components/ui/button';

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
    roomCode,
    isHost,
    opponentConnected,
    opponentGameState,
    createRoom,
    joinRoom,
    leaveRoom,
  } = useMultiplayerGame(playerState);

  const [showPlayerParticles, setShowPlayerParticles] = useState(false);
  const [showOpponentParticles, setShowOpponentParticles] = useState(false);
  const [prevPlayerLines, setPrevPlayerLines] = useState(0);
  const [prevOpponentLines, setPrevOpponentLines] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Track line clears for player
  useEffect(() => {
    if (playerState.linesCleared > prevPlayerLines) {
      setShowPlayerParticles(true);
    }
    setPrevPlayerLines(playerState.linesCleared);
  }, [playerState.linesCleared, prevPlayerLines]);

  // Track line clears for opponent
  useEffect(() => {
    if (opponentGameState && opponentGameState.linesCleared > prevOpponentLines) {
      setShowOpponentParticles(true);
    }
    if (opponentGameState) {
      setPrevOpponentLines(opponentGameState.linesCleared);
    }
  }, [opponentGameState?.linesCleared, prevOpponentLines]);

  // Start game when both players are connected
  useEffect(() => {
    if (opponentConnected && !gameStarted) {
      setGameStarted(true);
    }
  }, [opponentConnected, gameStarted]);

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
  };

  const handleReset = () => {
    resetPlayerGame();
    setPrevPlayerLines(0);
    setPrevOpponentLines(0);
    setGameStarted(false);
  };

  const handleLeaveRoom = async () => {
    await leaveRoom();
    setGameStarted(false);
    resetPlayerGame();
    setPrevPlayerLines(0);
    setPrevOpponentLines(0);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <MultiplayerLobby
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          roomCode={roomCode}
          isHost={isHost}
          opponentConnected={opponentConnected}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {showPlayerParticles && (
        <HeartParticles onComplete={() => setShowPlayerParticles(false)} />
      )}
      {showOpponentParticles && (
        <HeartParticles onComplete={() => setShowOpponentParticles(false)} />
      )}
      
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
        {(playerState.isGameOver || opponentGameState?.isGameOver) && (
          <div className="glass-card text-center py-6 mb-6 max-w-md mx-auto">
            <p className="text-2xl font-bold text-destructive neon-text mb-2">GAME OVER</p>
            <p className="text-lg text-foreground font-semibold">
              {playerState.isGameOver && !opponentGameState?.isGameOver
                ? '😢 You Lost!'
                : !playerState.isGameOver && opponentGameState?.isGameOver
                ? '🎉 You Win!'
                : playerState.score > (opponentGameState?.score || 0)
                ? '🎉 You Win!'
                : (opponentGameState?.score || 0) > playerState.score
                ? '😢 You Lost!'
                : "It's a Tie!"}
            </p>
            <div className="mt-4 flex justify-center gap-8 text-sm">
              <div>
                <p className="text-muted-foreground">Your Score</p>
                <p className="text-xl font-bold text-primary">{playerState.score.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Opponent Score</p>
                <p className="text-xl font-bold text-secondary">{opponentGameState?.score.toLocaleString() || 0}</p>
              </div>
            </div>
            <Button
              onClick={handleLeaveRoom}
              className="mt-4"
              style={{ backgroundColor: 'hsl(var(--neon-pink))' }}
            >
              Leave Room
            </Button>
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

          {/* Opponent Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-orange))' }}>
                OPPONENT
              </h2>
            </div>
            
            <div className="grid grid-cols-[1fr,auto] gap-4">
              <TetrisBoard 
                board={opponentGameState?.board || playerState.board} 
                currentPiece={opponentGameState?.currentPiece || null} 
              />
              
              <div className="space-y-4">
                <GameStats
                  score={opponentGameState?.score || 0}
                  level={opponentGameState?.level || 1}
                  linesCleared={opponentGameState?.linesCleared || 0}
                  playerName="Stats"
                />
                <NextPieceDisplay nextPiece={opponentGameState?.nextPiece || null} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
