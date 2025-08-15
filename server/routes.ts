import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
