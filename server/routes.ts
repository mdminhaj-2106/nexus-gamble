import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration route
  app.post("/api/users/register", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username || username.trim().length < 2) {
        return res.status(400).json({ message: "Username must be at least 2 characters long" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username.trim());
      if (existingUser) {
        return res.json(existingUser); // Return existing user
      }

      // Create new user with default password and balance
      const newUser = await storage.createUser({
        username: username.trim(),
        password: "temp_password", // In a real app, this would be properly handled
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Game control storage
  let gameResults = {
    round1Winner: null as number | null,
    round2Range: null as number | null
  };

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Game control routes
  app.post("/api/admin/round1", async (req, res) => {
    try {
      const { winner } = req.body;
      if (!winner || ![1, 2, 3].includes(winner)) {
        return res.status(400).json({ message: "Winner must be 1, 2, or 3" });
      }
      gameResults.round1Winner = winner;
      res.json({ winner, message: "Round 1 result set successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to set round 1 result" });
    }
  });

  app.post("/api/admin/round2", async (req, res) => {
    try {
      const { range } = req.body;
      if (!range || range < 100 || range > 1000) {
        return res.status(400).json({ message: "Range must be between 100 and 1000" });
      }
      gameResults.round2Range = range;
      res.json({ range, message: "Round 2 result set successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to set round 2 result" });
    }
  });

  app.get("/api/game/results", async (req, res) => {
    res.json(gameResults);
  });

  app.patch("/api/admin/users/:id/balance", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { balance } = req.body;
      
      if (isNaN(id) || typeof balance !== "number") {
        return res.status(400).json({ message: "Invalid data" });
      }

      const user = await storage.updateUserBalance(id, balance);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update balance" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
