import { Board, Tetromino } from '@/types/tetris';

interface TetrisBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
}

export const TetrisBoard = ({ board, currentPiece }: TetrisBoardProps) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }
    
    return displayBoard;
  };

  return (
    <div className="glass-card">
      <div className="grid grid-rows-20 gap-[1px] bg-muted/20 p-2 rounded-lg">
        {renderBoard().map((row, y) => (
          <div key={y} className="grid grid-cols-10 gap-[1px]">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className="w-6 h-6 rounded-sm transition-all duration-150 backdrop-blur-sm"
                style={{
                  backgroundColor: cell || 'rgba(255, 255, 255, 0.05)',
                  border: cell ? `2px solid ${cell}` : '1px solid rgba(255, 255, 255, 0.05)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
