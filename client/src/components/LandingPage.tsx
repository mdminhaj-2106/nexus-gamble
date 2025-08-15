import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Gamepad2, Trophy, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import rocketHero from "@/assets/rocket-hero.jpg";

interface LandingPageProps {
  onStartGame: (playerName: string, userId: number) => void;
}

interface User {
  id: number;
  username: string;
  balance: number;
}

export const LandingPage = ({ onStartGame }: LandingPageProps) => {
  const [playerName, setPlayerName] = useState("");

  const registerMutation = useMutation({
    mutationFn: async (username: string): Promise<User> => {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) throw new Error("Failed to register user");
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Registration Successful!",
        description: `Welcome to Nexus Gamble, ${user.username}! Starting balance: ₡${user.balance.toLocaleString()}`,
      });
      onStartGame(user.username, user.id);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: "Please try again with a different username.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    },
  });

  const handleStartGame = () => {
    if (playerName.trim()) {
      registerMutation.mutate(playerName.trim());
    }
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${rocketHero})` }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-primary rounded-full animate-ping" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gold rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-ping" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 neon-text">
            NEXUS
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-accent text-glow-accent">
            GAMBLE
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Enter the ultimate space gambling arena. Three rounds. High stakes. Legendary rewards.
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full max-w-md bg-gradient-card border-primary/30 glow-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary text-glow">
              Join the Battle
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your pilot name to begin your gambling journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Enter your pilot name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-lg h-12 bg-muted/50 border-primary/30 focus:border-primary text-center font-medium"
                disabled={registerMutation.isPending}
                onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
              />
            </div>
            
            <Button
              onClick={handleStartGame}
              disabled={!playerName.trim() || registerMutation.isPending}
              variant="hero"
              size="lg"
              className="w-full h-14 text-xl"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 animate-spin" />
                  Registering...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Rocket className="w-6 h-6" />
                  Launch Into Battle
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
          <Card className="bg-gradient-card border-accent/30 text-center p-6">
            <Rocket className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-accent mb-2">Round 1: Rocket Race</h3>
            <p className="text-sm text-muted-foreground">
              Bet on the fastest rocket and watch your credits soar
            </p>
          </Card>

          <Card className="bg-gradient-card border-warning/30 text-center p-6">
            <Gamepad2 className="w-12 h-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-bold text-warning mb-2">Round 2: Precision Shot</h3>
            <p className="text-sm text-muted-foreground">
              Predict the exact range for maximum credit multipliers
            </p>
          </Card>

          <Card className="bg-gradient-card border-gold/30 text-center p-6">
            <Trophy className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gold mb-2">Round 3: Final Nexus</h3>
            <p className="text-sm text-muted-foreground">
              Multiple battles determine the ultimate champion
            </p>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-accent font-bold">247</span> active pilots • 
            <span className="text-gold font-bold"> ₡1,250,000</span> total credits in play
          </p>
        </div>
      </div>
    </div>
  );
};