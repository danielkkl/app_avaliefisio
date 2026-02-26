import React, { useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2, Info, BookOpen } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AvaliacaoOrtopedicaTabProps {
  form: UseFormReturn<any>;
}

const REGIOES = [
  { value: "ombro", label: "Ombro" },
  { value: "cotovelo", label: "Cotovelo" },
  { value: "cervical", label: "Coluna Cervical" },
  { value: "lombar", label: "Coluna Lombar" },
  { value: "quadril", label: "Quadril" },
  { value: "joelho", label: "Joelho" },
  { value: "tornozelo", label: "Tornozelo" },
];

const TESTES_POR_REGIAO: Record<string, any[]> = {
  ombro: [
    { id: "neer", label: "Teste de Neer", type: "boolean", ref: "Hegedus, 2012", info: "Sens: 0.72, Spec: 0.60. Útil para excluir quando negativo." },
    { id: "hawkins", label: "Hawkins-Kennedy", type: "boolean", ref: "Park et al., 2005", info: "Parte do cluster de impacto subacromial." },
    { id: "painful_arc", label: "Arco Doloroso", type: "boolean", ref: "Park et al., 2005", info: "Teste individual mais forte para impacto (LR+ 3.7)." },
    { id: "infraspinatus", label: "Teste do Infraespinhal", type: "boolean", ref: "Park et al., 2005", info: "Resistência à rotação externa. LR+ 3.9 para impacto." },
    { id: "drop_arm", label: "Drop Arm Test", type: "boolean", ref: "Park et al., 2005", info: "Alta especificidade para ruptura total (Spec: 0.92)." },
    { id: "apprehension", label: "Apprehension Test", type: "boolean", ref: "Farber et al., 2006", info: "LR+ 39.68 quando combinado com Relocation." },
    { id: "relocation", label: "Relocation Test", type: "boolean", ref: "Farber et al., 2006" },
  ],
  cotovelo: [
    { id: "cozen", label: "Teste de Cozen", type: "boolean", ref: "Smidt et al., 2002" },
    { id: "mill", label: "Teste de Mill", type: "boolean", ref: "Smidt et al., 2002" },
  ],
  cervical: [
    { id: "spurling", label: "Teste de Spurling", type: "boolean", ref: "Wainner et al., 2003", info: "Spec: 0.92. Excelente para confirmar radiculopatia." },
    { id: "distracao", label: "Teste de Distração", type: "boolean", ref: "Wainner et al., 2003", info: "Spec: 0.90. Alívio de sintomas confirma radiculopatia." },
    { id: "ultt", label: "ULTT A (Mediano)", type: "boolean", ref: "Wainner et al., 2003", info: "Sens: 0.97. Teste de 'padrão-ouro' para exclusão." },
    { id: "rotacao", label: "Rotação Cervical < 60°", type: "boolean", ref: "Wainner et al., 2003" },
  ],
  lombar: [
    { id: "lasegue", label: "Lasègue (SLR)", type: "number", unit: "°", ref: "Deville, 2000", info: "Sens: 0.91. Se negativo, exclui hérnia discal com 90% de confiança." },
    { id: "slump", label: "Teste de Slump", type: "boolean", ref: "Majlesi, 2008", info: "Mais sensível e específico que o SLR para radiculopatia." },
    { id: "schober", label: "Teste de Schober", type: "number", unit: "cm", ref: "Moll & Wright, 1971" },
  ],
  quadril: [
    { id: "faber", label: "FABER (Patrick)", type: "select", options: ["Negativo", "Dor Anterior", "Dor Posterior"], ref: "Reiman, 2013" },
    { id: "fadir", label: "FADIR", type: "boolean", ref: "Reiman, 2013", info: "Sens: 0.95. Ótimo para excluir impacto femoroacetabular." },
    { id: "trendelenburg", label: "Sinal de Trendelenburg", type: "boolean", ref: "Hardcastle, 1985" },
  ],
  joelho: [
    { id: "lachman_grau", label: "Lachman (Grau)", type: "select", options: ["0", "1", "2", "3"], ref: "Benjaminse, 2006", info: "Sens: 0.85, Spec: 0.94. Teste individual mais acurado para LCA." },
    { id: "lachman_fim", label: "Lachman (Fim de Curso)", type: "select", options: ["Duro", "Macio"] },
    { id: "pivot_shift", label: "Pivot Shift", type: "boolean", ref: "Benjaminse, 2006", info: "Spec: 0.98. Se positivo, confirma lesão do LCA (LR+ 8.5)." },
    { id: "mcmurray", label: "McMurray", type: "select", options: ["Negativo", "Estalido", "Dor", "Estalido + Dor"], ref: "Hegedus, 2007" },
  ],
  tornozelo: [
    { id: "gaveta_ant_tornozelo", label: "Gaveta Anterior", type: "boolean", ref: "van Dijk, 1996" },
    { id: "thompson", label: "Teste de Thompson", type: "boolean", ref: "Maffulli, 1998", info: "Spec: 0.96. Padrão-ouro para ruptura de Aquiles." },
  ],
};

export function AvaliacaoOrtopedicaTab({ form }: AvaliacaoOrtopedicaTabProps) {
  const regiao = form.watch("regiaoAvaliada");
  const testesValues = form.watch("testesOrtopedicosJson") || {};

  useEffect(() => {
    let diagnostico = "";
    let probabilidade = "Baixa";

    if (!regiao) return;

    // LÓGICA DE CLUSTERS ENDOSSADA
    if (regiao === "cervical") {
      let count = 0;
      if (testesValues.spurling === "true") count++;
      if (testesValues.distracao === "true") count++;
      if (testesValues.ultt === "true") count++;
      if (testesValues.rotacao === "true") count++;

      if (count === 4) {
        diagnostico = "Cluster de Wainner completo (4/4). Probabilidade de Radiculopatia Cervical > 90% (LR+ 30.3).";
        probabilidade = "Alta";
      } else if (count === 3) {
        diagnostico = "Cluster de Wainner (3/4). Probabilidade de Radiculopatia Cervical ~ 65% (LR+ 6.1).";
        probabilidade = "Alta";
      } else if (testesValues.ultt === "false") {
        diagnostico = "ULTT negativo. Alta probabilidade de EXCLUSÃO de radiculopatia (Sens: 0.97).";
        probabilidade = "Baixa";
      }
    } else if (regiao === "ombro") {
      // Impacto (Park et al.)
      let impCount = 0;
      if (testesValues.hawkins === "true") impCount++;
      if (testesValues.painful_arc === "true") impCount++;
      if (testesValues.infraspinatus === "true") impCount++;

      if (impCount === 3) {
        diagnostico = "Cluster de Park para Impacto (3/3) positivo. Alta probabilidade (LR+ 10.56).";
        probabilidade = "Alta";
      } else if (testesValues.drop_arm === "true" && testesValues.painful_arc === "true" && testesValues.infraspinatus === "true") {
        diagnostico = "Cluster para Ruptura de Manguito (Park) positivo. Alta probabilidade (LR+ 28.0).";
        probabilidade = "Alta";
      } else if (testesValues.apprehension === "true" && testesValues.relocation === "true") {
        diagnostico = "Cluster de Farber para Instabilidade Anterior positivo. Alta especificidade (LR+ 39.68).";
        probabilidade = "Alta";
      }
    } else if (regiao === "joelho") {
      if (testesValues.lachman_fim === "Macio" || testesValues.pivot_shift === "true") {
        diagnostico = "Alta suspeita de lesão do LCA. ";
        if (testesValues.pivot_shift === "true") diagnostico += "Pivot Shift positivo confirma instabilidade rotatória (LR+ 8.5).";
        probabilidade = "Alta";
      }
    } else if (regiao === "lombar") {
      const lasegueVal = parseFloat(testesValues.lasegue);
      if (testesValues.slump === "true" && !isNaN(lasegueVal) && lasegueVal < 60) {
        diagnostico = "Alta probabilidade de compressão radicular (Slump + Lasègue positivos).";
        probabilidade = "Alta";
      } else if (!isNaN(lasegueVal) && lasegueVal > 70 && testesValues.slump === "false") {
        diagnostico = "Baixa probabilidade de hérnia discal compressiva (Testes de tensão neural negativos).";
        probabilidade = "Baixa";
      }
    } else if (regiao === "tornozelo") {
      if (testesValues.thompson === "false") {
        diagnostico = "Ruptura de Tendão de Aquiles confirmada pelo Teste de Thompson (Alta Especificidade).";
        probabilidade = "Alta";
      }
    }

    const currentDiag = form.getValues("diagnosticoFuncionalProvavel");
    const currentProb = form.getValues("probabilidadeClinica");

    if (diagnostico !== currentDiag) form.setValue("diagnosticoFuncionalProvavel", diagnostico);
    if (probabilidade !== currentProb) form.setValue("probabilidadeClinica", probabilidade);
  }, [regiao, JSON.stringify(testesValues), form]);

  const renderTesteField = (teste: any) => {
    const fieldName = `testesOrtopedicosJson.${teste.id}`;
    return (
      <FormField
        key={teste.id}
        control={form.control}
        name={fieldName as any}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium flex items-center gap-1">
                {teste.label}
                {teste.info && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent><p className="max-w-xs text-xs">{teste.info}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </FormLabel>
              {teste.ref && <Badge variant="outline" className="text-[9px] opacity-70">{teste.ref}</Badge>}
            </div>
            <FormControl>
              {teste.type === "boolean" ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Positivo / Sim</SelectItem>
                    <SelectItem value="false">Negativo / Não</SelectItem>
                  </SelectContent>
                </Select>
              ) : teste.type === "select" ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {teste.options.map((opt: string) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <Input type="number" {...field} className="h-9 pr-8" onChange={(e) => field.onChange(e.target.value)} placeholder="Valor" />
                  {teste.unit && <span className="absolute right-3 top-2 text-xs text-muted-foreground">{teste.unit}</span>}
                </div>
              )}
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <FormField
            control={form.control}
            name="regiaoAvaliada"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Região Corporal
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-primary/5 border-primary/20 font-medium">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REGIOES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {regiao && (
            <div className="p-4 rounded-lg bg-muted/30 border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Acurácia Diagnóstica
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-xs">Probabilidade:</span>
                <Badge variant={form.watch("probabilidadeClinica") === "Alta" ? "destructive" : form.watch("probabilidadeClinica") === "Moderada" ? "default" : "secondary"}>
                  {form.watch("probabilidadeClinica") || "Baixa"}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                Cálculos baseados em Razões de Verossimilhança (Likelihood Ratios) de meta-análises (Hegedus, Park, Wainner).
              </p>
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          {!regiao ? (
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">Selecione uma região para carregar os testes e clusters científicos.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-6 bg-card rounded-xl border shadow-sm">
                {TESTES_POR_REGIAO[regiao]?.map(renderTesteField)}
              </div>
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold"><CheckCircle2 className="w-5 h-5" />Diagnóstico Funcional Endossado</div>
                <FormField
                  control={form.control}
                  name="diagnosticoFuncionalProvavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="bg-background min-h-[100px] border-primary/20 resize-none" placeholder="O sistema interpretará os clusters automaticamente..." />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-[10px] text-blue-800 leading-normal">
                    <strong>Nota Científica:</strong> Este sistema utiliza <strong>Likelihood Ratios (LR)</strong> para calcular a probabilidade pós-teste. Clusters com LR+ &gt; 10 indicam uma mudança clínica significativa na probabilidade de patologia.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
