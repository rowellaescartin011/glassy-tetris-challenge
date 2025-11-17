import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameModeSelectorProps {
  onSelectMode: (mode: '1-player' | '2-player' | 'vs-computer') => void;
}

export const GameModeSelector = ({ onSelectMode }: GameModeSelectorProps) => {
  return (
    <Card className="glass-card p-8 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold neon-text mb-2" style={{ color: 'hsl(var(--neon-purple))' }}>
          TETRIS BATTLE
        </h1>
        <p className="text-muted-foreground mb-8">Choose Your Game Mode</p>
        
        <div className="space-y-4">
          <Button
            onClick={() => onSelectMode('1-player')}
            className="w-full h-16 text-xl"
            style={{ backgroundColor: 'hsl(var(--neon-cyan))', color: 'hsl(var(--background))' }}
          >
            1 Player
          </Button>

          <Button
            onClick={() => onSelectMode('vs-computer')}
            className="w-full h-16 text-xl"
            style={{ backgroundColor: 'hsl(var(--neon-orange))', color: 'hsl(var(--background))' }}
          >
            vs Computer
          </Button>

          <Button
            onClick={() => onSelectMode('2-player')}
            className="w-full h-16 text-xl"
            style={{ backgroundColor: 'hsl(var(--neon-pink))', color: 'hsl(var(--background))' }}
          >
            2 Players (Same Screen)
          </Button>
        </div>
      </div>
    </Card>
  );
};
