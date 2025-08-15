import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Swords, Timer, Zap, Shield, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Battle {
  id: number;
  fighter1: {
    name: string;
    image: string;
    color: string;
  };
  fighter2: {
    name: string;
    image: string;
    color: string;
  };
}

interface FinalNexusRoundProps {
  playerName: string;
  credits: number;
  onRoundComplete: (totalBet: number, choices: number[]) => void;
}

export const FinalNexusRound = ({ playerName, credits, onRoundComplete }: FinalNexusRoundProps) => {
  const [currentBattle, setCurrentBattle] = useState(0);
  const [betAmount, setBetAmount] = useState<string>("");
  const [selectedFighter, setSelectedFighter] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gamePhase, setGamePhase] = useState<'betting' | 'fighting' | 'results'>('betting');
  const [choices, setChoices] = useState<number[]>([]);
  const [totalBet, setTotalBet] = useState(0);
  
  const battles: Battle[] = [
    {
      id: 1,
      fighter1: { name: "Cyber Wolf", image: "🐺", color: "primary" },
      fighter2: { name: "Plasma Hound", image: "🔥", color: "destructive" }
    },
    {
      id: 2,
      fighter1: { name: "Void Stalker", image: "👤", color: "secondary" },
      fighter2: { name: "Storm Eagle", image: "🦅", color: "accent" }
    },
    {
      id: 3,
      fighter1: { name: "Iron Beast", image: "🤖", color: "warning" },
      fighter2: { name: "Shadow Cat", image: "🐱", color: "primary" }
    },
    // ... we'll simulate 20 battles total
  ];

  // Generate more battles dynamically
  const allBattles = [...battles];
  for (let i = 4; i <= 20; i++) {
    allBattles.push({
      id: i,
      fighter1: { 
        name: `Fighter ${i}A`, 
        image: ["🦊", "🐻", "🦁", "🐯", "🐺"][Math.floor(Math.random() * 5)],
        color: ["primary", "secondary", "accent", "warning"][Math.floor(Math.random() * 4)]
      },
      fighter2: { 
        name: `Fighter ${i}B`, 
        image: ["🔥", "⚡", "❄️", "🌪️", "💎"][Math.floor(Math.random() * 5)],
        color: ["destructive", "accent", "primary", "warning"][Math.floor(Math.random() * 4)]
      }
    });
  }

  const currentBattleData = allBattles[currentBattle];
  const progress = ((currentBattle + 1) / allBattles.length) * 100;

  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'betting') {
      // Auto-submit if time runs out
      handleBattleSubmit();
    }
  }, [timeLeft, gamePhase]);

  const handleBattleSubmit = () => {
    const bet = parseInt(betAmount) || 0;
    const choice = selectedFighter || 1; // Default to fighter 1 if no selection
    
    if (bet > credits - totalBet) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits for this bet!",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('fighting');
    setChoices([...choices, choice]);
    setTotalBet(totalBet + bet);

    // Simulate battle
    setTimeout(() => {
      if (currentBattle >= allBattles.length - 1) {
        // Final battle complete
        onRoundComplete(totalBet + bet, [...choices, choice]);
      } else {
        // Move to next battle
        setCurrentBattle(currentBattle + 1);
        setGamePhase('betting');
        setSelectedFighter(null);
        setBetAmount("");
        setTimeLeft(20);
      }
    }, 2000);
  };

  const getColorClass = (color: string) => {
    const colorMap = {
      primary: "border-primary/50 bg-primary/10 text-primary",
      secondary: "border-secondary/50 bg-secondary/10 text-secondary",
      accent: "border-accent/50 bg-accent/10 text-accent",
      warning: "border-warning/50 bg-warning/10 text-warning",
      destructive: "border-destructive/50 bg-destructive/10 text-destructive",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  const remainingCredits = credits - totalBet;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text">
          FINAL NEXUS
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          20 Battles. Choose your champions. Win it all!
        </p>
        
        {/* Progress */}
        <div className="max-w-md mx-auto mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Battle Progress</span>
            <span className="text-sm font-bold text-primary">
              {currentBattle + 1} / {allBattles.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="flex justify-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Credits Used: <span className="text-warning font-bold">₡{totalBet.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            Remaining: <span className="text-accent font-bold">₡{remainingCredits.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {gamePhase === 'betting' && (
        <>
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-warning">
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-bold">{timeLeft}s</span>
            </div>
          </div>

          {/* Battle Card */}
          <Card className="mb-8 bg-gradient-card border-gold/30">
            <CardHeader>
              <CardTitle className="text-center text-gold flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" />
                Battle #{currentBattle + 1}
              </CardTitle>
              <CardDescription className="text-center">
                Choose your champion for this epic confrontation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fighter 1 */}
                <Card
                  className={`cursor-pointer transition-all duration-300 ${getColorClass(currentBattleData.fighter1.color)} ${
                    selectedFighter === 1 ? 'ring-2 ring-primary scale-105 glow-primary' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedFighter(1)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{currentBattleData.fighter1.image}</div>
                    <h3 className="font-bold text-xl mb-2">{currentBattleData.fighter1.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Fighter A</span>
                    </div>
                    {selectedFighter === 1 && (
                      <div className="mt-4">
                        <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full">
                          SELECTED
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* VS Divider */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-card border border-primary/30 rounded-full p-4">
                    <Swords className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Fighter 2 */}
                <Card
                  className={`cursor-pointer transition-all duration-300 ${getColorClass(currentBattleData.fighter2.color)} ${
                    selectedFighter === 2 ? 'ring-2 ring-primary scale-105 glow-primary' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedFighter(2)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{currentBattleData.fighter2.image}</div>
                    <h3 className="font-bold text-xl mb-2">{currentBattleData.fighter2.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Fighter B</span>
                    </div>
                    {selectedFighter === 2 && (
                      <div className="mt-4">
                        <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full">
                          SELECTED
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Bet Input */}
          <Card className="mb-8 bg-gradient-card border-primary/30 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-primary">Battle Bet</CardTitle>
              <CardDescription className="text-center">
                Available: ₡{remainingCredits.toLocaleString()}
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
                  max={remainingCredits}
                  min="0"
                  className="text-center text-lg h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.floor(remainingCredits * 0.1).toString())}
                  className="flex-1"
                >
                  10%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.floor(remainingCredits * 0.25).toString())}
                  className="flex-1"
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount("0")}
                  className="flex-1"
                >
                  SKIP
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleBattleSubmit}
              variant="rocket"
              size="lg"
              className="text-xl px-12 py-4"
            >
              <Swords className="w-6 h-6 mr-2" />
              {selectedFighter ? 
                `Back ${selectedFighter === 1 ? currentBattleData.fighter1.name : currentBattleData.fighter2.name}` :
                'Auto Select'
              } (₡{betAmount || 0})
            </Button>
          </div>
        </>
      )}

      {gamePhase === 'fighting' && (
        <div className="text-center">
          <Card className="bg-gradient-card border-primary/30 max-w-md mx-auto">
            <CardContent className="p-8">
              <Zap className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-bold text-primary mb-4">
                Battle in Progress!
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedFighter === 1 ? currentBattleData.fighter1.name : currentBattleData.fighter2.name} is fighting...
              </p>
              <div className="flex justify-center gap-4 text-4xl mb-4">
                <span className={selectedFighter === 1 ? 'animate-pulse' : ''}>
                  {currentBattleData.fighter1.image}
                </span>
                <Swords className="w-8 h-8 text-primary mt-4" />
                <span className={selectedFighter === 2 ? 'animate-pulse' : ''}>
                  {currentBattleData.fighter2.image}
                </span>
              </div>
              <div className="mt-6 space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '80%'}} />
                </div>
                <p className="text-sm text-muted-foreground">Determining winner...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};