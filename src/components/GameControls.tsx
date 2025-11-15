import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCw } from 'lucide-react';

interface GameControlsProps {
  isPaused: boolean;
  isGameOver: boolean;
  onTogglePause: () => void;
  onReset: () => void;
}

export const GameControls = ({ isPaused, isGameOver, onTogglePause, onReset }: GameControlsProps) => {
  return (
    <div className="glass-card">
      <div className="space-y-3">
        {!isGameOver && (
          <Button
            onClick={onTogglePause}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 neon-glow"
            variant="ghost"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            )}
          </Button>
        )}
        
        <Button
          onClick={onReset}
          className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30"
          variant="ghost"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          {isGameOver ? 'Play Again' : 'Reset'}
        </Button>
      </div>
      
      {!isGameOver && (
        <div className="mt-6 p-4 bg-muted/10 rounded-lg">
          <p className="text-xs font-semibold text-foreground/60 mb-2">Controls</p>
          <div className="space-y-1 text-xs text-foreground/50">
            <p>← → : Move</p>
            <p>↑ : Rotate</p>
            <p>↓ : Soft Drop</p>
            <p>Space : Hard Drop</p>
          </div>
        </div>
      )}
    </div>
  );
};
