import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserBalance(id: number, balance: number): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Pre-populate with some test data
    this.users.set(1, { id: 1, username: "player1", password: "pass", balance: 15000 });
    this.users.set(2, { id: 2, username: "gamer_pro", password: "pass", balance: 25000 });
    this.users.set(3, { id: 3, username: "nexus_master", password: "pass", balance: 8500 });
    this.currentId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, balance: 10000 };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => a.id - b.id);
  }

  async updateUserBalance(id: number, balance: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.balance = balance;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
