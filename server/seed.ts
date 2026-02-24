import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");
  
  // Create a dummy user for the seed data since the schema requires a user
  const [dummyUser] = await db.insert(users).values({
    id: "dummy-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
  }).onConflictDoNothing().returning();

  const userId = dummyUser?.id || "dummy-user-id";

  const existingFichas = await storage.getFichas();
  if (existingFichas.length === 0) {
    await storage.createFicha({
      nomePaciente: "João Silva",
      dataNascimento: "1980-05-15",
      idadeAtual: 44,
      sexo: "Masculino",
      profissao: "Engenheiro",
      diagnosticoClinico: "Lombalgia Crônica",
      telefone: "11999999999",
      email: "joao@example.com",
      dataAvaliacao: new Date().toISOString().split('T')[0],
      eva: 7,
      tipoDor: "Queimação",
      irradiacao: "Membro Inferior Direito",
      fatoresMelhora: "Repouso",
      fatoresPiora: "Ficar em pé muito tempo",
      estrategiasCurto: "Alívio da dor, mobilidade articular",
      estrategiasMedio: "Fortalecimento do core",
      estrategiasLongo: "Retorno seguro às atividades normais sem dor"
    }, userId);

    await storage.createFicha({
      nomePaciente: "Maria Oliveira",
      dataNascimento: "1992-08-22",
      idadeAtual: 31,
      sexo: "Feminino",
      profissao: "Professora",
      diagnosticoClinico: "Tendinopatia do Supraespinhoso",
      telefone: "11988888888",
      email: "maria@example.com",
      dataAvaliacao: new Date().toISOString().split('T')[0],
      eva: 5,
      tipoDor: "Pontada",
      irradiacao: "Braço",
      fatoresMelhora: "Gelo",
      fatoresPiora: "Elevar o braço",
      estrategiasCurto: "Controle da inflamação",
      estrategiasMedio: "Exercícios isométricos",
      estrategiasLongo: "Fortalecimento e retorno ao esporte"
    }, userId);

    console.log("Database seeded successfully!");
  } else {
    console.log("Database already has fichas, skipping seed.");
  }
  process.exit(0);
}

seedDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
