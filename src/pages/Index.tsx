import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { GameHeader } from "@/components/GameHeader";
import { RocketRound } from "@/components/RocketRound";
import { ProjectileRound } from "@/components/ProjectileRound";
import { FinalNexusRound } from "@/components/FinalNexusRound";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type GamePhase = 'landing' | 'round1' | 'leaderboard1' | 'round2' | 'leaderboard2' | 'round3' | 'final';

const Index = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('landing');
  const [playerName, setPlayerName] = useState("");
  const [credits, setCredits] = useState(10000);
  const [round, setRound] = useState(0);

  // Mock player data for leaderboard
  const generateMockPlayers = (currentPlayerName: string, currentCredits: number) => {
    const mockNames = [
      "CyberWolf", "NeonHunter", "StarPilot", "VoidRider", "CosmicAce",
      "QuantumFox", "NebulaCat", "PlasmaShark", "GalaxyWing", "StormBreaker",
      "DarkMatter", "SolarFlare", "MeteorStrike", "BlackHole", "Supernova",
      "RocketFuel", "LaserBeam", "HyperDrive", "WarpSpeed", "TurboBlast"
    ];
    
    const players = [];
    
    // Add current player
    players.push({
      id: 1,
      name: currentPlayerName,
      credits: currentCredits,
      rank: 1,
      change: Math.floor(Math.random() * 10) - 5,
      isCurrentPlayer: true
    });

    // Add mock players
    for (let i = 0; i < 50; i++) {
      players.push({
        id: i + 2,
        name: mockNames[Math.floor(Math.random() * mockNames.length)] + Math.floor(Math.random() * 999),
        credits: Math.floor(Math.random() * 50000) + 1000,
        rank: i + 2,
        change: Math.floor(Math.random() * 20) - 10,
        isCurrentPlayer: false
      });
    }

    // Sort by credits and update ranks
    players.sort((a, b) => b.credits - a.credits);
    players.forEach((player, index) => {
      player.rank = index + 1;
    });

    return players;
  };

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setGamePhase('round1');
    setRound(1);
    toast({
      title: "Game Started!",
      description: `Welcome to Nexus Gamble, ${name}!`,
    });
  };

  const handleRound1Complete = (bet: number, choice: number) => {
    // Simulate win/loss
    const win = Math.random() > 0.4; // 60% win chance
    const multiplier = win ? 2.5 : 0;
    const newCredits = credits - bet + (bet * multiplier);
    
    setCredits(Math.floor(newCredits));
    setGamePhase('leaderboard1');
    
    toast({
      title: win ? "Rocket Victory!" : "Rocket Crashed!",
      description: win 
        ? `Your rocket won! +₡${Math.floor(bet * multiplier - bet).toLocaleString()}`
        : `Your rocket didn't make it. -₡${bet.toLocaleString()}`,
      variant: win ? "default" : "destructive"
    });
  };

  const handleRound2Complete = (bet: number, prediction: number) => {
    // Simulate projectile result
    const actualRange = Math.floor(Math.random() * 900) + 100; // 100-1000
    const accuracy = Math.abs(actualRange - prediction);
    const win = accuracy <= 100; // Within 100m = win
    
    let multiplier = 0;
    if (accuracy <= 20) multiplier = 5;
    else if (accuracy <= 50) multiplier = 3;
    else if (accuracy <= 100) multiplier = 2;
    
    const newCredits = credits - bet + (bet * multiplier);
    setCredits(Math.floor(newCredits));
    setGamePhase('leaderboard2');
    
    toast({
      title: `Target: ${actualRange}m`,
      description: win 
        ? `Amazing shot! Off by ${accuracy}m. +₡${Math.floor(bet * multiplier - bet).toLocaleString()}`
        : `Missed! Off by ${accuracy}m. -₡${bet.toLocaleString()}`,
      variant: win ? "default" : "destructive"
    });
  };

  const handleRound3Complete = (totalBet: number, choices: number[]) => {
    // Simulate final nexus results
    const wins = choices.filter(() => Math.random() > 0.5).length;
    const winRate = wins / choices.length;
    
    let multiplier = 0;
    if (winRate >= 0.8) multiplier = 4;
    else if (winRate >= 0.6) multiplier = 2.5;
    else if (winRate >= 0.4) multiplier = 1.5;
    
    const newCredits = credits - totalBet + (totalBet * multiplier);
    setCredits(Math.floor(newCredits));
    setGamePhase('final');
    
    toast({
      title: "Final Nexus Complete!",
      description: `Won ${wins}/${choices.length} battles! ${multiplier > 1 ? `+₡${Math.floor(totalBet * multiplier - totalBet).toLocaleString()}` : `-₡${totalBet.toLocaleString()}`}`,
      variant: multiplier > 1 ? "default" : "destructive"
    });
  };

  const handleNextRound = () => {
    if (gamePhase === 'leaderboard1') {
      setGamePhase('round2');
      setRound(2);
    } else if (gamePhase === 'leaderboard2') {
      setGamePhase('round3');
      setRound(3);
    }
  };

  const handlePlayAgain = () => {
    setGamePhase('landing');
    setPlayerName("");
    setCredits(10000);
    setRound(0);
  };

  return (
    <div className="min-h-screen animated-bg">
      {gamePhase === 'landing' && (
        <LandingPage onStartGame={handleStartGame} />
      )}
      
      {gamePhase !== 'landing' && gamePhase !== 'final' && (
        <GameHeader 
          playerName={playerName}
          credits={credits}
          round={round}
          timeLeft={gamePhase.includes('round') ? 30 : undefined}
        />
      )}
      
      {gamePhase === 'round1' && (
        <RocketRound
          playerName={playerName}
          credits={credits}
          onRoundComplete={handleRound1Complete}
        />
      )}
      
      {gamePhase === 'round2' && (
        <ProjectileRound
          playerName={playerName}
          credits={credits}
          onRoundComplete={handleRound2Complete}
        />
      )}
      
      {gamePhase === 'round3' && (
        <FinalNexusRound
          playerName={playerName}
          credits={credits}
          onRoundComplete={handleRound3Complete}
        />
      )}
      
      {(gamePhase === 'leaderboard1' || gamePhase === 'leaderboard2') && (
        <div>
          <Leaderboard
            players={generateMockPlayers(playerName, credits)}
            currentPlayer={playerName}
            round={round}
          />
          <div className="text-center py-8">
            <Button
              onClick={handleNextRound}
              variant="hero"
              size="lg"
              className="text-xl px-12 py-4"
            >
              Continue to Round {round + 1}
            </Button>
          </div>
        </div>
      )}
      
      {gamePhase === 'final' && (
        <div>
          <Leaderboard
            players={generateMockPlayers(playerName, credits)}
            currentPlayer={playerName}
            round={3}
          />
          <div className="text-center py-8 space-y-4">
            <h2 className="text-4xl font-bold text-gold text-glow-gold">
              Game Complete!
            </h2>
            <p className="text-xl text-muted-foreground">
              Final Credits: ₡{credits.toLocaleString()}
            </p>
            <Button
              onClick={handlePlayAgain}
              variant="hero"
              size="lg"
              className="text-xl px-12 py-4"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
