interface GameStatsProps {
  score: number;
  level: number;
  linesCleared: number;
  playerName: string;
}

export const GameStats = ({ score, level, linesCleared, playerName }: GameStatsProps) => {
  return (
    <div className="glass-card space-y-4">
      <h3 className="text-lg font-bold neon-text" style={{ color: 'hsl(var(--neon-purple))' }}>
        {playerName}
      </h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Score</p>
          <p className="text-2xl font-bold text-foreground">{score.toLocaleString()}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Level</p>
          <p className="text-xl font-semibold text-secondary">{level}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Lines</p>
          <p className="text-xl font-semibold text-accent">{linesCleared}</p>
        </div>
      </div>
    </div>
  );
};
