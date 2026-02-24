import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export const userPlans = pgTable("user_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  planType: varchar("plan_type").default("free").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  stripeCustomerId: varchar("stripe_customer_id"),
  status: varchar("status").default("active").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fichas = pgTable("fichas", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  
  // Identificação
  nomePaciente: text("nome_paciente"),
  dataNascimento: varchar("data_nascimento"),
  idadeAtual: integer("idade_atual"),
  sexo: varchar("sexo"),
  estadoCivil: varchar("estado_civil"),
  perfilEtnico: varchar("perfil_etnico"),
  profissao: text("profissao"),
  diagnosticoClinico: text("diagnostico_clinico"),
  nomeMedico: text("nome_medico"),
  planoSaude: varchar("plano_saude"),
  consultor: varchar("consultor"),
  telefone: varchar("telefone"),
  email: varchar("email"),
  endereco: text("endereco"),
  cpf: varchar("cpf"),
  numeroProntuario: varchar("numero_prontuario"),
  dataAvaliacao: varchar("data_avaliacao"),
  numeroAtendimentos: integer("numero_atendimentos"),

  // Hábitos de Vida
  alimentacao: text("alimentacao"),
  sono: text("sono"),
  ingestaoHidrica: text("ingestao_hidrica"),
  rotinaDiaria: text("rotina_diaria"),
  atividadeFisica: text("atividade_fisica"),
  medicamentos: text("medicamentos"),
  tabagismo: varchar("tabagismo"),
  etilismo: varchar("etilismo"),
  estresse: varchar("estresse"),
  trabalhoRepetitivo: text("trabalho_repetitivo"),
  historicoEsportivo: text("historico_esportivo"),

  // Sinais Vitais
  pa: varchar("pa"),
  fc: varchar("fc"),
  fr: varchar("fr"),
  satO2: varchar("sat_o2"),
  temperatura: varchar("temperatura"),
  peso: text("peso"),
  altura: text("altura"),
  imc: text("imc"),
  classificacaoIMC: varchar("classificacao_imc"),
  fcMax: integer("fc_max"),
  zonaTreino: varchar("zona_treino"),
  frMax: integer("fr_max"),
  glicemia: varchar("glicemia"),

  // Anamnese
  hda: text("hda"),
  hdp: text("hdp"),
  eva: integer("eva"),
  inicioDor: text("inicio_dor"),
  tipoDor: text("tipo_dor"),
  irradiacao: text("irradiacao"),
  fatoresMelhora: text("fatores_melhora"),
  fatoresPiora: text("fatores_piora"),
  cirurgias: text("cirurgias"),

  // Avaliação Física
  inspecao: text("inspecao"),
  palpacao: text("palpacao"),
  sensibilidade: text("sensibilidade"),
  posturaEstatica: text("postura_estatica"),
  posturaDinamica: text("postura_dinamica"),
  marcha: text("marcha"),
  perimetria: text("perimetria"),
  testesEspeciais: text("testes_especiais"),

  // Estratégias
  estrategiasCurto: text("estrategias_curto"),
  estrategiasMedio: text("estrategias_medio"),
  estrategiasLongo: text("estrategias_longo"),

  // Termo
  aceitoTermo: boolean("aceito_termo").default(false),

  // Dados dinâmicos (JSON)
  musculos: jsonb("musculos"),
  prescricoes: jsonb("prescricoes"),
  evolucoes: jsonb("evolucoes"),

  // PDF e integração
  pdfUrl: text("pdf_url"),
  googleDriveFileId: varchar("google_drive_file_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFichaSchema = createInsertSchema(fichas).omit({ id: true, createdAt: true, updatedAt: true, userId: true });
export type Ficha = typeof fichas.$inferSelect;
export type InsertFicha = z.infer<typeof insertFichaSchema>;
export type UpdateFichaRequest = Partial<InsertFicha>;

export const fichaUsage = pgTable("ficha_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
