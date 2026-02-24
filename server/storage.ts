import { db } from "./db";
import {
  fichas,
  type Ficha,
  type InsertFicha,
  type UpdateFichaRequest,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getFichas(): Promise<Ficha[]>;
  getFicha(id: number): Promise<Ficha | undefined>;
  createFicha(ficha: InsertFicha, userId: string): Promise<Ficha>;
  updateFicha(id: number, updates: UpdateFichaRequest): Promise<Ficha>;
  deleteFicha(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getFichas(): Promise<Ficha[]> {
    return await db.select().from(fichas);
  }

  async getFicha(id: number): Promise<Ficha | undefined> {
    const [ficha] = await db.select().from(fichas).where(eq(fichas.id, id));
    return ficha;
  }

  async createFicha(ficha: InsertFicha, userId: string): Promise<Ficha> {
    const [newFicha] = await db.insert(fichas).values({ ...ficha, userId }).returning();
    return newFicha;
  }

  async updateFicha(id: number, updates: UpdateFichaRequest): Promise<Ficha> {
    const [updatedFicha] = await db
      .update(fichas)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fichas.id, id))
      .returning();
    return updatedFicha;
  }

  async deleteFicha(id: number): Promise<void> {
    await db.delete(fichas).where(eq(fichas.id, id));
  }
}

export const storage = new DatabaseStorage();
