import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFichaSchema } from "@shared/routes";
import { useCreateFicha, useUpdateFicha, useFicha } from "@/hooks/use-fichas";
import { useLocation, useRoute } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  ChevronRight,
  Plus, 
  Trash2, 
  Map, 
  Activity, 
  History, 
  ShieldCheck, 
  PenTool,
  Loader2, 
  Save, 
  ArrowLeft,
  User,
  ClipboardCheck,
  Stethoscope,
  Target,
  FileCheck,
  Zap,
  Dumbbell,
  HeartPulse,
  Scale
=======
  Plus, Trash2, Printer, Map, Activity, History, ShieldCheck, PenTool,
  Loader2, Save, ArrowLeft
>>>>>>> parent of cc61847 (Novo Layout)
=======
  Plus, Trash2, Printer, Map, Activity, History, ShieldCheck, PenTool,
  Loader2, Save, ArrowLeft
>>>>>>> parent of cc61847 (Novo Layout)
=======
  Plus, Trash2, Printer, Map, Activity, History, ShieldCheck, PenTool,
  Loader2, Save, ArrowLeft
>>>>>>> parent of cc61847 (Novo Layout)
} from "lucide-react";
import React, { useEffect, useCallback, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { AvaliacaoOrtopedicaTab } from "@/components/AvaliacaoOrtopedicaTab";
import { PainelMapaDor } from "@/components/PainelMapaDor";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)

const formSchema = insertFichaSchema;
type FormValues = z.infer<typeof formSchema>;

// ─── helpers ────────────────────────────────────────────────────────────────

function calcularIdade(dataNasc: string): number | null {
  if (!dataNasc) return null;
  const nasc = new Date(dataNasc);
  if (isNaN(nasc.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade >= 0 ? idade : null;
}

function calcularIMC(
  peso: string | null | undefined,
  altura: string | null | undefined
): { imc: string; classificacao: string } | null {
  const p = parseFloat(peso ?? "");
  const a = parseFloat(altura ?? "");
  if (!p || !a || p <= 0 || a <= 0) return null;
  const imc = p / (a * a);
  let classificacao = "";
  if (imc < 18.5) classificacao = "Baixo peso";
  else if (imc < 25) classificacao = "Eutrofia";
  else if (imc < 30) classificacao = "Sobrepeso";
  else if (imc < 35) classificacao = "Obesidade I";
  else if (imc < 40) classificacao = "Obesidade II";
  else classificacao = "Obesidade III";
  return { imc: imc.toFixed(2), classificacao };
}

function calcularCardio(idade: number): {
  fcMax: number;
  zonaTreino: string;
  frMax: number;
} {
  const fcMax = 220 - idade;
  const zonaMin = Math.round(fcMax * 0.6);
  const zonaMax = Math.round(fcMax * 0.8);
  return { fcMax, zonaTreino: `${zonaMin} - ${zonaMax} bpm`, frMax: 40 };
}

// ─── component ───────────────────────────────────────────────────────────────

export default function FichaForm() {
  const [, params] = useRoute("/fichas/:id/edit");
  const isEdit = !!params?.id;
  const id = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();

  const { data: ficha, isLoading: isLoadingFicha } = useFicha(id);
  const createMutation = useCreateFicha();
  const updateMutation = useUpdateFicha();

  // Estados do mapa da dor removidos pois agora estão no componente PainelMapaDor

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomePaciente: "",
      idadeAtual: 0,
      numeroAtendimentos: 0,
      fcMax: 0,
      frMax: 0,
      aceitoTermo: false,
      musculos: [],
      prescricoes: [],
      flexaoJoelho: undefined,
      extensaoJoelho: undefined,
      forcaMRC: undefined,
      testeLachman: "",
      testeFimDeCurso: "",
      testeNeer: "",
      escalaBerg: undefined,
      escalaAshworth: undefined,
      escalaTC6: undefined,
      dataConsulta: new Date().toLocaleDateString("pt-BR"),
      hda: "",
      hdp: "",
      eva: 0,
      inicioDor: "",
      tipoDor: "",
      tipoDorOutro: "",
      irradiacao: "",
      fatoresMelhora: "",
      fatoresPiora: "",
      cirurgias: "",
      alimentacao: "",
      sono: "",
      ingestaoHidrica: "",
      atividadeFisica: "",
      medicamentos: "",
      historicoEsportivo: "",
      tabagismo: "Não",
      etilismo: "Não",
      estresse: "Não",
      trabalhoRepetitivo: "Não",
      rotinaDiaria: "",
      admForca: [
        { movimento: "Flexão de ombro", admDireita: "", admEsquerda: "", forcaD: "", forcaE: "", deficit: "0", cif: "XXX.0 Sem déficit" },
      ],
      evolucoes: [
        { data: new Date().toLocaleDateString("pt-BR"), fisioterapeuta: "Dr. Daniel Barcellos — CREFITO 10 389091-F", descricao: "", resposta: "", ajuste: "" },
      ],
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      inspecao: "",
      palpacao: "",
      posturaEstatica: "",
      posturaDinamica: "",
      marcha: "",
      perimetria: "",
      testesEspeciais: "",
      // Novos campos para garantir que tudo seja mantido
      musculos: [],
      prescricoes: [],
      testesOrtopedicosJson: {},
      regiaoAvaliada: "",
      diagnosticoFuncionalProvavel: "",
      probabilidadeClinica: "Baixa",
=======
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
      termoConsentimentoFoto: false,
      termoConsentimentoFaltas: false,
      termoConsentimentoReposicao: false,
      dataAssinaturaTermo: new Date().toLocaleDateString("pt-BR"),
      assinaturaPaciente: "",
      assinaturaFisioterapeuta: "",
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
    },
  });

  // ── field arrays ────────────────────────────────────────────────────────
  const {
    fields: musculoFields,
    append: appendMusculo,
    remove: removeMusculo,
  } = useFieldArray({
    control: form.control,
    name: "musculos",
  });

  const {
    fields: admForcaFields,
    append: appendAdmForca,
    remove: removeAdmForca,
  } = useFieldArray({
    control: form.control,
    name: "admForca",
  });

  const {
    fields: evolucoesFields,
    append: appendEvolucao,
    remove: removeEvolucao,
  } = useFieldArray({
    control: form.control,
    name: "evolucoes",
  });

  const {
    fields: prescricaoFields,
    append: appendPrescricao,
    remove: removePrescricao,
  } = useFieldArray({ control: form.control, name: "prescricoes" as any });

  // ── populate on edit ────────────────────────────────────────────────────
  useEffect(() => {
    if (ficha) {
      const { id, userId, createdAt, updatedAt, ...rest } = ficha as any;
      form.reset({
        ...rest,
        musculos: Array.isArray(rest.musculos) ? rest.musculos : [],
        prescricoes: Array.isArray(rest.prescricoes) ? rest.prescricoes : [],
        evolucoes: Array.isArray(rest.evolucoes) ? rest.evolucoes : [],
        admForca: Array.isArray(rest.admForca) ? rest.admForca : [],
      });
    }
  }, [ficha, form]);

  // ── reactive calculations ───────────────────────────────────────────────

  const handleDataNascimentoChange = useCallback(
    (value: string) => {
      const idade = calcularIdade(value);
      if (idade !== null) {
        form.setValue("idadeAtual", idade);
        const cardio = calcularCardio(idade);
        form.setValue("fcMax", cardio.fcMax);
        form.setValue("zonaTreino", cardio.zonaTreino);
        form.setValue("frMax", cardio.frMax);
      }
    },
    [form]
  );

  const handlePesoAlturaChange = useCallback(() => {
    const peso = form.getValues("peso");
    const altura = form.getValues("altura");
    const resultado = calcularIMC(peso, altura);
    if (resultado) {
      form.setValue("imc", resultado.imc);
      form.setValue("classificacaoIMC", resultado.classificacao);
    }
  }, [form]);

  const handleConsultorChange = useCallback(
    (value: string) => {
      form.setValue("consultor", value);
    },
    [form]
  );

  // ── submit ──────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setLocation("/fichas");
    } catch (error) {
      console.error(error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ── gerar PDF ───────────────────────────────────────────────────────────
  const gerarPDF = () => {
    const nome = form.getValues("nomePaciente") || "Paciente";
    const titulo = document.title;
    document.title = `Ficha - ${nome}`;
    window.print();
    document.title = titulo;
  };

  // O salvamento agora é automático via onChange no componente PainelMapaDor

  if (isEdit && isLoadingFicha) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const consultor = form.watch("consultor");

  // Função draw removida pois agora está no componente PainelMapaDor

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Header Contextual */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {form.watch("nomePaciente") || (isEdit ? "Editar Avaliação" : "Nova Avaliação")}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>ID: {isEdit ? id : "---"}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{form.watch("idadeAtual") || 0} anos</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLocation("/fichas")}>
            Cancelar
          </Button>
          <Button 
            size="sm" 
            className="bg-[#10b981] hover:bg-[#059669] text-white"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </div>

      {/* Stepper Superior */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6 overflow-hidden">
        <div className="flex flex-wrap md:flex-nowrap">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-semibold transition-all relative",
                  isActive ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-blue-50",
                  idx < STEPS.length - 1 && !isActive && "border-r border-blue-50"
                )}
              >
                <step.icon className={cn("w-4 h-4", isActive ? "text-white" : isCompleted ? "text-blue-600" : "text-slate-400")} />
                {step.id}. {step.name}
                {isActive && (
                  <div className="absolute -right-3 top-0 bottom-0 w-6 bg-blue-600 skew-x-[25deg] z-10 hidden md:block"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* ETAPA 1: DADOS GERAIS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 shadow-sm border-blue-50">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Identificação do Paciente</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="nomePaciente" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">NOME COMPLETO</FormLabel>
                          <FormControl><Input placeholder="Nome do paciente" {...field} className="bg-slate-50/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">DATA DE NASCIMENTO</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => { field.onChange(e); handleDataNascimentoChange(e.target.value); }} className="bg-slate-50/50" />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="sexo" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">SEXO</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem></SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="profissao" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">PROFISSÃO</FormLabel>
                          <FormControl><Input placeholder="Ex: Engenheiro" {...field} className="bg-slate-50/50" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="telefone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">TELEFONE / WHATSAPP</FormLabel>
                          <FormControl><Input placeholder="(00) 00000-0000" {...field} className="bg-slate-50/50" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="diagnosticoClinico" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">DIAGNÓSTICO CLÍNICO (MÉDICO)</FormLabel>
                          <FormControl><Input placeholder="Ex: Ruptura de LCA" {...field} className="bg-slate-50/50" /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Sinais Vitais</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="peso" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500">PESO (KG)</FormLabel>
                            <FormControl><Input type="number" step="0.1" {...field} onChange={(e) => { field.onChange(e); handlePesoAlturaChange(); }} className="bg-slate-50/50" /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="altura" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500">ALTURA (M)</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} onChange={(e) => { field.onChange(e); handlePesoAlturaChange(); }} className="bg-slate-50/50" /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">IMC CALCULADO</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-blue-900">{form.watch("imc") || "0.00"}</span>
                          <span className="text-xs font-medium text-blue-700">{form.watch("classificacaoIMC") || "Aguardando dados"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="pa" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500">P.A.</FormLabel>
                            <FormControl><Input placeholder="120/80" {...field} className="bg-slate-50/50" /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="fc" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500">F.C. (BPM)</FormLabel>
                            <FormControl><Input type="number" {...field} className="bg-slate-50/50" /></FormControl>
                          </FormItem>
                        )} />
                      </div>
=======
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => setLocation(isEdit ? `/fichas/${id}` : "/fichas")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <PageHeader
        title={isEdit ? "Editar Avaliação" : "Nova Avaliação"}
        description={
          isEdit
            ? `Editando registro de ${ficha?.nomePaciente}`
            : "Crie um novo registro de avaliação de paciente."
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="identificacao" className="w-full">
            {/* ── sticky header ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-8">
              <div className="flex items-center justify-between">
                <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto p-1 bg-transparent gap-2">
                  {[
                    { label: "Identificação", value: "identificacao" },
                    { label: "Hábitos de Vida", value: "habitos-de-vida" },
                    { label: "Sinais Vitais", value: "sinais-vitais" },
                    { label: "Anamnese", value: "anamnese" },
                    { label: "ADM / Força", value: "adm-forca" },
                    { label: "Avaliação Ortopédica", value: "ortopedica" },
                    { label: "Escalas Funcionais", value: "escalas-funcionais" },
                    { label: "Avaliação Física", value: "avaliacao-fisica" },
                    { label: "Mapa da Dor", value: "mapa-dor" },
                    { label: "Prescrições", value: "prescricoes" },
                    { label: "Evolução", value: "evolucao" },
                    { label: "Estratégias", value: "estrategias" },
                    { label: "Termo", value: "termo" },
                    { label: "Assinaturas", value: "assinaturas" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-2"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={gerarPDF}
                    title="Gerar PDF / Imprimir"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/fichas")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="shadow-lg shadow-primary/20"
                  >
                    {isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Registro
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                {/* ══════════════ IDENTIFICAÇÃO ══════════════ */}
                <TabsContent value="identificacao" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {/* Nome */}
                    <FormField
                      control={form.control}
                      name="nomePaciente"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nome completo do paciente"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data de Nascimento — dispara cálculo de idade + cardio */}
                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                handleDataNascimentoChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Idade (calculada automaticamente) */}
                    <FormField
                      control={form.control}
                      name="idadeAtual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Calculada automaticamente"
                              readOnly
                              className="bg-muted/50"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Sexo */}
                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Perfil Étnico */}
                    <FormField
                      control={form.control}
                      name="perfilEtnico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfil Étnico</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Branco">Branco</SelectItem>
                              <SelectItem value="Preto">Preto</SelectItem>
                              <SelectItem value="Pardo">Pardo</SelectItem>
                              <SelectItem value="Indígena">Indígena</SelectItem>
                              <SelectItem value="Amarelo">Amarelo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estado Civil */}
                    <FormField
                      control={form.control}
                      name="estadoCivil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                              <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                              <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                              <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Profissão */}
                    <FormField
                      control={form.control}
                      name="profissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissão / Ocupação</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Cargo ou atividade"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Diagnóstico Clínico */}
                    <FormField
                      control={form.control}
                      name="diagnosticoClinico"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Diagnóstico Clínico</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o diagnóstico clínico do paciente..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Nome do Médico */}
                    <FormField
                      control={form.control}
                      name="nomeMedico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Médico</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dr(a). ..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Plano de Saúde */}
                    <FormField
                      control={form.control}
                      name="planoSaude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plano de Saúde / Particular</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Plano ou particular"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data da Consulta */}
                    <FormField
                      control={form.control}
                      name="dataConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Consulta</FormLabel>
                          <FormControl>
                            <Input placeholder="DD/MM/AAAA" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Consultor — atualiza assinatura */}
                    <FormField
                      control={form.control}
                      name="consultor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fisioterapeuta Responsável</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              handleConsultorChange(v);
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dr. Daniel Barcellos">
                                Dr. Daniel Barcellos
                              </SelectItem>
                              <SelectItem value="Dra. Natália Macedo">
                                Dra. Natália Macedo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CPF */}
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telefone */}
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(00) 00000-0000"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="paciente@exemplo.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>


                <TabsContent value="habitos-de-vida" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="alimentacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Alimentação</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Saudável">Saudável</SelectItem>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Inadequada">Inadequada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Sono</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bom (7-9h)">Bom (7-9h)</SelectItem>
                                <SelectItem value="Regular (5-7h)">Regular (5-7h)</SelectItem>
                                <SelectItem value="Ruim (<5h)">Ruim (&lt;5h)</SelectItem>
                                <SelectItem value="Insônia">Insônia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ingestaoHidrica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Ingestão Hídrica</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Adequada (>2L/dia)">Adequada (&gt;2L/dia)</SelectItem>
                                <SelectItem value="Regular (1-2L/dia)">Regular (1-2L/dia)</SelectItem>
                                <SelectItem value="Insuficiente (<1L/dia)">Insuficiente (&lt;1L/dia)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
=======
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => setLocation(isEdit ? `/fichas/${id}` : "/fichas")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <PageHeader
        title={isEdit ? "Editar Avaliação" : "Nova Avaliação"}
        description={
          isEdit
            ? `Editando registro de ${ficha?.nomePaciente}`
            : "Crie um novo registro de avaliação de paciente."
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="identificacao" className="w-full">
            {/* ── sticky header ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-8">
              <div className="flex items-center justify-between">
                <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto p-1 bg-transparent gap-2">
                  {[
                    { label: "Identificação", value: "identificacao" },
                    { label: "Hábitos de Vida", value: "habitos-de-vida" },
                    { label: "Sinais Vitais", value: "sinais-vitais" },
                    { label: "Anamnese", value: "anamnese" },
                    { label: "ADM / Força", value: "adm-forca" },
                    { label: "Avaliação Ortopédica", value: "ortopedica" },
                    { label: "Escalas Funcionais", value: "escalas-funcionais" },
                    { label: "Avaliação Física", value: "avaliacao-fisica" },
                    { label: "Mapa da Dor", value: "mapa-dor" },
                    { label: "Prescrições", value: "prescricoes" },
                    { label: "Evolução", value: "evolucao" },
                    { label: "Estratégias", value: "estrategias" },
                    { label: "Termo", value: "termo" },
                    { label: "Assinaturas", value: "assinaturas" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-2"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={gerarPDF}
                    title="Gerar PDF / Imprimir"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/fichas")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="shadow-lg shadow-primary/20"
                  >
                    {isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Registro
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                {/* ══════════════ IDENTIFICAÇÃO ══════════════ */}
                <TabsContent value="identificacao" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {/* Nome */}
                    <FormField
                      control={form.control}
                      name="nomePaciente"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nome completo do paciente"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data de Nascimento — dispara cálculo de idade + cardio */}
                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                handleDataNascimentoChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Idade (calculada automaticamente) */}
                    <FormField
                      control={form.control}
                      name="idadeAtual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Calculada automaticamente"
                              readOnly
                              className="bg-muted/50"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Sexo */}
                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Perfil Étnico */}
                    <FormField
                      control={form.control}
                      name="perfilEtnico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfil Étnico</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Branco">Branco</SelectItem>
                              <SelectItem value="Preto">Preto</SelectItem>
                              <SelectItem value="Pardo">Pardo</SelectItem>
                              <SelectItem value="Indígena">Indígena</SelectItem>
                              <SelectItem value="Amarelo">Amarelo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estado Civil */}
                    <FormField
                      control={form.control}
                      name="estadoCivil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                              <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                              <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                              <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Profissão */}
                    <FormField
                      control={form.control}
                      name="profissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissão / Ocupação</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Cargo ou atividade"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Diagnóstico Clínico */}
                    <FormField
                      control={form.control}
                      name="diagnosticoClinico"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Diagnóstico Clínico</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o diagnóstico clínico do paciente..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Nome do Médico */}
                    <FormField
                      control={form.control}
                      name="nomeMedico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Médico</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dr(a). ..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Plano de Saúde */}
                    <FormField
                      control={form.control}
                      name="planoSaude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plano de Saúde / Particular</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Plano ou particular"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data da Consulta */}
                    <FormField
                      control={form.control}
                      name="dataConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Consulta</FormLabel>
                          <FormControl>
                            <Input placeholder="DD/MM/AAAA" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Consultor — atualiza assinatura */}
                    <FormField
                      control={form.control}
                      name="consultor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fisioterapeuta Responsável</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              handleConsultorChange(v);
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dr. Daniel Barcellos">
                                Dr. Daniel Barcellos
                              </SelectItem>
                              <SelectItem value="Dra. Natália Macedo">
                                Dra. Natália Macedo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CPF */}
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telefone */}
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(00) 00000-0000"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="paciente@exemplo.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>


                <TabsContent value="habitos-de-vida" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="alimentacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Alimentação</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Saudável">Saudável</SelectItem>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Inadequada">Inadequada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Sono</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bom (7-9h)">Bom (7-9h)</SelectItem>
                                <SelectItem value="Regular (5-7h)">Regular (5-7h)</SelectItem>
                                <SelectItem value="Ruim (<5h)">Ruim (&lt;5h)</SelectItem>
                                <SelectItem value="Insônia">Insônia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ingestaoHidrica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Ingestão Hídrica</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Adequada (>2L/dia)">Adequada (&gt;2L/dia)</SelectItem>
                                <SelectItem value="Regular (1-2L/dia)">Regular (1-2L/dia)</SelectItem>
                                <SelectItem value="Insuficiente (<1L/dia)">Insuficiente (&lt;1L/dia)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
>>>>>>> parent of cc61847 (Novo Layout)

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="rotinaDiaria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Rotina Diária</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva a rotina" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="atividadeFisica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Atividade Física</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sedentário">Sedentário</SelectItem>
                                <SelectItem value="Leve (1-2x/sem)">Leve (1-2x/sem)</SelectItem>
                                <SelectItem value="Moderado (3-4x/sem)">Moderado (3-4x/sem)</SelectItem>
                                <SelectItem value="Intenso (5+x/sem)">Intenso (5+x/sem)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="medicamentos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase">Medicamentos</FormLabel>
                          <FormControl>
                            <Input placeholder="Liste os medicamentos em uso" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t">
                      {[
                        { key: "tabagismo", label: "Tabagismo" },
                        { key: "etilismo", label: "Etilismo" },
                        { key: "estresse", label: "Estresse" },
                        { key: "trabalhoRepetitivo", label: "Trabalho Repetitivo" },
                        { key: "historicoEsportivo", label: "Histórico Esportivo" },
                      ].map((item) => (
                        <FormField
                          key={item.key}
                          control={form.control}
                          name={item.key as any}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="font-bold text-xs uppercase">{item.label}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-row space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Sim" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">Sim</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Não" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">Não</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ SINAIS VITAIS ══════════════ */}
                <TabsContent value="sinais-vitais" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {/* Campos manuais */}
                    {[
                      { key: "pa", label: "PA", placeholder: "120/80" },
                      { key: "fc", label: "FC (bpm)", placeholder: "70" },
                      { key: "fr", label: "FR (rpm)", placeholder: "16" },
                      { key: "satO2", label: "SatO2 (%)", placeholder: "98%" },
                      { key: "temperatura", label: "Temperatura (°C)", placeholder: "36.5" },
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={item.placeholder}
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    {/* Peso — dispara cálculo IMC */}
                    <FormField
                      control={form.control}
                      name="peso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="70"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(handlePesoAlturaChange, 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Altura — dispara cálculo IMC */}
                    <FormField
                      control={form.control}
                      name="altura"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="1.75"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(handlePesoAlturaChange, 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* IMC (calculado) */}
                    <FormField
                      control={form.control}
                      name="imc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMC (calculado)</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculado automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Classificação IMC (calculada) */}
                    <FormField
                      control={form.control}
                      name="classificacaoIMC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classificação IMC</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* FC Máx (calculada) */}
                    <FormField
                      control={form.control}
                      name="fcMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FC Máx (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada pela idade"
                              className="bg-muted/50"
                              {...field}
                              value={field.value ? `${field.value} bpm` : ""}
                              onChange={() => { }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Zona de Treino (calculada) */}
                    <FormField
                      control={form.control}
                      name="zonaTreino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zona de Treino 60%-80%</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* FR Máx (calculada) */}
                    <FormField
                      control={form.control}
                      name="frMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FR Máx (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value ? `${field.value} rpm` : ""}
                              onChange={() => { }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ ANAMNESE ══════════════ */}
                <TabsContent value="anamnese" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                    {/* Título da Seção */}
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">4</div>
                      <h3 className="text-sm font-bold uppercase tracking-wide">ANAMNESE COMPLETA</h3>
                    </div>

                    {/* HDA e HDP em duas colunas */}
<<<<<<< HEAD
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="hda"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">HDA — HISTÓRIA DA DOENÇA ATUAL</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva a história da doença atual..."
                                className="min-h-[120px] text-xs resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hdp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">HDP — HISTÓRIA DA DOENÇA PREGRESSA</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Histórico de doenças anteriores..."
                                className="min-h-[120px] text-xs resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
>>>>>>> parent of cc61847 (Novo Layout)
                    </div>

<<<<<<< HEAD
              {/* Hábitos de Vida Card */}
              <Card className="shadow-sm border-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <HeartPulse className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Hábitos de Vida</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { name: "tabagismo", label: "Tabagismo" },
                      { name: "etilismo", label: "Etilismo" },
                      { name: "estresse", label: "Estresse" },
                      { name: "trabalhoRepetitivo", label: "Trabalho Repetitivo" },
                    ].map((hab) => (
                      <FormField key={hab.name} control={form.control} name={hab.name as any} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500 uppercase">{hab.label}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Não">Não</SelectItem><SelectItem value="Sim">Sim</SelectItem><SelectItem value="Ocasional">Ocasional</SelectItem></SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <FormField control={form.control} name="atividadeFisica" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Atividade Física / Frequência</FormLabel>
                        <FormControl><Input placeholder="Ex: Musculação 3x na semana" {...field} className="bg-slate-50/50" /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
=======
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => setLocation(isEdit ? `/fichas/${id}` : "/fichas")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <PageHeader
        title={isEdit ? "Editar Avaliação" : "Nova Avaliação"}
        description={
          isEdit
            ? `Editando registro de ${ficha?.nomePaciente}`
            : "Crie um novo registro de avaliação de paciente."
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="identificacao" className="w-full">
            {/* ── sticky header ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-8">
              <div className="flex items-center justify-between">
                <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto p-1 bg-transparent gap-2">
                  {[
                    { label: "Identificação", value: "identificacao" },
                    { label: "Hábitos de Vida", value: "habitos-de-vida" },
                    { label: "Sinais Vitais", value: "sinais-vitais" },
                    { label: "Anamnese", value: "anamnese" },
                    { label: "ADM / Força", value: "adm-forca" },
                    { label: "Avaliação Ortopédica", value: "ortopedica" },
                    { label: "Escalas Funcionais", value: "escalas-funcionais" },
                    { label: "Avaliação Física", value: "avaliacao-fisica" },
                    { label: "Mapa da Dor", value: "mapa-dor" },
                    { label: "Prescrições", value: "prescricoes" },
                    { label: "Evolução", value: "evolucao" },
                    { label: "Estratégias", value: "estrategias" },
                    { label: "Termo", value: "termo" },
                    { label: "Assinaturas", value: "assinaturas" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-2"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={gerarPDF}
                    title="Gerar PDF / Imprimir"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/fichas")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="shadow-lg shadow-primary/20"
                  >
                    {isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Registro
                  </Button>
                </div>
              </div>
>>>>>>> parent of cc61847 (Novo Layout)
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                {/* ══════════════ IDENTIFICAÇÃO ══════════════ */}
                <TabsContent value="identificacao" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {/* Nome */}
                    <FormField
                      control={form.control}
                      name="nomePaciente"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nome completo do paciente"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
<<<<<<< HEAD
                      )} />
                      <FormField control={form.control} name="hda" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400">História da Doença Atual:</FormLabel>
                          <FormControl><Textarea placeholder="" className="bg-white border-slate-200 min-h-[80px]" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="mecanismoLesao" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-slate-400">Mecanismo da Lesão:</FormLabel>
                            <FormControl><Input placeholder="" className="bg-white border-slate-200 h-10" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="tratamentosAnteriores" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-medium text-slate-400">Tratamentos Anteriores:</FormLabel>
                            <FormControl><Input placeholder="" className="bg-white border-slate-200 h-10" {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="hdp" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400">Histórico Patológico (HDP):</FormLabel>
                          <FormControl><Textarea placeholder="Doenças prévias, comorbidades..." className="bg-white border-slate-200 min-h-[60px]" {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
=======
                      )}
                    />
>>>>>>> parent of cc61847 (Novo Layout)

                    {/* Data de Nascimento — dispara cálculo de idade + cardio */}
                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                handleDataNascimentoChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Idade (calculada automaticamente) */}
                    <FormField
                      control={form.control}
                      name="idadeAtual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Calculada automaticamente"
                              readOnly
                              className="bg-muted/50"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Sexo */}
                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Perfil Étnico */}
                    <FormField
                      control={form.control}
                      name="perfilEtnico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfil Étnico</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Branco">Branco</SelectItem>
                              <SelectItem value="Preto">Preto</SelectItem>
                              <SelectItem value="Pardo">Pardo</SelectItem>
                              <SelectItem value="Indígena">Indígena</SelectItem>
                              <SelectItem value="Amarelo">Amarelo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estado Civil */}
                    <FormField
                      control={form.control}
                      name="estadoCivil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                              <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                              <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                              <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Profissão */}
                    <FormField
                      control={form.control}
                      name="profissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissão / Ocupação</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Cargo ou atividade"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Diagnóstico Clínico */}
                    <FormField
                      control={form.control}
                      name="diagnosticoClinico"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Diagnóstico Clínico</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o diagnóstico clínico do paciente..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Nome do Médico */}
                    <FormField
                      control={form.control}
                      name="nomeMedico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Médico</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Dr(a). ..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Plano de Saúde */}
                    <FormField
                      control={form.control}
                      name="planoSaude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plano de Saúde / Particular</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Plano ou particular"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data da Consulta */}
                    <FormField
                      control={form.control}
                      name="dataConsulta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Consulta</FormLabel>
                          <FormControl>
                            <Input placeholder="DD/MM/AAAA" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Consultor — atualiza assinatura */}
                    <FormField
                      control={form.control}
                      name="consultor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fisioterapeuta Responsável</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              handleConsultorChange(v);
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dr. Daniel Barcellos">
                                Dr. Daniel Barcellos
                              </SelectItem>
                              <SelectItem value="Dra. Natália Macedo">
                                Dra. Natália Macedo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CPF */}
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telefone */}
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(00) 00000-0000"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="paciente@exemplo.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>


                <TabsContent value="habitos-de-vida" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="alimentacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Alimentação</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Saudável">Saudável</SelectItem>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Inadequada">Inadequada</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Sono</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bom (7-9h)">Bom (7-9h)</SelectItem>
                                <SelectItem value="Regular (5-7h)">Regular (5-7h)</SelectItem>
                                <SelectItem value="Ruim (<5h)">Ruim (&lt;5h)</SelectItem>
                                <SelectItem value="Insônia">Insônia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ingestaoHidrica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Ingestão Hídrica</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Adequada (>2L/dia)">Adequada (&gt;2L/dia)</SelectItem>
                                <SelectItem value="Regular (1-2L/dia)">Regular (1-2L/dia)</SelectItem>
                                <SelectItem value="Insuficiente (<1L/dia)">Insuficiente (&lt;1L/dia)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
<<<<<<< HEAD
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="inspecao" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400 uppercase">Inspeção</FormLabel>
                          <FormControl><Textarea placeholder="Achados visuais..." className="min-h-[80px] bg-white border-slate-200" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="palpacao" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400 uppercase">Palpação</FormLabel>
                          <FormControl><Textarea placeholder="Achados ao toque..." className="min-h-[80px] bg-white border-slate-200" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="posturaEstatica" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400 uppercase">Postura Estática</FormLabel>
                          <FormControl><Textarea placeholder="Avaliação postural..." className="min-h-[80px] bg-white border-slate-200" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="marcha" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400 uppercase">Marcha</FormLabel>
                          <FormControl><Textarea placeholder="Análise da marcha..." className="min-h-[80px] bg-white border-slate-200" {...field} /></FormControl>
                        </FormItem>
                      )} />
=======

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="rotinaDiaria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Rotina Diária</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva a rotina" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="atividadeFisica"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase">Atividade Física</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sedentário">Sedentário</SelectItem>
                                <SelectItem value="Leve (1-2x/sem)">Leve (1-2x/sem)</SelectItem>
                                <SelectItem value="Moderado (3-4x/sem)">Moderado (3-4x/sem)</SelectItem>
                                <SelectItem value="Intenso (5+x/sem)">Intenso (5+x/sem)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="medicamentos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase">Medicamentos</FormLabel>
                          <FormControl>
                            <Input placeholder="Liste os medicamentos em uso" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t">
                      {[
                        { key: "tabagismo", label: "Tabagismo" },
                        { key: "etilismo", label: "Etilismo" },
                        { key: "estresse", label: "Estresse" },
                        { key: "trabalhoRepetitivo", label: "Trabalho Repetitivo" },
                        { key: "historicoEsportivo", label: "Histórico Esportivo" },
                      ].map((item) => (
                        <FormField
                          key={item.key}
                          control={form.control}
                          name={item.key as any}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="font-bold text-xs uppercase">{item.label}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-row space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Sim" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">Sim</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Não" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">Não</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ SINAIS VITAIS ══════════════ */}
                <TabsContent value="sinais-vitais" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {/* Campos manuais */}
                    {[
                      { key: "pa", label: "PA", placeholder: "120/80" },
                      { key: "fc", label: "FC (bpm)", placeholder: "70" },
                      { key: "fr", label: "FR (rpm)", placeholder: "16" },
                      { key: "satO2", label: "SatO2 (%)", placeholder: "98%" },
                      { key: "temperatura", label: "Temperatura (°C)", placeholder: "36.5" },
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={item.placeholder}
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    {/* Peso — dispara cálculo IMC */}
                    <FormField
                      control={form.control}
                      name="peso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="70"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(handlePesoAlturaChange, 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Altura — dispara cálculo IMC */}
                    <FormField
                      control={form.control}
                      name="altura"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="1.75"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(handlePesoAlturaChange, 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* IMC (calculado) */}
                    <FormField
                      control={form.control}
                      name="imc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMC (calculado)</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculado automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Classificação IMC (calculada) */}
                    <FormField
                      control={form.control}
                      name="classificacaoIMC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classificação IMC</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* FC Máx (calculada) */}
                    <FormField
                      control={form.control}
                      name="fcMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FC Máx (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada pela idade"
                              className="bg-muted/50"
                              {...field}
                              value={field.value ? `${field.value} bpm` : ""}
                              onChange={() => { }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Zona de Treino (calculada) */}
                    <FormField
                      control={form.control}
                      name="zonaTreino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zona de Treino 60%-80%</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* FR Máx (calculada) */}
                    <FormField
                      control={form.control}
                      name="frMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FR Máx (calculada)</FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              placeholder="Calculada automaticamente"
                              className="bg-muted/50"
                              {...field}
                              value={field.value ? `${field.value} rpm` : ""}
                              onChange={() => { }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ ANAMNESE ══════════════ */}
                <TabsContent value="anamnese" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                    {/* Título da Seção */}
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">4</div>
                      <h3 className="text-sm font-bold uppercase tracking-wide">ANAMNESE COMPLETA</h3>
                    </div>

                    {/* HDA e HDP em duas colunas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="hda"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">HDA — HISTÓRIA DA DOENÇA ATUAL</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva a história da doença atual..."
                                className="min-h-[120px] text-xs resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hdp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">HDP — HISTÓRIA DA DOENÇA PREGRESSA</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Histórico de doenças anteriores..."
                                className="min-h-[120px] text-xs resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
>>>>>>> parent of cc61847 (Novo Layout)
                    </div>

<<<<<<< HEAD
              <div className="space-y-6">
                {/* Mapa da Dor Card */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <Map className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Mapa da Dor</h3>
                    </div>
                    <div className="border rounded-lg overflow-hidden bg-white border-slate-100 p-2">
                      <PainelMapaDor value={form.watch("mapaDor")} onChange={(dataUrl) => form.setValue("mapaDor", dataUrl)} />
                    </div>
                    <div className="mt-4">
                      <FormField control={form.control} name="eva" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-slate-400 uppercase">Escala Visual Analógica (EVA): {field.value}</FormLabel>
                          <FormControl>
                            <input type="range" min="0" max="10" step="1" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                            <span>SEM DOR</span>
                            <span>DOR MÁXIMA</span>
                          </div>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                {/* ADM & Força Resumo */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm tracking-tight">ADM & Força</h3>
                      </div>
                      <Button type="button" variant="ghost" size="sm" className="text-blue-600 text-xs" onClick={() => appendAdmForca({ movimento: "", admDireita: "", admEsquerda: "", forcaD: "", forcaE: "", deficit: "0", cif: "" })}>
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {admForcaFields.slice(0, 3).map((field, index) => (
                        <div key={field.id} className="text-xs p-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
                          <span className="font-medium text-slate-600 truncate max-w-[120px]">{form.watch(`admForca.${index}.movimento`) || "Novo movimento"}</span>
                          <span className="text-blue-600 font-bold">{form.watch(`admForca.${index}.admDireita`)}° / {form.watch(`admForca.${index}.admEsquerda`)}°</span>
                        </div>
                      ))}
                      {admForcaFields.length > 3 && <p className="text-[10px] text-center text-slate-400">+ {admForcaFields.length - 3} outros movimentos</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ETAPA 3: DIAGNÓSTICO */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Avaliação Ortopédica Automatizada (A função que estava sumindo) */}
              <Card className="shadow-sm border-blue-50 overflow-hidden">
                <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <h3 className="font-bold uppercase text-sm tracking-wider">Avaliação Ortopédica Automatizada</h3>
                </div>
                <CardContent className="p-6">
                  <AvaliacaoOrtopedicaTab form={form} />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Escalas Funcionais */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Escalas Funcionais</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="escalaBerg" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-slate-500 uppercase">Equilíbrio (Berg)</FormLabel>
                          <FormControl><Input type="number" placeholder="0-56" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} className="bg-slate-50/50" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="escalaTC6" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-slate-500 uppercase">TC6 (Metros)</FormLabel>
                          <FormControl><Input type="number" placeholder="Distância" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} className="bg-slate-50/50" /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnóstico Final */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Diagnóstico Fisioterapêutico</h3>
                    </div>
                    <FormField control={form.control} name="diagnosticoFuncionalProvavel" render={({ field }) => (
                      <FormItem>
                        <FormControl><Textarea placeholder="Conclusão baseada nos achados..." className="min-h-[100px] bg-slate-50/50" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ETAPA 4: PLANO */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                          <PenTool className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm tracking-tight">Plano de Tratamento</h3>
                      </div>
                      <Button type="button" size="sm" variant="outline" className="text-blue-600 border-blue-200" onClick={() => appendPrescricao({ descricao: "", frequencia: "", progressao: "", observacoes: "" })}>
                        <Plus className="w-3 h-3 mr-1" /> Add Exercício
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {prescricaoFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-blue-50 rounded-xl bg-slate-50/30 relative group">
                          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" onClick={() => removePrescricao(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`prescricoes.${index}.descricao` as any} render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400">EXERCÍCIO / CONDUTA</FormLabel>
                                <FormControl><Input placeholder="Ex: Fortalecimento de Quadríceps" {...field} className="bg-white" /></FormControl>
                              </FormItem>
                            )} />
                            <FormField control={form.control} name={`prescricoes.${index}.frequencia` as any} render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-bold text-slate-400">DOSAGEM / FREQUÊNCIA</FormLabel>
                                <FormControl><Input placeholder="Ex: 3x12, Diário" {...field} className="bg-white" /></FormControl>
                              </FormItem>
                            )} />
                          </div>
                        </div>
                      ))}
                      {prescricaoFields.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                          Nenhum exercício prescrito ainda.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <History className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Estratégias</h3>
                    </div>
                    <div className="space-y-4">
                      <FormField control={form.control} name="estrategiasCurto" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-slate-500 uppercase">Curto Prazo</FormLabel>
                          <FormControl><Textarea placeholder="Objetivos para 2 semanas..." className="min-h-[60px] bg-slate-50/50" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="estrategiasLongo" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-slate-500 uppercase">Longo Prazo</FormLabel>
                          <FormControl><Textarea placeholder="Objetivos finais..." className="min-h-[60px] bg-slate-50/50" {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
=======
                    {/* Escala EVA Visual */}
                    <FormField
                      control={form.control}
                      name="eva"
                      render={({ field }) => {
                        const evaValue = field.value ?? 0;
                        const evaColors = [
                          "bg-green-600",
                          "bg-green-500",
                          "bg-green-400",
                          "bg-lime-400",
                          "bg-yellow-400",
                          "bg-yellow-500",
                          "bg-orange-400",
                          "bg-orange-500",
                          "bg-red-500",
                          "bg-red-600",
                          "bg-red-700",
                        ];

                        return (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-3 block">EVA — ESCALA VISUAL ANALÓGICA DE DOR</FormLabel>
                            <div className="space-y-3">
                              {/* Barra de cores */}
                              <div className="flex gap-1 h-8 rounded-lg overflow-hidden border">
                                {evaColors.map((color, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`flex-1 ${color} cursor-pointer transition-all hover:opacity-80 ${
                                      evaValue === index ? "ring-2 ring-offset-2 ring-foreground" : ""
                                    }`}
                                    onClick={() => field.onChange(index)}
                                    title={`${index} - ${index === 0 ? "Sem dor" : index === 10 ? "Dor máxima" : ""}`}
                                  />
                                ))}
                              </div>
                              {/* Rótulos e valor selecionado */}
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-green-600">0 — Sem dor</span>
                                <span className="text-muted-foreground">Selecionado: <span className="text-primary">{evaValue}</span></span>
                                <span className="text-red-600">10 — Dor máxima</span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Campos de Dor em Grade */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                      <FormField
                        control={form.control}
                        name="inicioDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">INÍCIO DA DOR</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: há 3 meses"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tipoDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">TIPO DE DOR</FormLabel>
                            <FormControl>
                              <select
                                className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                                {...field}
                                value={field.value || ""}
                              >
                                <option value="">Selecione</option>
                                <option value="aguda">Aguda</option>
                                <option value="cronica">Crônica</option>
                                <option value="neuropatica">Neuropática</option>
                                <option value="inflamatoria">Inflamatória</option>
                                <option value="mecanica">Mecânica</option>
                                <option value="outra">Outra</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="irradiacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">IRRADIAÇÃO</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Para onde irradia?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Fatores e Cirurgias */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="fatoresMelhora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">FATORES DE MELHORA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="O que melhora a dor?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatoresPiora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">FATORES DE PIORA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="O que piora a dor?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cirurgias"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">CIRURGIAS ANTERIORES / PREVIAS</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Descreva cirurgias"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ ADM / FORÇA ══════════════ */}
                <TabsContent value="adm-forca" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        ADM / FORÇA MUSCULAR — CLASSIFICAÇÃO CIF
                      </h3>
                    </div>

                    <div className="overflow-x-auto border rounded-xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-muted/50 uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3 border">MOVIMENTO / SEGMENTO</th>
                            <th className="p-3 border text-center w-20">ADM DIREITA</th>
                            <th className="p-3 border text-center w-20">ADM ESQUERDA</th>
                            <th className="p-3 border text-center w-20">FORÇA D (0-5)</th>
                            <th className="p-3 border text-center w-20">FORÇA E (0-5)</th>
                            <th className="p-3 border text-center w-24">DÉFICIT %</th>
                            <th className="p-3 border text-center w-40">CLASSIFICAÇÃO CIF</th>
                            <th className="p-3 border w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {admForcaFields.map((field, index) => {
                            const calculateCIF = (deficitValue: number) => {
                              if (deficitValue === 0) return "XXX.0 Sem déficit";
                              if (deficitValue < 4) return "XXX.1 Leve (<4%)";
                              if (deficitValue < 25) return "XXX.2 Moderado (4-24%)";
                              if (deficitValue < 50) return "XXX.3 Grave (25-49%)";
                              return "XXX.4 Completo (≥50%)";
                            };

                            const handleStrengthChange = (val: string, type: 'D' | 'E') => {
                              const otherVal = type === 'D'
                                ? form.getValues(`admForca.${index}.forcaE`)
                                : form.getValues(`admForca.${index}.forcaD`);

                              const d = type === 'D' ? parseFloat(val) : parseFloat(otherVal);
                              const e = type === 'E' ? parseFloat(val) : parseFloat(otherVal);

                              if (!isNaN(d) && !isNaN(e) && (d > 0 || e > 0)) {
                                const max = Math.max(d, e);
                                const min = Math.min(d, e);
                                const deficit = Math.round(((max - min) / max) * 100);
                                form.setValue(`admForca.${index}.deficit`, deficit.toString());
                                form.setValue(`admForca.${index}.cif`, calculateCIF(deficit));
                              } else {
                                form.setValue(`admForca.${index}.deficit`, "0");
                                form.setValue(`admForca.${index}.cif`, "XXX.0 Sem déficit");
                              }
                            };

                            return (
                              <tr key={field.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.movimento`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs"
                                    placeholder="Ex: Flexão de ombro"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.admDireita`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-center"
                                    placeholder="°"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.admEsquerda`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-center"
                                    placeholder="°"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    onValueChange={(val) => {
                                      form.setValue(`admForca.${index}.forcaD`, val);
                                      handleStrengthChange(val, 'D');
                                    }}
                                    value={form.watch(`admForca.${index}.forcaD`)}
                                  >
                                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs">
                                      <SelectValue placeholder="-" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["0", "1", "2", "3", "4", "5"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    onValueChange={(val) => {
                                      form.setValue(`admForca.${index}.forcaE`, val);
                                      handleStrengthChange(val, 'E');
                                    }}
                                    value={form.watch(`admForca.${index}.forcaE`)}
                                  >
                                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs">
                                      <SelectValue placeholder="-" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["0", "1", "2", "3", "4", "5"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2 border text-center">
                                  <Input
                                    {...form.register(`admForca.${index}.deficit`)}
                                    readOnly
                                    className="h-8 border-none bg-muted/20 shadow-none text-xs text-center font-bold text-primary"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.cif`)}
                                    readOnly
                                    className="h-8 border-none bg-muted/20 shadow-none text-[10px] text-center"
                                  />
                                </td>
                                <td className="p-2 border text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => removeAdmForca(index)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
=======
                    {/* Escala EVA Visual */}
                    <FormField
                      control={form.control}
                      name="eva"
                      render={({ field }) => {
                        const evaValue = field.value ?? 0;
                        const evaColors = [
                          "bg-green-600",
                          "bg-green-500",
                          "bg-green-400",
                          "bg-lime-400",
                          "bg-yellow-400",
                          "bg-yellow-500",
                          "bg-orange-400",
                          "bg-orange-500",
                          "bg-red-500",
                          "bg-red-600",
                          "bg-red-700",
                        ];

                        return (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-3 block">EVA — ESCALA VISUAL ANALÓGICA DE DOR</FormLabel>
                            <div className="space-y-3">
                              {/* Barra de cores */}
                              <div className="flex gap-1 h-8 rounded-lg overflow-hidden border">
                                {evaColors.map((color, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`flex-1 ${color} cursor-pointer transition-all hover:opacity-80 ${
                                      evaValue === index ? "ring-2 ring-offset-2 ring-foreground" : ""
                                    }`}
                                    onClick={() => field.onChange(index)}
                                    title={`${index} - ${index === 0 ? "Sem dor" : index === 10 ? "Dor máxima" : ""}`}
                                  />
                                ))}
                              </div>
                              {/* Rótulos e valor selecionado */}
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-green-600">0 — Sem dor</span>
                                <span className="text-muted-foreground">Selecionado: <span className="text-primary">{evaValue}</span></span>
                                <span className="text-red-600">10 — Dor máxima</span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Campos de Dor em Grade */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                      <FormField
                        control={form.control}
                        name="inicioDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">INÍCIO DA DOR</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: há 3 meses"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tipoDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">TIPO DE DOR</FormLabel>
                            <FormControl>
                              <select
                                className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                                {...field}
                                value={field.value || ""}
                              >
                                <option value="">Selecione</option>
                                <option value="aguda">Aguda</option>
                                <option value="cronica">Crônica</option>
                                <option value="neuropatica">Neuropática</option>
                                <option value="inflamatoria">Inflamatória</option>
                                <option value="mecanica">Mecânica</option>
                                <option value="outra">Outra</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="irradiacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">IRRADIAÇÃO</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Para onde irradia?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Fatores e Cirurgias */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="fatoresMelhora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">FATORES DE MELHORA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="O que melhora a dor?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatoresPiora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">FATORES DE PIORA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="O que piora a dor?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cirurgias"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">CIRURGIAS ANTERIORES / PREVIAS</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Descreva cirurgias"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ ADM / FORÇA ══════════════ */}
                <TabsContent value="adm-forca" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        ADM / FORÇA MUSCULAR — CLASSIFICAÇÃO CIF
                      </h3>
                    </div>

                    <div className="overflow-x-auto border rounded-xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-muted/50 uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3 border">MOVIMENTO / SEGMENTO</th>
                            <th className="p-3 border text-center w-20">ADM DIREITA</th>
                            <th className="p-3 border text-center w-20">ADM ESQUERDA</th>
                            <th className="p-3 border text-center w-20">FORÇA D (0-5)</th>
                            <th className="p-3 border text-center w-20">FORÇA E (0-5)</th>
                            <th className="p-3 border text-center w-24">DÉFICIT %</th>
                            <th className="p-3 border text-center w-40">CLASSIFICAÇÃO CIF</th>
                            <th className="p-3 border w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {admForcaFields.map((field, index) => {
                            const calculateCIF = (deficitValue: number) => {
                              if (deficitValue === 0) return "XXX.0 Sem déficit";
                              if (deficitValue < 4) return "XXX.1 Leve (<4%)";
                              if (deficitValue < 25) return "XXX.2 Moderado (4-24%)";
                              if (deficitValue < 50) return "XXX.3 Grave (25-49%)";
                              return "XXX.4 Completo (≥50%)";
                            };

                            const handleStrengthChange = (val: string, type: 'D' | 'E') => {
                              const otherVal = type === 'D'
                                ? form.getValues(`admForca.${index}.forcaE`)
                                : form.getValues(`admForca.${index}.forcaD`);

                              const d = type === 'D' ? parseFloat(val) : parseFloat(otherVal);
                              const e = type === 'E' ? parseFloat(val) : parseFloat(otherVal);

                              if (!isNaN(d) && !isNaN(e) && (d > 0 || e > 0)) {
                                const max = Math.max(d, e);
                                const min = Math.min(d, e);
                                const deficit = Math.round(((max - min) / max) * 100);
                                form.setValue(`admForca.${index}.deficit`, deficit.toString());
                                form.setValue(`admForca.${index}.cif`, calculateCIF(deficit));
                              } else {
                                form.setValue(`admForca.${index}.deficit`, "0");
                                form.setValue(`admForca.${index}.cif`, "XXX.0 Sem déficit");
                              }
                            };

                            return (
                              <tr key={field.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.movimento`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs"
                                    placeholder="Ex: Flexão de ombro"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.admDireita`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-center"
                                    placeholder="°"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.admEsquerda`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-center"
                                    placeholder="°"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    onValueChange={(val) => {
                                      form.setValue(`admForca.${index}.forcaD`, val);
                                      handleStrengthChange(val, 'D');
                                    }}
                                    value={form.watch(`admForca.${index}.forcaD`)}
                                  >
                                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs">
                                      <SelectValue placeholder="-" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["0", "1", "2", "3", "4", "5"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    onValueChange={(val) => {
                                      form.setValue(`admForca.${index}.forcaE`, val);
                                      handleStrengthChange(val, 'E');
                                    }}
                                    value={form.watch(`admForca.${index}.forcaE`)}
                                  >
                                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs">
                                      <SelectValue placeholder="-" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["0", "1", "2", "3", "4", "5"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2 border text-center">
                                  <Input
                                    {...form.register(`admForca.${index}.deficit`)}
                                    readOnly
                                    className="h-8 border-none bg-muted/20 shadow-none text-xs text-center font-bold text-primary"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.cif`)}
                                    readOnly
                                    className="h-8 border-none bg-muted/20 shadow-none text-[10px] text-center"
                                  />
                                </td>
                                <td className="p-2 border text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => removeAdmForca(index)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendAdmForca({ movimento: "", admDireita: "", admEsquerda: "", forcaD: "", forcaE: "", deficit: "0", cif: "XXX.0 Sem déficit" })}
                      className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-[10px] uppercase font-bold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar linha
                    </Button>

                    <div className="text-[10px] text-muted-foreground italic">
                      * Classificação automática baseada na CIF: XXX.0 Sem déficit | XXX.1 Leve (&lt;4%) | XXX.2 Moderado (4-24%) | XXX.3 Grave (25-49%) | XXX.4 Completo (≥50%)
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ AVALIAÇÃO ORTOPÉDICA AUTOMATIZADA ══════════════ */}
                <TabsContent value="ortopedica" className="space-y-6 mt-0">
                  <AvaliacaoOrtopedicaTab form={form} />
                </TabsContent>

                <TabsContent value="escalas-funcionais" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="escalaBerg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de Berg (0-56)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="56"
                              placeholder="0-56"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escalaAshworth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de Ashworth (0-4)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="4"
                              placeholder="0-4"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escalaTC6"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TC6 Distância (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Metros"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ AVALIAÇÃO FÍSICA ══════════════ */}
                <TabsContent value="avaliacao-fisica" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      {
                        key: "inspecao",
                        label: "Inspeção / Palpação / Sensibilidade – Postura Estática",
                      },
                      {
                        key: "posturaDinamica",
                        label: "Postural Dinâmica – Marcha / Cinturas",
                      },
                      { key: "perimetria", label: "Perimetria" },
                      { key: "testesEspeciais", label: "Testes Especiais" },
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Registre ${item.label.toLowerCase()}...`}
                                className="min-h-[100px]"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>

                {/* ══════════════ MAPA DA DOR ══════════════ */}
                <TabsContent value="mapa-dor" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        MAPA DA DOR
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                      Selecione a intensidade da dor e pinte as áreas afetadas diretamente sobre o corpo humano.
                    </p>

                    <FormField
                      control={form.control}
                      name="mapaDor"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PainelMapaDor 
                              value={field.value} 
                              onChange={(dataUrl) => field.onChange(dataUrl)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

=======
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="hda"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">HDA — HISTÓRIA DA DOENÇA ATUAL</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva a história da doença atual..."
                                className="min-h-[120px] text-xs resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hdp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">HDP — HISTÓRIA DA DOENÇA PREGRESSA</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Histórico de doenças anteriores..."
                                className="min-h-[120px] text-xs resize-none"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Escala EVA Visual */}
                    <FormField
                      control={form.control}
                      name="eva"
                      render={({ field }) => {
                        const evaValue = field.value ?? 0;
                        const evaColors = [
                          "bg-green-600",
                          "bg-green-500",
                          "bg-green-400",
                          "bg-lime-400",
                          "bg-yellow-400",
                          "bg-yellow-500",
                          "bg-orange-400",
                          "bg-orange-500",
                          "bg-red-500",
                          "bg-red-600",
                          "bg-red-700",
                        ];

                        return (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-3 block">EVA — ESCALA VISUAL ANALÓGICA DE DOR</FormLabel>
                            <div className="space-y-3">
                              {/* Barra de cores */}
                              <div className="flex gap-1 h-8 rounded-lg overflow-hidden border">
                                {evaColors.map((color, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`flex-1 ${color} cursor-pointer transition-all hover:opacity-80 ${
                                      evaValue === index ? "ring-2 ring-offset-2 ring-foreground" : ""
                                    }`}
                                    onClick={() => field.onChange(index)}
                                    title={`${index} - ${index === 0 ? "Sem dor" : index === 10 ? "Dor máxima" : ""}`}
                                  />
                                ))}
                              </div>
                              {/* Rótulos e valor selecionado */}
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-green-600">0 — Sem dor</span>
                                <span className="text-muted-foreground">Selecionado: <span className="text-primary">{evaValue}</span></span>
                                <span className="text-red-600">10 — Dor máxima</span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Campos de Dor em Grade */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                      <FormField
                        control={form.control}
                        name="inicioDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">INÍCIO DA DOR</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: há 3 meses"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tipoDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">TIPO DE DOR</FormLabel>
                            <FormControl>
                              <select
                                className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                                {...field}
                                value={field.value || ""}
                              >
                                <option value="">Selecione</option>
                                <option value="aguda">Aguda</option>
                                <option value="cronica">Crônica</option>
                                <option value="neuropatica">Neuropática</option>
                                <option value="inflamatoria">Inflamatória</option>
                                <option value="mecanica">Mecânica</option>
                                <option value="outra">Outra</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="irradiacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">IRRADIAÇÃO</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Para onde irradia?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Fatores e Cirurgias */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="fatoresMelhora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">FATORES DE MELHORA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="O que melhora a dor?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatoresPiora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">FATORES DE PIORA</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="O que piora a dor?"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cirurgias"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">CIRURGIAS ANTERIORES / PREVIAS</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Descreva cirurgias"
                                className="h-9 text-xs"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ ADM / FORÇA ══════════════ */}
                <TabsContent value="adm-forca" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        ADM / FORÇA MUSCULAR — CLASSIFICAÇÃO CIF
                      </h3>
                    </div>

                    <div className="overflow-x-auto border rounded-xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-muted/50 uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3 border">MOVIMENTO / SEGMENTO</th>
                            <th className="p-3 border text-center w-20">ADM DIREITA</th>
                            <th className="p-3 border text-center w-20">ADM ESQUERDA</th>
                            <th className="p-3 border text-center w-20">FORÇA D (0-5)</th>
                            <th className="p-3 border text-center w-20">FORÇA E (0-5)</th>
                            <th className="p-3 border text-center w-24">DÉFICIT %</th>
                            <th className="p-3 border text-center w-40">CLASSIFICAÇÃO CIF</th>
                            <th className="p-3 border w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {admForcaFields.map((field, index) => {
                            const calculateCIF = (deficitValue: number) => {
                              if (deficitValue === 0) return "XXX.0 Sem déficit";
                              if (deficitValue < 4) return "XXX.1 Leve (<4%)";
                              if (deficitValue < 25) return "XXX.2 Moderado (4-24%)";
                              if (deficitValue < 50) return "XXX.3 Grave (25-49%)";
                              return "XXX.4 Completo (≥50%)";
                            };

                            const handleStrengthChange = (val: string, type: 'D' | 'E') => {
                              const otherVal = type === 'D'
                                ? form.getValues(`admForca.${index}.forcaE`)
                                : form.getValues(`admForca.${index}.forcaD`);

                              const d = type === 'D' ? parseFloat(val) : parseFloat(otherVal);
                              const e = type === 'E' ? parseFloat(val) : parseFloat(otherVal);

                              if (!isNaN(d) && !isNaN(e) && (d > 0 || e > 0)) {
                                const max = Math.max(d, e);
                                const min = Math.min(d, e);
                                const deficit = Math.round(((max - min) / max) * 100);
                                form.setValue(`admForca.${index}.deficit`, deficit.toString());
                                form.setValue(`admForca.${index}.cif`, calculateCIF(deficit));
                              } else {
                                form.setValue(`admForca.${index}.deficit`, "0");
                                form.setValue(`admForca.${index}.cif`, "XXX.0 Sem déficit");
                              }
                            };

                            return (
                              <tr key={field.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.movimento`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs"
                                    placeholder="Ex: Flexão de ombro"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.admDireita`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-center"
                                    placeholder="°"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.admEsquerda`)}
                                    className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs text-center"
                                    placeholder="°"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    onValueChange={(val) => {
                                      form.setValue(`admForca.${index}.forcaD`, val);
                                      handleStrengthChange(val, 'D');
                                    }}
                                    value={form.watch(`admForca.${index}.forcaD`)}
                                  >
                                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs">
                                      <SelectValue placeholder="-" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["0", "1", "2", "3", "4", "5"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2 border">
                                  <Select
                                    onValueChange={(val) => {
                                      form.setValue(`admForca.${index}.forcaE`, val);
                                      handleStrengthChange(val, 'E');
                                    }}
                                    value={form.watch(`admForca.${index}.forcaE`)}
                                  >
                                    <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 text-xs">
                                      <SelectValue placeholder="-" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["0", "1", "2", "3", "4", "5"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2 border text-center">
                                  <Input
                                    {...form.register(`admForca.${index}.deficit`)}
                                    readOnly
                                    className="h-8 border-none bg-muted/20 shadow-none text-xs text-center font-bold text-primary"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <Input
                                    {...form.register(`admForca.${index}.cif`)}
                                    readOnly
                                    className="h-8 border-none bg-muted/20 shadow-none text-[10px] text-center"
                                  />
                                </td>
                                <td className="p-2 border text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => removeAdmForca(index)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendAdmForca({ movimento: "", admDireita: "", admEsquerda: "", forcaD: "", forcaE: "", deficit: "0", cif: "XXX.0 Sem déficit" })}
                      className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-[10px] uppercase font-bold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar linha
                    </Button>

                    <div className="text-[10px] text-muted-foreground italic">
                      * Classificação automática baseada na CIF: XXX.0 Sem déficit | XXX.1 Leve (&lt;4%) | XXX.2 Moderado (4-24%) | XXX.3 Grave (25-49%) | XXX.4 Completo (≥50%)
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ AVALIAÇÃO ORTOPÉDICA AUTOMATIZADA ══════════════ */}
                <TabsContent value="ortopedica" className="space-y-6 mt-0">
                  <AvaliacaoOrtopedicaTab form={form} />
                </TabsContent>

                <TabsContent value="escalas-funcionais" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="escalaBerg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de Berg (0-56)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="56"
                              placeholder="0-56"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escalaAshworth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de Ashworth (0-4)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="4"
                              placeholder="0-4"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escalaTC6"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TC6 Distância (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Metros"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ AVALIAÇÃO FÍSICA ══════════════ */}
                <TabsContent value="avaliacao-fisica" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      {
                        key: "inspecao",
                        label: "Inspeção / Palpação / Sensibilidade – Postura Estática",
                      },
                      {
                        key: "posturaDinamica",
                        label: "Postural Dinâmica – Marcha / Cinturas",
                      },
                      { key: "perimetria", label: "Perimetria" },
                      { key: "testesEspeciais", label: "Testes Especiais" },
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Registre ${item.label.toLowerCase()}...`}
                                className="min-h-[100px]"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>

                {/* ══════════════ MAPA DA DOR ══════════════ */}
                <TabsContent value="mapa-dor" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        MAPA DA DOR
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                      Selecione a intensidade da dor e pinte as áreas afetadas diretamente sobre o corpo humano.
                    </p>

                    <FormField
                      control={form.control}
                      name="mapaDor"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PainelMapaDor 
                              value={field.value} 
                              onChange={(dataUrl) => field.onChange(dataUrl)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

>>>>>>> parent of cc61847 (Novo Layout)
                {/* ══════════════ PRESCRIÇÕES ══════════════ */}
                <TabsContent value="prescricoes" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                      Prescrições
                    </h3>

                    <div className="space-y-4">
                      {prescricaoFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Descrição
                              </label>
                              <Input
                                placeholder="Descrição do exercício / técnica"
                                {...form.register(
                                  `prescricoes.${index}.descricao` as any
                                )}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Frequência / Quantidade
                              </label>
                              <Input
                                placeholder="Ex: 3x/semana, 10 rep"
                                {...form.register(
                                  `prescricoes.${index}.frequencia` as any
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Progressão de Tratamento
                              </label>
                              <Textarea
                                placeholder="Como o exercício deve evoluir..."
                                className="min-h-[80px] text-xs"
                                {...form.register(
                                  `prescricoes.${index}.progressao` as any
                                )}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Observações Adicionais
                              </label>
                              <Textarea
                                placeholder="Cuidados, contraindicações ou observações..."
                                className="min-h-[80px] text-xs"
                                {...form.register(
                                  `prescricoes.${index}.observacoes` as any
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removePrescricao(index)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}

                      {prescricaoFields.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-6 italic">
                          Nenhuma prescrição adicionada. Clique em "Adicionar Prescrição" para começar.
                        </p>
                      )}
<<<<<<< HEAD
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
<<<<<<< HEAD
<<<<<<< HEAD
                      onClick={() => appendAdmForca({ movimento: "", admDireita: "", admEsquerda: "", forcaD: "", forcaE: "", deficit: "0", cif: "XXX.0 Sem déficit" })}
                      className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-[10px] uppercase font-bold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar linha
                    </Button>

                    <div className="text-[10px] text-muted-foreground italic">
                      * Classificação automática baseada na CIF: XXX.0 Sem déficit | XXX.1 Leve (&lt;4%) | XXX.2 Moderado (4-24%) | XXX.3 Grave (25-49%) | XXX.4 Completo (≥50%)
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ AVALIAÇÃO ORTOPÉDICA AUTOMATIZADA ══════════════ */}
                <TabsContent value="ortopedica" className="space-y-6 mt-0">
                  <AvaliacaoOrtopedicaTab form={form} />
                </TabsContent>

                <TabsContent value="escalas-funcionais" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="escalaBerg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de Berg (0-56)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="56"
                              placeholder="0-56"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escalaAshworth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de Ashworth (0-4)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="4"
                              placeholder="0-4"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="escalaTC6"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TC6 Distância (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Metros"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : undefined
                                )
                              }
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ AVALIAÇÃO FÍSICA ══════════════ */}
                <TabsContent value="avaliacao-fisica" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      {
                        key: "inspecao",
                        label: "Inspeção / Palpação / Sensibilidade – Postura Estática",
                      },
                      {
                        key: "posturaDinamica",
                        label: "Postural Dinâmica – Marcha / Cinturas",
                      },
                      { key: "perimetria", label: "Perimetria" },
                      { key: "testesEspeciais", label: "Testes Especiais" },
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Registre ${item.label.toLowerCase()}...`}
                                className="min-h-[100px]"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>
>>>>>>> parent of cc61847 (Novo Layout)

                {/* ══════════════ MAPA DA DOR ══════════════ */}
                <TabsContent value="mapa-dor" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        MAPA DA DOR
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                      Selecione a intensidade da dor e pinte as áreas afetadas diretamente sobre o corpo humano.
                    </p>

                    <FormField
                      control={form.control}
                      name="mapaDor"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PainelMapaDor 
                              value={field.value} 
                              onChange={(dataUrl) => field.onChange(dataUrl)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
<<<<<<< HEAD
                  <h2 className="text-2xl font-bold text-slate-800">Tudo Pronto!</h2>
                  <p className="text-slate-500">A avaliação foi preenchida com sucesso. Revise os dados e clique em salvar para finalizar o registro no prontuário do paciente.</p>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Resumo da Avaliação:</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Paciente:</span>
                      <span className="font-bold text-slate-800">{form.watch("nomePaciente")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Diagnóstico:</span>
                      <span className="font-bold text-blue-600">{form.watch("diagnosticoFuncionalProvavel")?.substring(0, 30)}...</span>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-6 shadow-lg shadow-green-600/20"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                      FINALIZAR E SALVAR PRONTUÁRIO
                    </Button>
                    <Button type="button" variant="ghost" className="text-slate-400" onClick={() => setCurrentStep(1)}>
                      Revisar Dados
=======
                </TabsContent>

                {/* ══════════════ PRESCRIÇÕES ══════════════ */}
                <TabsContent value="prescricoes" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                      Prescrições
                    </h3>

                    <div className="space-y-4">
                      {prescricaoFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Descrição
                              </label>
                              <Input
                                placeholder="Descrição do exercício / técnica"
                                {...form.register(
                                  `prescricoes.${index}.descricao` as any
                                )}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Frequência / Quantidade
                              </label>
                              <Input
                                placeholder="Ex: 3x/semana, 10 rep"
                                {...form.register(
                                  `prescricoes.${index}.frequencia` as any
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Progressão de Tratamento
                              </label>
                              <Textarea
                                placeholder="Como o exercício deve evoluir..."
                                className="min-h-[80px] text-xs"
                                {...form.register(
                                  `prescricoes.${index}.progressao` as any
                                )}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Observações Adicionais
                              </label>
                              <Textarea
                                placeholder="Cuidados, contraindicações ou observações..."
                                className="min-h-[80px] text-xs"
                                {...form.register(
                                  `prescricoes.${index}.observacoes` as any
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removePrescricao(index)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}

                      {prescricaoFields.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-6 italic">
                          Nenhuma prescrição adicionada. Clique em "Adicionar Prescrição" para começar.
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendPrescricao({ descricao: "", frequencia: "", progressao: "", observacoes: "" } as any)
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Prescrição
>>>>>>> parent of cc61847 (Novo Layout)
=======
                      onClick={() =>
                        appendPrescricao({ descricao: "", frequencia: "", progressao: "", observacoes: "" } as any)
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Prescrição
>>>>>>> parent of cc61847 (Novo Layout)
=======
                      onClick={() =>
                        appendPrescricao({ descricao: "", frequencia: "", progressao: "", observacoes: "" } as any)
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Prescrição
>>>>>>> parent of cc61847 (Novo Layout)
                    </Button>
                  </div>
                </TabsContent>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          {/* Navegação Inferior Fixa */}
          <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-100 p-4 flex items-center justify-between z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="text-slate-500 font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
            </Button>
            <div className="flex items-center gap-1">
              {STEPS.map((s) => (
                <div key={s.id} className={cn("w-2 h-2 rounded-full transition-all", currentStep === s.id ? "bg-blue-600 w-6" : "bg-slate-200")}></div>
              ))}
            </div>
            {currentStep < 5 ? (
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8" onClick={nextStep}>
                Próximo <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="button" 
                className="bg-[#10b981] hover:bg-[#059669] text-white font-bold px-8"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
              >
                Salvar <Save className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
=======
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
                {/* ══════════════ EVOLUÇÃO ══════════════ */}
                <TabsContent value="evolucao" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <h3 className="text-sm font-bold uppercase text-primary flex items-center gap-2">
                        <History className="h-4 w-4" />
                        EVOLUÇÃO DOS ATENDIMENTOS
                      </h3>
                    </div>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)
=======
>>>>>>> parent of cc61847 (Novo Layout)

                    <div className="space-y-6">
                      {evolucoesFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-xl bg-muted/10 space-y-4 relative">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                            <span>Evolução #{index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeEvolucao(index)}
                            >
                              Remover
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`evolucoes.${index}.data`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">DATA</FormLabel>
                                  <FormControl>
                                    <Input type="text" placeholder="DD/MM/AAAA" {...field} className="h-9 text-xs" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`evolucoes.${index}.fisioterapeuta`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">FISIOTERAPEUTA / CREFITO</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="h-9 text-xs" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`evolucoes.${index}.descricao`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">DESCRIÇÃO DA SESSÃO</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Descreva o que foi realizado na sessão..."
                                    className="min-h-[80px] text-xs resize-none"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`evolucoes.${index}.resposta`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">RESPOSTA AO TRATAMENTO</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Como o paciente respondeu..."
                                      className="min-h-[80px] text-xs resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`evolucoes.${index}.ajuste`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-muted-foreground">AJUSTE DE CONDUTA</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Alterações na conduta terapêutica..."
                                      className="min-h-[80px] text-xs resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => appendEvolucao({ data: new Date().toLocaleDateString("pt-BR"), fisioterapeuta: "Dr. Daniel Barcellos — CREFITO 10 389091-F", descricao: "", resposta: "", ajuste: "" })}
                      className="w-full md:w-auto h-10 px-6 border-dashed border-2 hover:bg-muted text-xs font-bold uppercase tracking-wider gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar evolução
                    </Button>
                  </div>
                </TabsContent>

                {/* ══════════════ ESTRATÉGIAS ══════════════ */}
                <TabsContent value="estrategias" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      {
                        key: "estrategiasCurto",
                        label: "Curto Prazo",
                        placeholder: "Objetivos para as próximas sessões...",
                      },
                      {
                        key: "estrategiasMedio",
                        label: "Médio Prazo",
                        placeholder: "Objetivos intermediários...",
                      },
                      {
                        key: "estrategiasLongo",
                        label: "Longo Prazo",
                        placeholder: "Expectativas finais do tratamento...",
                      },
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={item.placeholder}
                                className="min-h-[150px]"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    {/* Interpretação Automática */}
                    <FormField
                      control={form.control}
                      name="interpretacaoAutomatica"
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormLabel>Interpretação Automática</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Gerado automaticamente pelo motor de regras"
                              readOnly
                              className="min-h-[150px] bg-muted/50"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ TERMO DE CONSENTIMENTO ══════════════ */}
                <TabsContent value="termo" className="space-y-6 mt-0">
                  <div className="p-8 bg-card rounded-xl border shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                      <h3 className="font-bold uppercase tracking-tight">Termo de Consentimento Livre e Esclarecido</h3>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-lg text-sm text-muted-foreground leading-relaxed space-y-4 max-h-[400px] overflow-y-auto border shadow-inner">
                      <p>
                        Eu, abaixo assinado, autorizo o(a) fisioterapeuta responsável a realizar os procedimentos de avaliação e tratamento fisioterapêutico necessários ao meu quadro clínico.
                      </p>
                      <p>
                        Fui devidamente informado(a) sobre os objetivos, benefícios, possíveis riscos e alternativas do tratamento proposto. Compreendo que a fisioterapia exige minha participação ativa para o sucesso dos resultados.
                      </p>
                      <p>
                        Declaro que as informações por mim fornecidas nesta ficha de avaliação são verdadeiras. Autorizo também o uso de meus dados clínicos para fins estatísticos e científicos, garantido o total sigilo da minha identidade.
                      </p>
                      <p>
                        Este consentimento poderá ser revogado por mim a qualquer momento, mediante comunicação formal ao profissional responsável.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="aceiteTermo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-primary/5 border-primary/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-bold text-primary cursor-pointer">
                              Li e aceito os termos descritos acima
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Ao marcar esta opção, você confirma que leu e concorda com o Termo de Consentimento.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ ASSINATURAS ══════════════ */}
                <TabsContent value="assinaturas" className="space-y-6 mt-0">
                  <div className="p-8 bg-card rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 text-primary mb-8">
                      <PenTool className="h-5 w-5" />
                      <h3 className="font-bold uppercase tracking-tight">Assinaturas e Finalização</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 pb-6">
                      <div className="space-y-4 flex flex-col items-center">
                        <div className="w-full max-w-xs border-b-2 border-slate-300 h-16 flex items-end justify-center">
                          {/* Espaço para assinatura digital */}
                        </div>
                        <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                          {form.watch("nomePaciente") || "Assinatura do Paciente"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Documento assinado digitalmente</p>
                      </div>

                      <div className="space-y-4 flex flex-col items-center">
                        <div className="w-full max-w-xs border-b-2 border-slate-300 h-16 flex items-end justify-center">
                          {/* Espaço para assinatura digital */}
                        </div>
                        <p className="text-xs font-bold uppercase text-primary tracking-wider">
                          {form.watch("consultor") || "Assinatura do Fisioterapeuta"}
                        </p>
                        <p className="text-[10px] text-muted-foreground italic text-center">
                          Responsável Técnico
                        </p>
                      </div>
                    </div>

                    <div className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">
                        Local e Data: {new Date().toLocaleDateString('pt-BR')} — Florianópolis, SC
                      </div>
                      <p className="text-[10px] text-primary font-bold">
                        ESTE DOCUMENTO É PARTE INTEGRANTE DO PRONTUÁRIO MÉDICO
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div >
  );
}
