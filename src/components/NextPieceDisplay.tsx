import { Tetromino } from '@/types/tetris';

interface NextPieceDisplayProps {
  nextPiece: Tetromino | null;
}

export const NextPieceDisplay = ({ nextPiece }: NextPieceDisplayProps) => {
  if (!nextPiece) return null;

  return (
    <div className="glass-card">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3">Next</h3>
      <div className="flex items-center justify-center p-4 bg-muted/10 rounded-lg">
        <div className="grid gap-[2px]">
          {nextPiece.shape.map((row, y) => (
            <div key={y} className="flex gap-[2px]">
              {row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-4 h-4 rounded-sm transition-all backdrop-blur-sm"
                  style={{
                    backgroundColor: cell ? nextPiece.color : 'transparent',
                    boxShadow: cell 
                      ? `0 0 15px ${nextPiece.color}, 0 0 30px ${nextPiece.color}, inset 0 0 8px rgba(255, 255, 255, 0.5)` 
                      : 'none',
                    border: cell ? `1px solid ${nextPiece.color}` : 'none',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
