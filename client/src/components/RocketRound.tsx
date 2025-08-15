import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Zap, Timer, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RocketRoundProps {
  playerName: string;
  credits: number;
  onRoundComplete: (bet: number, choice: number) => void;
}

export const RocketRound = ({ playerName, credits, onRoundComplete }: RocketRoundProps) => {
  const [selectedRocket, setSelectedRocket] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'launching' | 'results'>('betting');
  const [rockets] = useState([
    { id: 1, name: "Stellar Fury", color: "primary" },
    { id: 2, name: "Nebula Storm", color: "accent" },
    { id: 3, name: "Cosmic Thunder", color: "warning" },
    { id: 4, name: "Galaxy Blaze", color: "destructive" },
    { id: 5, name: "Void Hunter", color: "secondary" },
  ]);

  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'betting') {
      setGamePhase('launching');
    }
  }, [timeLeft, gamePhase]);

  const handleRocketSelect = (rocketId: number) => {
    if (gamePhase !== 'betting') return;
    setSelectedRocket(rocketId);
  };

  const handlePlaceBet = () => {
    const bet = parseInt(betAmount);
    
    if (!selectedRocket) {
      toast({
        title: "Select a Rocket",
        description: "Choose which rocket you think will win!",
        variant: "destructive",
      });
      return;
    }

    if (!bet || bet <= 0) {
      toast({
        title: "Invalid Bet",
        description: "Enter a valid bet amount!",
        variant: "destructive",
      });
      return;
    }

    if (bet > credits) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits for this bet!",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('launching');
    
    // Simulate rocket launch
    setTimeout(() => {
      onRoundComplete(bet, selectedRocket);
    }, 3000);
  };

  const getColorClass = (color: string) => {
    const colorMap = {
      primary: "border-primary/50 bg-primary/10 hover:border-primary",
      accent: "border-accent/50 bg-accent/10 hover:border-accent",
      warning: "border-warning/50 bg-warning/10 hover:border-warning",
      destructive: "border-destructive/50 bg-destructive/10 hover:border-destructive",
      secondary: "border-secondary/50 bg-secondary/10 hover:border-secondary",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  const getButtonVariant = (color: string) => {
    const variantMap = {
      primary: "default",
      accent: "hero",
      warning: "gaming",
      destructive: "danger",
      secondary: "gaming",
    };
    return variantMap[color as keyof typeof variantMap] || "default";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text">
          ROCKET RACE
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Choose your rocket and place your bet. The furthest rocket wins!
        </p>
        
        {gamePhase === 'betting' && (
          <div className="flex items-center justify-center gap-2 text-warning">
            <Timer className="w-5 h-5" />
            <span className="text-2xl font-bold">{timeLeft}s</span>
          </div>
        )}
      </div>

      {gamePhase === 'betting' && (
        <>
          {/* Bet Input */}
          <Card className="mb-8 bg-gradient-card border-primary/30 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-primary">Place Your Bet</CardTitle>
              <CardDescription className="text-center">
                Available Credits: ₡{credits.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bet">Bet Amount</Label>
                <Input
                  id="bet"
                  type="number"
                  placeholder="Enter bet amount..."
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  max={credits}
                  min="1"
                  className="text-center text-lg h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.floor(credits * 0.25).toString())}
                  className="flex-1"
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.floor(credits * 0.5).toString())}
                  className="flex-1"
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(credits.toString())}
                  className="flex-1"
                >
                  ALL IN
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rocket Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {rockets.map((rocket) => (
              <Card
                key={rocket.id}
                className={`cursor-pointer transition-all duration-300 ${getColorClass(rocket.color)} ${
                  selectedRocket === rocket.id 
                    ? 'ring-2 ring-primary scale-105 glow-primary' 
                    : 'hover:scale-102'
                }`}
                onClick={() => handleRocketSelect(rocket.id)}
              >
                <CardContent className="p-6 text-center">
                  <Rocket className={`w-12 h-12 mx-auto mb-4 text-${rocket.color}`} />
                  <h3 className="font-bold text-lg mb-2">{rocket.name}</h3>
                  <p className="text-sm text-muted-foreground">Rocket #{rocket.id}</p>
                  {selectedRocket === rocket.id && (
                    <div className="mt-4">
                      <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full">
                        SELECTED
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Place Bet Button */}
          <div className="text-center">
            <Button
              onClick={handlePlaceBet}
              disabled={!selectedRocket || !betAmount || gamePhase !== 'betting'}
              variant="rocket"
              size="lg"
              className="text-xl px-12 py-4"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Launch Bet: ₡{betAmount || 0}
            </Button>
          </div>
        </>
      )}

      {gamePhase === 'launching' && (
        <div className="text-center">
          <Card className="bg-gradient-card border-primary/30 max-w-md mx-auto">
            <CardContent className="p-8">
              <Zap className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-bold text-primary mb-4">
                Rockets Launching!
              </h3>
              <p className="text-muted-foreground">
                Your rocket {rockets.find(r => r.id === selectedRocket)?.name} is competing...
              </p>
              <div className="mt-6 space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}} />
                </div>
                <p className="text-sm text-muted-foreground">Calculating results...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};