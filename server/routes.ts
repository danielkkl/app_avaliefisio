import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.fichas.list.path, isAuthenticated, async (req, res) => {
    const allFichas = await storage.getFichas();
    res.json(allFichas);
  });

  app.get(api.fichas.get.path, isAuthenticated, async (req, res) => {
    const ficha = await storage.getFicha(Number(req.params.id));
    if (!ficha) {
      return res.status(404).json({ message: "Avaliação não encontrada" });
    }
    res.json(ficha);
  });

  app.post(api.fichas.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.fichas.create.input.parse(req.body);
      const user = (req as any).user;
      const userId = user.id || user.claims?.sub || user.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "ID do usuário não encontrado na sessão" });
      }
      
      const newFicha = await storage.createFicha(input, userId);
      res.status(201).json(newFicha);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Dados inválidos: " + err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.put(api.fichas.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.fichas.update.input.parse(req.body);
      const updatedFicha = await storage.updateFicha(Number(req.params.id), input);
      if (!updatedFicha) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }
      res.json(updatedFicha);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Dados inválidos: " + err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.delete(api.fichas.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteFicha(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
