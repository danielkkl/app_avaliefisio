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
  dataConsulta: varchar("data_consulta"),


  // Hábitos de Vida

  alimentacao: varchar("alimentacao"),
  sono: varchar("sono"),
  ingestaoHidrica: varchar("ingestao_hidrica"),
  rotinaDiaria: text("rotina_diaria"),
  atividadeFisica: varchar("atividade_fisica"),
  medicamentos: text("medicamentos"),
  tabagismo: varchar("tabagismo"),
  etilismo: varchar("etilismo"),
  estresse: varchar("estresse"),
  trabalhoRepetitivo: varchar("trabalho_repetitivo"),
  historicoEsportivo: varchar("historico_esportivo"),

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
  tipoDor: varchar("tipo_dor"),
  tipoDorOutro: text("tipo_dor_outro"),
  irradiacao: text("irradiacao"),
  fatoresMelhora: text("fatores_melhora"),
  fatoresPiora: text("fatores_piora"),
  cirurgias: text("cirurgias"),

  // ADM Específica (fich2.html)
  flexaoJoelho: integer("flexao_joelho"),
  extensaoJoelho: integer("extensao_joelho"),
  forcaMRC: integer("forca_mrc"),

  // Testes Ortopédicos (fich2.html)
  testeLachman: varchar("teste_lachman"),
  testeFimDeCurso: varchar("teste_fim_de_curso"),
  testeNeer: varchar("teste_neer"),

  // Escalas Funcionais (fich2.html)
  escalaBerg: integer("escala_berg"),
  escalaAshworth: integer("escala_ashworth"),
  escalaTC6: integer("escala_tc6"),

  // Avaliação Física
  inspecao: text("inspecao"),
  palpacao: text("palpacao"),
  posturaEstatica: text("postura_estatica"),
  posturaDinamica: text("postura_dinamica"),
  marcha: text("marcha"),
  perimetria: text("perimetria"),
  testesEspeciais: text("testes_especiais"),

  // Estratégias e Interpretação
  estrategiasCurto: text("estrategias_curto"),
  estrategiasMedio: text("estrategias_medio"),
  estrategiasLongo: text("estrategias_longo"),
  interpretacaoAutomatica: text("interpretacao_automatica"),



  // Termo de Consentimento
  aceitoTermo: boolean("aceito_termo").default(false),
  termoConsentimentoFoto: boolean("termo_consentimento_foto").default(false),
  termoConsentimentoFaltas: boolean("termo_consentimento_faltas").default(false),
  termoConsentimentoReposicao: boolean("termo_consentimento_reposicao").default(false),
  dataAssinaturaTermo: varchar("data_assinatura_termo"),

  // Assinaturas (Base64)
  assinaturaPaciente: text("assinatura_paciente"),
  assinaturaFisioterapeuta: text("assinatura_fisioterapeuta"),

  // Dados dinâmicos (JSON)
  musculos: jsonb("musculos"),
  prescricoes: jsonb("prescricoes"),
  evolucoes: jsonb("evolucoes"),
  admForca: jsonb("adm_forca"), // Nova estrutura de tabela
  mapaDor: text("mapa_dor"), // Base64 da imagem do canvas

  // Avaliação Ortopédica Automatizada
  regiaoAvaliada: varchar("regiao_avaliada"),
  testesOrtopedicosJson: jsonb("testes_ortopedicos_json"),
  diagnosticoFuncionalProvavel: text("diagnostico_funcional_provavel"),
  probabilidadeClinica: varchar("probabilidade_clinica"),

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
