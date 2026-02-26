import { zodResolver } from "@hookform/resolvers/zod";
import { insertFichaSchema } from "@shared/routes";
import { useCreateFicha, useUpdateFicha, useFicha } from "@/hooks/use-fichas";
import { useLocation, useRoute } from "wouter";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
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
  FileCheck
} from "lucide-react";
import React, { useEffect, useCallback, useState } from "react";
import { AvaliacaoOrtopedicaTab } from "@/components/AvaliacaoOrtopedicaTab";
import { PainelMapaDor } from "@/components/PainelMapaDor";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

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

// ─── component ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, name: "Dados Gerais", icon: User },
  { id: 2, name: "Avaliação", icon: Stethoscope },
  { id: 3, name: "Diagnóstico", icon: ClipboardCheck },
  { id: 4, name: "Plano", icon: Target },
  { id: 5, name: "Finalização", icon: FileCheck },
];

export default function FichaForm() {
  const [, params] = useRoute("/fichas/:id/edit");
  const isEdit = !!params?.id;
  const id = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const { data: ficha, isLoading: isLoadingFicha } = useFicha(id);
  const createMutation = useCreateFicha();
  const updateMutation = useUpdateFicha();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomePaciente: "",
      idadeAtual: 0,
      dataConsulta: new Date().toLocaleDateString("pt-BR"),
      queixaPrincipal: "",
      hda: "",
      hdp: "",
      mecanismoLesao: "",
      tratamentosAnteriores: "",
      eva: 0,
      tabagismo: "Não",
      etilismo: "Não",
      estresse: "Não",
      trabalhoRepetitivo: "Não",
      admForca: [
        { movimento: "Flexão de ombro", admDireita: "", admEsquerda: "", forcaD: "", forcaE: "", deficit: "0", cif: "XXX.0 Sem déficit" },
      ],
      evolucoes: [
        { data: new Date().toLocaleDateString("pt-BR"), fisioterapeuta: "Dr. Daniel Barcellos — CREFITO 10 389091-F", descricao: "", resposta: "", ajuste: "" },
      ],
      inspecao: "",
      palpacao: "",
      posturaEstatica: "",
      posturaDinamica: "",
      marcha: "",
      perimetria: "",
      testesEspeciais: "",
    },
  });

  const { fields: admForcaFields, append: appendAdmForca, remove: removeAdmForca } = useFieldArray({
    control: form.control,
    name: "admForca",
  });

  const { fields: prescricaoFields, append: appendPrescricao, remove: removePrescricao } = useFieldArray({ 
    control: form.control, 
    name: "prescricoes" as any 
  });

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

  const handleDataNascimentoChange = useCallback((value: string) => {
    const idade = calcularIdade(value);
    if (idade !== null) form.setValue("idadeAtual", idade);
  }, [form]);

  const handlePesoAlturaChange = useCallback(() => {
    const peso = form.getValues("peso");
    const altura = form.getValues("altura");
    const resultado = calcularIMC(peso, altura);
    if (resultado) {
      form.setValue("imc", resultado.imc);
      form.setValue("classificacaoIMC", resultado.classificacao);
    }
  }, [form]);

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

  if (isEdit && isLoadingFicha) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="animate-in fade-in duration-500">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ETAPA 2: AVALIAÇÃO */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Anamnese Card */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                          <ClipboardCheck className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm tracking-tight">Anamnese</h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <FormField control={form.control} name="queixaPrincipal" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400">Queixa Principal:</FormLabel>
                          <FormControl><Input placeholder="" className="bg-white border-slate-200 h-10" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="hda" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400">História da Doença Atual:</FormLabel>
                          <FormControl><Input placeholder="" className="bg-white border-slate-200 h-10" {...field} /></FormControl>
                        </FormItem>
                      )} />
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
                  </CardContent>
                </Card>

                {/* Avaliação Física Card */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Avaliação Física</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-4">
                      {["Inspeção", "Palpação", "ADM & Força", "Postura"].map((tab) => (
                        <Button key={tab} type="button" variant="ghost" size="sm" className={cn("text-[11px] font-bold px-4 h-8 rounded", tab === "Inspeção" ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-slate-50 text-slate-500")}>
                          {tab}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="inspecao" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400 uppercase">Inspeção</FormLabel>
                          <FormControl><Textarea placeholder="Descreva os achados..." className="min-h-[100px] bg-white border-slate-200" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="palpacao" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-medium text-slate-400 uppercase">Palpação</FormLabel>
                          <FormControl><Textarea placeholder="Descreva os achados..." className="min-h-[100px] bg-white border-slate-200" {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Testes Ortopédicos Card */}
                <Card className="shadow-sm border-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight">Testes Ortopédicos</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs font-semibold text-slate-700">Lachman Test</span>
                        <span className="bg-[#10b981] text-white text-[10px] font-bold px-2 py-1 rounded">Positivo</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs font-semibold text-slate-700">Pivot Shift Test</span>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Negativo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ETAPA 3: DIAGNÓSTICO */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <AvaliacaoOrtopedicaTab form={form} />
              
              <Card className="shadow-sm border-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Diagnóstico Funcional</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <FormField control={form.control} name="diagnosticoFuncionalProvavel" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Diagnóstico Fisioterapêutico</FormLabel>
                        <FormControl><Textarea placeholder="Conclusão diagnóstica baseada nos achados..." className="min-h-[100px] bg-slate-50/50" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ETAPA 4: PLANO */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card className="shadow-sm border-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Prescrição Terapêutica</h3>
                    </div>
                    <Button type="button" size="sm" variant="outline" className="text-blue-600 border-blue-200" onClick={() => appendPrescricao({ descricao: "", frequencia: "", progressao: "", observacoes: "" })}>
                      <Plus className="w-4 h-4 mr-1" /> Add Exercício
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {prescricaoFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-blue-50 rounded-xl bg-slate-50/30 relative group">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" onClick={() => removePrescricao(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Exercício / Técnica" {...form.register(`prescricoes.${index}.descricao` as any)} className="bg-white" />
                          <Input placeholder="Frequência (ex: 3x10)" {...form.register(`prescricoes.${index}.frequencia` as any)} className="bg-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ETAPA 5: FINALIZAÇÃO */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Card className="shadow-sm border-blue-50 max-w-2xl mx-auto">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                    <FileCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Tudo Pronto!</h2>
                  <p className="text-slate-500">A avaliação foi preenchida com sucesso. Revise os dados e clique em salvar para finalizar o registro no prontuário do paciente.</p>
                  
                  <div className="pt-6 flex flex-col gap-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-6"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                      FINALIZAR E SALVAR PRONTUÁRIO
                    </Button>
                    <Button variant="ghost" className="text-slate-400" onClick={() => setCurrentStep(1)}>
                      Revisar Dados
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navegação Inferior */}
          <div className="flex items-center justify-between pt-6 border-t border-blue-100">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="text-slate-500">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            {currentStep < 5 ? (
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={nextStep}>
                Próxima Etapa <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>

        </form>
      </Form>
    </div>
  );
}
