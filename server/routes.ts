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

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
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
