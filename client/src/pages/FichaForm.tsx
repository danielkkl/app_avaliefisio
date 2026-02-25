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
import { Loader2, Save, ArrowLeft, Plus, Trash2, Printer } from "lucide-react";
import { useEffect, useCallback, useRef } from "react";
import { z } from "zod";

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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomePaciente: "",
      idadeAtual: 0,
      numeroAtendimentos: 0,
      eva: 0,
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
      interpretacaoAutomatica: "",
      mapaDor: "",
      alimentacao: { selected: [], other: "" },
      sono: { selected: [], other: "" },
      ingestaoHidrica: { selected: [], other: "" },
      atividadeFisica: { selected: [], other: "" },
      medicamentos: { selected: [], other: "" },
      historicoEsportivo: { selected: [], other: "" },
    },
  });

  // ── field arrays ────────────────────────────────────────────────────────
  const {
    fields: musculoFields,
    append: appendMusculo,
    remove: removeMusculo,
  } = useFieldArray({ control: form.control, name: "musculos" as any });

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

  // ── salvar mapa da dor ──────────────────────────────────────────────────
  const salvarMapaDor = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      form.setValue("mapaDor", dataUrl);
    }
  };

  if (isEdit && isLoadingFicha) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const consultor = form.watch("consultor");

  return (
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
                    { label: "Testes Ortopédicos", value: "testes-ortopedicos" },
                    { label: "Escalas Funcionais", value: "escalas-funcionais" },
                    { label: "Avaliação Física", value: "avaliacao-fisica" },
                    { label: "Mapa da Dor", value: "mapa-dor" },
                    { label: "Prescrições", value: "prescricoes" },
                    { label: "Estratégias", value: "estrategias" },
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

                    {/* Nº Atendimentos */}
                    <FormField
                      control={form.control}
                      name="numeroAtendimentos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº Atendimentos Cinesioterapia</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              value={field.value ?? ""}
                            />
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

                  {/* ── Assinaturas ─────────────────────────────────────── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 bg-card rounded-xl border shadow-sm">
                    <div className="text-center">
                      <div className="border-t mt-10 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {form.watch("nomePaciente") || "Assinatura do Paciente"}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="border-t mt-10 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {consultor || "Assinatura do Fisioterapeuta"}
                      </p>
                    </div>
                  </div>
                </TabsContent>


                <TabsContent value="habitos-de-vida" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      {
                        key: "alimentacao",
                        label: "Alimentação",
                        options: [
                          "Alimentação saudável",
                          "Alimentação desregulada",
                          "Dieta rica em proteínas",
                          "Dieta baixa em carboidratos",
                          "Restrição calórica",
                        ],
                      },
                      {
                        key: "sono",
                        label: "Sono",
                        options: [
                          "Sono regular",
                          "Insônia",
                          "Apneia do sono",
                          "Dorme poucas horas",
                          "Sono agitado",
                        ],
                      },
                      {
                        key: "ingestaoHidrica",
                        label: "Ingestão Hídrica",
                        options: ["Ingestão hídrica adequada", "Ingestão hídrica insuficiente"],
                      },
                      {
                        key: "atividadeFisica",
                        label: "Atividade Física",
                        options: [
                          "Sedentário",
                          "Exercícios leves",
                          "Exercícios moderados",
                          "Exercícios intensos",
                          "Atividades esportivas regulares",
                        ],
                      },
                      {
                        key: "medicamentos",
                        label: "Medicamentos",
                        options: [
                          "Uso de medicamentos",
                          "Uso de suplementos",
                          "Uso de fitoterápicos",
                          "Não utiliza medicamentos",
                        ],
                      },
                      {
                        key: "historicoEsportivo",
                        label: "Histórico Esportivo",
                        options: [
                          "Atleta amador",
                          "Atleta profissional",
                          "Histórico esportivo",
                          "Histórico esportivo na infância",
                        ],
                      },
                    ].map((category) => (
                      <div key={category.key} className="space-y-4 p-4 border rounded-lg bg-muted/20">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-primary">
                          {category.label}
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {category.options.map((option) => (
                            <FormField
                              key={option}
                              control={form.control}
                              name={category.key as any}
                              render={({ field }) => {
                                const selected = field.value?.selected || [];
                                return (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={selected.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const newSelected = checked
                                            ? [...selected, option]
                                            : selected.filter((s: string) => s !== option);
                                          field.onChange({
                                            ...field.value,
                                            selected: newSelected,
                                          });
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {option}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormField
                            control={form.control}
                            name={category.key as any}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2 border-t">
                                <FormControl>
                                  <Checkbox
                                    checked={!!field.value?.other}
                                    onCheckedChange={(checked) => {
                                      if (!checked) {
                                        field.onChange({ ...field.value, other: "" });
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="text-sm font-normal">Outro:</span>
                                  <Input
                                    placeholder="..."
                                    className="h-8 text-xs"
                                    value={field.value?.other || ""}
                                    onChange={(e) =>
                                      field.onChange({ ...field.value, other: e.target.value })
                                    }
                                  />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
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
                  <div className="grid grid-cols-1 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="hda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HDA – História da Doença Atual</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva a evolução dos sintomas atuais..."
                              className="min-h-[120px]"
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
                          <FormLabel>HDP – História Patológica Pregressa</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Antecedentes médicos, cirurgias, alergias..."
                              className="min-h-[120px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="inicioDor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Início da Dor</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Quando a dor começou?"
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
                        name="eva"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EVA – Nível de Dor (0–10)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                placeholder="0 a 10"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ ADM / FORÇA MUSCULAR ══════════════ */}
                <TabsContent value="adm-forca" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                      ADM / Força Muscular
                    </h3>

                    {/* Campos específicos do fich2.html */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="flexaoJoelho"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Flexão Joelho (graus)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0-180"
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
                        name="extensaoJoelho"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Extensão Joelho (graus)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0-180"
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
                        name="forcaMRC"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Força MRC (0-5)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                placeholder="0-5"
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

                    {/* Tabela dinâmica de músculos */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Músculos Adicionais</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="border px-3 py-2 text-left">Músculo / Movimento</th>
                              <th className="border px-3 py-2 text-left w-32">Grau (0–5)</th>
                              <th className="border px-3 py-2 w-12"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {musculoFields.map((field, index) => (
                              <tr key={field.id}>
                                <td className="border px-2 py-1">
                                  <Input
                                    placeholder="Nome do músculo ou movimento"
                                    className="border-0 shadow-none focus-visible:ring-0"
                                    {...form.register(
                                      `musculos.${index}.musculo` as any
                                    )}
                                  />
                                </td>
                                <td className="border px-2 py-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="5"
                                    placeholder="0–5"
                                    className="border-0 shadow-none focus-visible:ring-0"
                                    {...form.register(
                                      `musculos.${index}.grau` as any
                                    )}
                                  />
                                </td>
                                <td className="border px-2 py-1 text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMusculo(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {musculoFields.length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="border px-3 py-4 text-center text-muted-foreground text-sm"
                                >
                                  Nenhum músculo adicionado.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendMusculo({ musculo: "", grau: "" } as any)
                        }
                        className="mt-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Músculo
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ TESTES ORTOPÉDICOS ══════════════ */}
                <TabsContent value="testes-ortopedicos" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="testeLachman"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teste de Lachman</FormLabel>
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
                              <SelectItem value="Negativo">Negativo</SelectItem>
                              <SelectItem value="Grau 1">Grau 1</SelectItem>
                              <SelectItem value="Grau 2">Grau 2</SelectItem>
                              <SelectItem value="Grau 3">Grau 3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="testeFimDeCurso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fim de Curso</FormLabel>
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
                              <SelectItem value="Duro">Duro</SelectItem>
                              <SelectItem value="Macio">Macio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="testeNeer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teste de Neer</FormLabel>
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
                              <SelectItem value="Negativo">Negativo</SelectItem>
                              <SelectItem value="Positivo">Positivo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* ══════════════ ESCALAS FUNCIONAIS ══════════════ */}
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
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                      Mapa da Dor (Canvas)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Desenhe na área abaixo para marcar os locais de dor do paciente.
                    </p>
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={400}
                      className="border-2 border-dashed border-muted-foreground rounded cursor-crosshair bg-white"
                      style={{ display: "block", margin: "0 auto" }}
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (canvasRef.current) {
                            const ctx = canvasRef.current.getContext("2d");
                            if (ctx) {
                              ctx.clearRect(
                                0,
                                0,
                                canvasRef.current.width,
                                canvasRef.current.height
                              );
                            }
                          }
                        }}
                      >
                        Limpar Canvas
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={salvarMapaDor}
                      >
                        Salvar Mapa
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ══════════════ PRESCRIÇÕES ══════════════ */}
                <TabsContent value="prescricoes" className="space-y-6 mt-0">
                  <div className="p-6 bg-card rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                      Prescrições
                    </h3>

                    <div className="space-y-3">
                      {prescricaoFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end p-3 border rounded-lg"
                        >
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
                          <div className="flex gap-2">
                            <div className="flex-1">
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="mt-5"
                              onClick={() => removePrescricao(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {prescricaoFields.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">
                          Nenhuma prescrição adicionada.
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendPrescricao({ descricao: "", frequencia: "" } as any)
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Prescrição
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
              </CardContent>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
