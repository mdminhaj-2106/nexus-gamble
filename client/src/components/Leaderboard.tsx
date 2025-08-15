import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react";

interface Player {
  id: number;
  name: string;
  credits: number;
  rank: number;
  change: number; // Position change from last update
  isCurrentPlayer?: boolean;
}

interface LeaderboardProps {
  players: Player[];
  currentPlayer: string;
  round: number;
}

export const Leaderboard = ({ players, currentPlayer, round }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-warning" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number, isCurrentPlayer: boolean) => {
    if (isCurrentPlayer) {
      return "border-primary/50 bg-primary/10 glow-primary";
    }
    
    switch (rank) {
      case 1:
        return "border-gold/50 bg-gold/10";
      case 2:
        return "border-muted/50 bg-muted/10";
      case 3:
        return "border-warning/50 bg-warning/10";
      default:
        return "border-border bg-card/50";
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-success" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text">
          LEADERBOARD
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Round {round} Results - Credit Distribution
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <Badge variant="outline" className="border-success/50 text-success">
            {players.filter(p => p.change > 0).length} Winners
          </Badge>
          <Badge variant="outline" className="border-destructive/50 text-destructive">
            {players.filter(p => p.change < 0).length} Lost Credits
          </Badge>
          <Badge variant="outline" className="border-muted/50">
            ₡{players.reduce((sum, p) => sum + p.credits, 0).toLocaleString()} Total Credits
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {players.slice(0, 20).map((player, index) => (
          <Card
            key={player.id}
            className={`transition-all duration-500 ${getRankStyle(player.rank, player.isCurrentPlayer)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center gap-2">
                    {getRankIcon(player.rank)}
                    {getChangeIcon(player.change) && (
                      <div className="flex items-center gap-1">
                        {getChangeIcon(player.change)}
                        <span className={`text-xs ${player.change > 0 ? 'text-success' : 'text-destructive'}`}>
                          {Math.abs(player.change)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div>
                    <h3 className={`font-bold text-lg ${player.isCurrentPlayer ? 'text-primary text-glow' : ''}`}>
                      {player.name}
                      {player.isCurrentPlayer && (
                        <Badge variant="outline" className="ml-2 border-primary text-primary">
                          YOU
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pilot #{player.id}
                    </p>
                  </div>
                </div>

                {/* Credits */}
                <div className="text-right">
                  <p className={`text-2xl font-bold ${player.rank <= 3 ? 'text-gold' : 'text-foreground'}`}>
                    ₡{player.credits.toLocaleString()}
                  </p>
                  {player.change !== 0 && (
                    <p className={`text-sm ${player.change > 0 ? 'text-success' : 'text-destructive'}`}>
                      {player.change > 0 ? '+' : ''}₡{Math.abs(player.change * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show position for current player if not in top 20 */}
      {!players.slice(0, 20).some(p => p.isCurrentPlayer) && (
        <div className="mt-8">
          <Card className="border-primary/50 bg-primary/10 glow-primary">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Your Position</p>
                {players.find(p => p.isCurrentPlayer) && (
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-2xl font-bold text-primary">
                      #{players.find(p => p.isCurrentPlayer)?.rank}
                    </span>
                    <span className="text-xl font-bold">
                      {players.find(p => p.isCurrentPlayer)?.name}
                    </span>
                    <span className="text-xl font-bold text-accent">
                      ₡{players.find(p => p.isCurrentPlayer)?.credits.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Round Summary */}
      <Card className="mt-8 bg-gradient-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-center text-accent">Round {round} Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-success">
                {players.filter(p => p.change > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Credit Gainers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gold">
                ₡{Math.max(...players.map(p => p.credits)).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Highest Credits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                ₡{Math.floor(players.reduce((sum, p) => sum + p.credits, 0) / players.length).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Average Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};