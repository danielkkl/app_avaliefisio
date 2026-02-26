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

// Importar os dados de combinações
import ombroData from "./ombro_combinacoes_completas.json";
import cotoveloData from "./cotovelo_combinacoes.json";
import cervicalData from "./coluna_cervical_cluster_wainner.json";
import lombarData from "./coluna_lombar_combinacoes.json";
import quadrilData from "./quadril_combinacoes.json";
import joelhoData from "./joelho_64_combinacoes.json";
import tornozoloData from "./tornozelo_combinacoes.json";

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

// Mapeamento de regiões para dados de combinações
const COMBINACOES_POR_REGIAO: Record<string, any[]> = {
  ombro: ombroData,
  cotovelo: cotoveloData,
  cervical: cervicalData,
  lombar: lombarData,
  quadril: quadrilData,
  joelho: joelhoData,
  tornozelo: tornozoloData,
};

// Definição dos testes por região com suas opções
const TESTES_POR_REGIAO: Record<string, any[]> = {
  ombro: [
    { id: "neer", label: "Teste de Neer", type: "boolean", ref: "Hegedus, 2012" },
    { id: "hawkins_kennedy", label: "Hawkins-Kennedy", type: "boolean", ref: "Park et al., 2005" },
    { id: "arco_doloroso", label: "Arco Doloroso", type: "boolean", ref: "Park et al., 2005" },
    { id: "infraespinhal", label: "Teste do Infraespinhal", type: "boolean", ref: "Park et al., 2005" },
    { id: "drop_arm", label: "Drop Arm Test", type: "boolean", ref: "Park et al., 2005" },
    { id: "apprehension", label: "Apprehension Test", type: "boolean", ref: "Farber et al., 2006" },
    { id: "relocation", label: "Relocation Test", type: "boolean", ref: "Farber et al., 2006" },
  ],
  cotovelo: [
    { id: "cozen", label: "Teste de Cozen", type: "boolean", ref: "Smidt et al., 2002" },
    { id: "mill", label: "Teste de Mill", type: "boolean", ref: "Smidt et al., 2002" },
  ],
  cervical: [
    { id: "spurling", label: "Teste de Spurling", type: "boolean", ref: "Wainner et al., 2003" },
    { id: "distracao", label: "Teste de Distração", type: "boolean", ref: "Wainner et al., 2003" },
    { id: "ultt_mediano", label: "ULTT A (Mediano)", type: "boolean", ref: "Wainner et al., 2003" },
    { id: "rotacao_menor_60", label: "Rotação Cervical < 60°", type: "boolean", ref: "Wainner et al., 2003" },
  ],
  lombar: [
    { id: "lasegue", label: "Lasègue (SLR)", type: "boolean", ref: "Deville, 2000" },
    { id: "slump", label: "Teste de Slump", type: "boolean", ref: "Majlesi, 2008" },
    { id: "schober", label: "Teste de Schober", type: "select", options: ["normal", "reduzido"], ref: "Moll & Wright, 1971" },
  ],
  quadril: [
    { id: "faber", label: "FABER (Patrick)", type: "select", options: ["negativo", "dor anterior", "dor posterior"], ref: "Reiman, 2013" },
    { id: "fadir", label: "FADIR", type: "boolean", ref: "Reiman, 2013" },
    { id: "trendelenburg", label: "Sinal de Trendelenburg", type: "boolean", ref: "Hardcastle, 1985" },
  ],
  joelho: [
    { id: "lachman_grau", label: "Lachman (Grau)", type: "select", options: ["0", "1", "2", "3"], ref: "Benjaminse, 2006" },
    { id: "lachman_fim", label: "Lachman (Fim de Curso)", type: "select", options: ["duro", "macio"], ref: "Benjaminse, 2006" },
    { id: "pivot_shift", label: "Pivot Shift", type: "boolean", ref: "Benjaminse, 2006" },
    { id: "mcmurray", label: "McMurray", type: "select", options: ["negativo", "estalido", "dor", "estalido + dor"], ref: "Hegedus, 2007" },
  ],
  tornozelo: [
    { id: "gaveta_anterior", label: "Gaveta Anterior", type: "boolean", ref: "van Dijk, 1996" },
    { id: "teste_thompson", label: "Teste de Thompson", type: "boolean", ref: "Maffulli, 1998" },
  ],
};

// Função para normalizar valores para comparação
function normalizarValor(valor: any): string {
  if (valor === true || valor === "true") return "positivo";
  if (valor === false || valor === "false") return "negativo";
  return String(valor).toLowerCase().trim();
}

// Função para detectar o nível de probabilidade baseado no texto do resultado
function detectarProbabilidade(resultado: string): string {
  const textoLower = resultado.toLowerCase();
  
  // Palavras-chave para "Alta" probabilidade
  if (textoLower.includes("alta probabilidade") || 
      textoLower.includes("fortemente sugestivo") ||
      textoLower.includes("confirma") ||
      textoLower.includes(">90%") ||
      textoLower.includes("alta especificidade") ||
      textoLower.includes("padrão-ouro")) {
    return "Alta";
  }
  
  // Palavras-chave para "Moderada" probabilidade
  if (textoLower.includes("probabilidade moderada") ||
      textoLower.includes("possível") ||
      textoLower.includes("sugere") ||
      textoLower.includes("isolado")) {
    return "Moderada";
  }
  
  // Padrão: "Baixa" probabilidade
  return "Baixa";
}

// Função para encontrar o resultado baseado nas combinações
function encontrarResultado(regiao: string, testes: Record<string, any>): string {
  const combinacoes = COMBINACOES_POR_REGIAO[regiao];
  if (!combinacoes || combinacoes.length === 0) return "";

  // Normalizar os testes para comparação
  const testesNormalizados: Record<string, string> = {};
  for (const [chave, valor] of Object.entries(testes)) {
    if (valor !== null && valor !== undefined && valor !== "") {
      testesNormalizados[chave] = normalizarValor(valor);
    }
  }

  // Procurar pela combinação correspondente
  for (const combinacao of combinacoes) {
    let match = true;
    let testesChecados = 0;
    
    for (const [chave, valor] of Object.entries(combinacao)) {
      if (chave === "resultado") continue;
      
      const valorNormalizado = normalizarValor(valor);
      const testeNormalizado = testesNormalizados[chave];
      
      if (testeNormalizado === undefined) {
        // Teste não foi preenchido
        match = false;
        break;
      }
      
      if (testeNormalizado !== valorNormalizado) {
        match = false;
        break;
      }
      
      testesChecados++;
    }
    
    if (match && testesChecados > 0) {
      return combinacao.resultado;
    }
  }

  return "Preencha todos os testes para gerar o diagnóstico automático.";
}

export function AvaliacaoOrtopedicaTab({ form }: AvaliacaoOrtopedicaTabProps) {
  const regiao = form.watch("regiaoAvaliada");
  const testesValues = form.watch("testesOrtopedicosJson") || {};
  const diagnostico = form.watch("diagnosticoFuncionalProvavel");

  useEffect(() => {
    if (!regiao) return;

    // Encontrar o resultado baseado nas combinações JSON
    const resultado = encontrarResultado(regiao, testesValues);
    
    const currentDiag = form.getValues("diagnosticoFuncionalProvavel");
    if (resultado !== currentDiag) {
      form.setValue("diagnosticoFuncionalProvavel", resultado);
      
      // Detectar e atualizar a probabilidade
      const probabilidade = detectarProbabilidade(resultado);
      form.setValue("probabilidadeClinica", probabilidade);
    }
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
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positivo">Positivo / Sim</SelectItem>
                    <SelectItem value="negativo">Negativo / Não</SelectItem>
                  </SelectContent>
                </Select>
              ) : teste.type === "select" ? (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {teste.options.map((opt: string) => <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>)}
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

  const probabilidadeAtual = diagnostico ? detectarProbabilidade(diagnostico) : "Baixa";
  const badgeVariant = probabilidadeAtual === "Alta" ? "destructive" : probabilidadeAtual === "Moderada" ? "default" : "secondary";

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
                <Select onValueChange={field.onChange} value={field.value || ""}>
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
                Diagnóstico Automático
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-xs">Evidência Clínica:</span>
                <Badge variant={badgeVariant}>
                  {probabilidadeAtual}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight italic">
                Baseado em combinações de testes clínicos validados.
              </p>
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          {!regiao ? (
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">Selecione uma região para carregar os testes clínicos.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-6 bg-card rounded-xl border shadow-sm">
                {TESTES_POR_REGIAO[regiao]?.map(renderTesteField)}
              </div>
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold"><CheckCircle2 className="w-5 h-5" />Diagnóstico Funcional Baseado em Evidência</div>
                <FormField
                  control={form.control}
                  name="diagnosticoFuncionalProvavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="bg-background min-h-[100px] border-primary/20 resize-none" placeholder="O sistema interpretará os testes automaticamente..." />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-[10px] text-blue-800 leading-normal">
                    <strong>Nota Clínica:</strong> Este sistema utiliza combinações de testes ortopédicos validados em literatura científica para gerar diagnósticos funcionais prováveis. Sempre correlacionar com achados clínicos adicionais e história do paciente.
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
