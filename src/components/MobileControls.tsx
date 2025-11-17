import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, MoveDown } from 'lucide-react';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  disabled?: boolean;
}

export const MobileControls = ({ 
  onMoveLeft, 
  onMoveRight, 
  onMoveDown, 
  onRotate, 
  onHardDrop,
  disabled = false 
}: MobileControlsProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 md:hidden">
      <div className="flex items-center justify-between gap-3">
        {/* Left side - Movement controls */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <Button
              onClick={onRotate}
              disabled={disabled}
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 active:bg-primary/40"
              variant="ghost"
              size="lg"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onMoveLeft}
              disabled={disabled}
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 active:bg-primary/40"
              variant="ghost"
              size="lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={onMoveDown}
              disabled={disabled}
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 active:bg-primary/40"
              variant="ghost"
              size="lg"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
            <Button
              onClick={onMoveRight}
              disabled={disabled}
              className="w-16 h-16 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 active:bg-primary/40"
              variant="ghost"
              size="lg"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Right side - Hard drop */}
        <div>
          <Button
            onClick={onHardDrop}
            disabled={disabled}
            className="w-20 h-32 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 active:bg-secondary/40 flex flex-col gap-1"
            variant="ghost"
            size="lg"
          >
            <MoveDown className="w-8 h-8" />
            <span className="text-xs">Drop</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
