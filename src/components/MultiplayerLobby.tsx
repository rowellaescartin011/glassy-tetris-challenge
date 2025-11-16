import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface MultiplayerLobbyProps {
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  roomCode: string | null;
  isHost: boolean;
  opponentConnected: boolean;
}

export const MultiplayerLobby = ({
  onCreateRoom,
  onJoinRoom,
  roomCode,
  isHost,
  opponentConnected,
}: MultiplayerLobbyProps) => {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      onJoinRoom(joinCode.toUpperCase());
    }
  };

  if (roomCode) {
    return (
      <Card className="glass-card p-6 max-w-md mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-purple))' }}>
            {isHost ? 'Room Created!' : 'Joined Room!'}
          </h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">Room Code:</p>
            <p className="text-3xl font-bold tracking-wider" style={{ color: 'hsl(var(--neon-cyan))' }}>
              {roomCode}
            </p>
          </div>
          <div className="pt-4">
            {opponentConnected ? (
              <div className="space-y-2">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-green-500 font-semibold">Opponent Connected!</p>
                <p className="text-sm text-muted-foreground">Game will start shortly...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-yellow-500">Waiting for opponent...</p>
                {isHost && (
                  <p className="text-sm text-muted-foreground">Share this code with your friend!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold neon-text" style={{ color: 'hsl(var(--neon-purple))' }}>
          Multiplayer Mode
        </h2>
        
        <div className="space-y-4">
          <Button
            onClick={onCreateRoom}
            className="w-full"
            style={{ backgroundColor: 'hsl(var(--neon-cyan))', color: 'hsl(var(--background))' }}
          >
            Create Room
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="text-center text-lg tracking-wider"
              maxLength={6}
            />
            <Button
              onClick={handleJoinRoom}
              className="w-full"
              style={{ backgroundColor: 'hsl(var(--neon-pink))', color: 'hsl(var(--background))' }}
              disabled={!joinCode.trim()}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
