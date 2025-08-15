import { Card } from "@/components/ui/card";
import { Coins, Users, Timer } from "lucide-react";

interface GameHeaderProps {
  playerName: string;
  credits: number;
  round: number;
  timeLeft?: number;
  totalPlayers?: number;
}

export const GameHeader = ({ 
  playerName, 
  credits, 
  round, 
  timeLeft, 
  totalPlayers = 247 
}: GameHeaderProps) => {
  return (
    <div className="w-full bg-card/80 backdrop-blur border-b border-primary/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Player Info */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary text-glow">
                {playerName}
              </h2>
              <p className="text-sm text-muted-foreground">Pilot #{Math.floor(Math.random() * 1000) + 1}</p>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center gap-6">
            {/* Credits */}
            <Card className="bg-gradient-primary px-4 py-2">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="text-sm text-primary-foreground/80">Credits</p>
                  <p className="text-lg font-bold text-primary-foreground credit-bounce">
                    ₡{credits.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Round */}
            <Card className="bg-gradient-secondary px-4 py-2">
              <div className="text-center">
                <p className="text-sm text-secondary-foreground/80">Round</p>
                <p className="text-lg font-bold text-secondary-foreground">
                  {round}/3
                </p>
              </div>
            </Card>

            {/* Players */}
            <Card className="bg-gradient-card px-4 py-2 border-accent/30">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-lg font-bold text-accent">
                    {totalPlayers}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timer */}
            {timeLeft && (
              <Card className="bg-gradient-card px-4 py-2 border-warning/30">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-lg font-bold text-warning">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};