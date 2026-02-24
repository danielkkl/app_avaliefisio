import { useForm } from "react-hook-form";
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
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

const formSchema = insertFichaSchema;
type FormValues = z.infer<typeof formSchema>;

export default function FichaForm() {
  const [, params] = useRoute("/fichas/:id/edit");
  const isEdit = !!params?.id;
  const id = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();

  const { data: ficha, isLoading: isLoadingFicha } = useFicha(id);
  const createMutation = useCreateFicha();
  const updateMutation = useUpdateFicha();

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
    },
  });

  useEffect(() => {
    if (ficha) {
      const { id, userId, createdAt, updatedAt, ...rest } = ficha as any;
      form.reset(rest);
    }
  }, [ficha, form]);

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
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

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
        description={isEdit ? `Editando registro de ${ficha?.nomePaciente}` : "Crie um novo registro de avaliação de paciente."}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="identificacao" className="w-full">
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-8">
              <div className="flex items-center justify-between">
                <TabsList className="w-full justify-start overflow-x-auto no-scrollbar h-auto p-1 bg-transparent gap-2">
                  {[
                    { label: "Identificação", value: "identificacao" },
                    { label: "Hábitos de Vida", value: "habitos-de-vida" },
                    { label: "Sinais Vitais", value: "sinais-vitais" },
                    { label: "Anamnese", value: "anamnese" },
                    { label: "Avaliação Física", value: "avaliacao-fisica" },
                    { label: "Estratégias", value: "estrategias" }
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
                  <Button type="button" variant="outline" onClick={() => setLocation("/fichas")}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending} className="shadow-lg shadow-primary/20">
                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Registro
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <TabsContent value="identificacao" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="nomePaciente"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Nome do Paciente</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o nome completo" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dataNascimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 01/01/1990" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idadeAtual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Anos" {...field} onChange={e => field.onChange(parseInt(e.target.value))} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sexo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexo</FormLabel>
                          <FormControl>
                            <Input placeholder="Masc/Fem" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="paciente@exemplo.com" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissão</FormLabel>
                          <FormControl>
                            <Input placeholder="Cargo ou atividade" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diagnosticoClinico"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Diagnóstico Clínico</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva o diagnóstico clínico do paciente..." {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="habitos-de-vida" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      { key: "alimentacao", label: "Alimentação" },
                      { key: "sono", label: "Sono" },
                      { key: "ingestaoHidrica", label: "Ingestão Hídrica" },
                      { key: "atividadeFisica", label: "Atividade Física" },
                      { key: "medicamentos", label: "Medicamentos" },
                      { key: "historicoEsportivo", label: "Histórico Esportivo" }
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem className="col-span-2 md:col-span-1">
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Textarea placeholder={`Informações sobre ${item.label.toLowerCase()}...`} className="min-h-[100px]" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="sinais-vitais" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      { key: "pa", label: "PA", placeholder: "120/80" },
                      { key: "fc", label: "FC", placeholder: "70 bpm" },
                      { key: "fr", label: "FR", placeholder: "16 irpm" },
                      { key: "satO2", label: "SatO2", placeholder: "98%" },
                      { key: "temperatura", label: "Temperatura", placeholder: "36.5°C" },
                      { key: "peso", label: "Peso", placeholder: "70 kg" },
                      { key: "altura", label: "Altura", placeholder: "1.75 m" },
                      { key: "imc", label: "IMC", placeholder: "22.8" }
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Input placeholder={item.placeholder} {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="anamnese" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="hda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>História da Doença Atual (HDA)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva a evolução dos sintomas atuais..." className="min-h-[120px]" {...field} value={field.value || ""} />
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
                          <FormLabel>História Doença Pregressa (HDP)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Antecedentes médicos, cirurgias, alergias..." className="min-h-[120px]" {...field} value={field.value || ""} />
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
                              <Input placeholder="Quando a dor começou?" {...field} value={field.value || ""} />
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
                            <FormLabel>Nível de Dor (EVA 0-10)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="10" placeholder="0 a 10" {...field} onChange={e => field.onChange(parseInt(e.target.value))} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="avaliacao-fisica" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    {[
                      { key: "inspecao", label: "Inspeção" },
                      { key: "palpacao", label: "Palpação" },
                      { key: "posturaEstatica", label: "Postura Estática" },
                      { key: "posturaDinamica", label: "Postura Dinâmica" },
                      { key: "testesEspeciais", label: "Testes Especiais" }
                    ].map((item) => (
                      <FormField
                        key={item.key}
                        control={form.control}
                        name={item.key as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Textarea placeholder={`Resultados da ${item.label.toLowerCase()}...`} className="min-h-[100px]" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="estrategias" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                    <FormField
                      control={form.control}
                      name="estrategiasCurto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Curto Prazo</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Objetivos para as próximas sessões..." className="min-h-[200px]" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estrategiasMedio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Médio Prazo</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Objetivos intermediários..." className="min-h-[200px]" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estrategiasLongo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longo Prazo</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Expectativas finais do tratamento..." className="min-h-[200px]" {...field} value={field.value || ""} />
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
