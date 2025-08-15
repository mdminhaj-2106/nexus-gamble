import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target, Zap, Timer, Crosshair } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProjectileRoundProps {
  playerName: string;
  credits: number;
  onRoundComplete: (bet: number, prediction: number) => void;
}

export const ProjectileRound = ({ playerName, credits, onRoundComplete }: ProjectileRoundProps) => {
  const [prediction, setPrediction] = useState<number>(500);
  const [betAmount, setBetAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(45);
  const [gamePhase, setGamePhase] = useState<'prediction' | 'launching' | 'results'>('prediction');

  useEffect(() => {
    if (gamePhase === 'prediction' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'prediction') {
      setGamePhase('launching');
    }
  }, [timeLeft, gamePhase]);

  const handlePredictionSubmit = () => {
    const bet = parseInt(betAmount);
    
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

    if (prediction < 100 || prediction > 1000) {
      toast({
        title: "Invalid Prediction",
        description: "Prediction must be between 100-1000 meters!",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('launching');
    
    // Simulate projectile launch
    setTimeout(() => {
      onRoundComplete(bet, prediction);
    }, 4000);
  };

  const handleSliderChange = (value: number[]) => {
    setPrediction(value[0]);
  };

  const getPredictionColor = () => {
    if (prediction < 300) return "text-destructive";
    if (prediction < 600) return "text-warning";
    if (prediction < 800) return "text-accent";
    return "text-success";
  };

  const getPredictionRisk = () => {
    if (prediction < 300) return "High Risk, High Reward";
    if (prediction < 600) return "Medium Risk, Good Reward";
    if (prediction < 800) return "Safe Bet, Lower Reward";
    return "Conservative, Minimal Risk";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text">
          PRECISION SHOT
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Predict the exact range of the syringe rocket. Closer predictions earn bigger rewards!
        </p>
        
        {gamePhase === 'prediction' && (
          <div className="flex items-center justify-center gap-2 text-warning">
            <Timer className="w-5 h-5" />
            <span className="text-2xl font-bold">{timeLeft}s</span>
          </div>
        )}
      </div>

      {gamePhase === 'prediction' && (
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

          {/* Prediction Interface */}
          <Card className="mb-8 bg-gradient-card border-accent/30">
            <CardHeader>
              <CardTitle className="text-center text-accent flex items-center justify-center gap-2">
                <Target className="w-6 h-6" />
                Range Prediction
              </CardTitle>
              <CardDescription className="text-center">
                Predict how far the syringe rocket will travel (100-1000 meters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Prediction Display */}
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getPredictionColor()}`}>
                  {prediction}m
                </div>
                <p className="text-sm text-muted-foreground">
                  {getPredictionRisk()}
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-4">
                <Slider
                  value={[prediction]}
                  onValueChange={handleSliderChange}
                  max={1000}
                  min={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>100m (Min)</span>
                  <span>550m (Average)</span>
                  <span>1000m (Max)</span>
                </div>
              </div>

              {/* Direct Input */}
              <div className="space-y-2">
                <Label htmlFor="prediction">Exact Prediction (meters)</Label>
                <Input
                  id="prediction"
                  type="number"
                  value={prediction}
                  onChange={(e) => setPrediction(Math.max(100, Math.min(1000, parseInt(e.target.value) || 100)))}
                  min="100"
                  max="1000"
                  step="10"
                  className="text-center text-xl h-12"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[250, 400, 650, 850].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrediction(value)}
                    className={prediction === value ? "border-primary text-primary" : ""}
                  >
                    {value}m
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Range Visualization */}
          <Card className="mb-8 bg-gradient-card border-warning/30">
            <CardHeader>
              <CardTitle className="text-center text-warning">Range Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/50 via-warning/50 via-accent/50 to-success/50" />
                  <div 
                    className="absolute top-0 w-1 h-full bg-foreground border-2 border-primary transition-all duration-300"
                    style={{ left: `${((prediction - 100) / 900) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs text-center">
                  <div className="text-destructive">
                    <div className="font-bold">100-300m</div>
                    <div>5x Multiplier</div>
                  </div>
                  <div className="text-warning">
                    <div className="font-bold">300-600m</div>
                    <div>3x Multiplier</div>
                  </div>
                  <div className="text-accent">
                    <div className="font-bold">600-800m</div>
                    <div>2x Multiplier</div>
                  </div>
                  <div className="text-success">
                    <div className="font-bold">800-1000m</div>
                    <div>1.5x Multiplier</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handlePredictionSubmit}
              disabled={!betAmount || gamePhase !== 'prediction'}
              variant="rocket"
              size="lg"
              className="text-xl px-12 py-4"
            >
              <Crosshair className="w-6 h-6 mr-2" />
              Lock Prediction: {prediction}m (₡{betAmount || 0})
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
                Syringe Rocket Launching!
              </h3>
              <p className="text-muted-foreground mb-4">
                Your prediction: <span className="text-accent font-bold">{prediction}m</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Bet: ₡{betAmount}
              </p>
              <div className="mt-6 space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '70%'}} />
                </div>
                <p className="text-sm text-muted-foreground">Measuring trajectory...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};