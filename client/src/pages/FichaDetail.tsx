import { useFicha, useDeleteFicha } from "@/hooks/use-fichas";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  User,
  Activity,
  ClipboardList,
  Dumbbell,
  Printer,
  Stethoscope,
  Zap,
  History,
  ShieldCheck,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  Map,
  Target,
  Scale,
  HeartPulse,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// ─── helpers ────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: any;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100/50">
      {Icon && <Icon className="w-4 h-4 text-blue-500 mt-0.5" />}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700">{value ?? "-"}</p>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, color = "blue" }: { icon: any, title: string, color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center`}>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

export default function FichaDetail() {
  const [, params] = useRoute("/fichas/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: ficha, isLoading } = useFicha(id);
  const { mutateAsync: deleteFicha } = useDeleteFicha();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Activity className="w-10 h-10 text-blue-600 animate-pulse" />
        <p className="text-slate-500 font-medium">Carregando prontuário completo...</p>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-bold">Avaliação Não Encontrada</h2>
        <Button variant="ghost" onClick={() => setLocation("/fichas")}>
          Voltar para a Lista
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteFicha(id);
    setLocation("/fichas");
  };

  const gerarPDF = () => {
    window.print();
  };

  const prescricoes: any[] = Array.isArray(ficha.prescricoes) ? (ficha.prescricoes as any[]) : [];
  const admForca: any[] = Array.isArray(ficha.admForca) ? (ficha.admForca as any[]) : [];
  const evolucoes: any[] = Array.isArray(ficha.evolucoes) ? (ficha.evolucoes as any[]) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20 print:p-0 print:space-y-4">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="ghost"
          className="text-slate-500 hover:text-blue-600 transition-colors"
          onClick={() => setLocation("/fichas")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Lista
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={gerarPDF} className="border-slate-200 text-slate-600">
            <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
          </Button>
          <Link href={`/fichas/${id}/edit`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
              <Edit className="w-4 h-4 mr-2" /> Editar Prontuário
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Header Card */}
      <Card className="border-none shadow-sm overflow-hidden print:shadow-none print:border">
        <div className="h-2 bg-blue-600 print:hidden"></div>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold border border-blue-100">
                {ficha.nomePaciente?.[0] || "P"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{ficha.nomePaciente}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ficha.idadeAtual} anos</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Avaliado em {format(new Date(ficha.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px] font-bold">Prontuário Ativo</Badge>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center min-w-[200px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Diagnóstico Clínico</p>
              <p className="text-sm font-bold text-slate-700 leading-tight">{ficha.diagnosticoClinico || "Não informado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda: Dados Gerais e Sinais Vitais */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <SectionTitle icon={User} title="Dados do Paciente" />
              <div className="grid grid-cols-1 gap-3">
                <InfoRow label="CPF" value={ficha.cpf} />
                <InfoRow label="Telefone" value={ficha.telefone} />
                <InfoRow label="Profissão" value={ficha.profissao} />
                <InfoRow label="Sexo" value={ficha.sexo} />
                <InfoRow label="Plano" value={ficha.planoSaude} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <SectionTitle icon={Activity} title="Sinais Vitais" color="emerald" />
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="P.A." value={ficha.pa} />
                <InfoRow label="F.C." value={ficha.fc ? `${ficha.fc} bpm` : null} />
                <InfoRow label="Peso" value={ficha.peso ? `${ficha.peso} kg` : null} />
                <InfoRow label="Altura" value={ficha.altura ? `${ficha.altura} m` : null} />
              </div>
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">IMC</p>
                    <p className="text-2xl font-black text-emerald-900 leading-none">{ficha.imc || "0.00"}</p>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-none text-[10px]">{ficha.classificacaoIMC || "Eutrofia"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <SectionTitle icon={HeartPulse} title="Hábitos de Vida" color="rose" />
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold uppercase">Tabagismo</span>
                  <span className="font-bold text-slate-700">{ficha.tabagismo}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold uppercase">Etilismo</span>
                  <span className="font-bold text-slate-700">{ficha.etilismo}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold uppercase">Estresse</span>
                  <span className="font-bold text-slate-700">{ficha.estresse}</span>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Atividade Física</p>
                  <p className="text-xs font-medium text-slate-600">{ficha.atividadeFisica || "Não pratica"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Central: Avaliação e Mapa da Dor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Anamnese e Exame Físico */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <SectionTitle icon={ClipboardList} title="Avaliação Clínica" />
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-black text-blue-600 uppercase mb-2">Queixa Principal</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium bg-blue-50/30 p-4 rounded-xl border border-blue-50">
                    {ficha.queixaPrincipal || "Nenhuma queixa registrada."}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase mb-2">História Atual (HDA)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ficha.hda || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase mb-2">Inspeção / Palpação</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ficha.inspecao || "-"}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">{ficha.palpacao || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa da Dor e Diagnóstico Funcional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <SectionTitle icon={Map} title="Mapa da Dor" color="rose" />
                <div className="aspect-[3/4] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
                  {ficha.mapaDor ? (
                    <img src={ficha.mapaDor} alt="Mapa da Dor" className="w-full h-full object-contain" />
                  ) : (
                    <p className="text-xs text-slate-400">Nenhum mapa desenhado.</p>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">EVA</p>
                    <p className="text-lg font-black text-rose-600 leading-none">{ficha.eva || 0}/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-blue-900 text-white">
                <CardContent className="p-6">
                  <SectionTitle icon={Zap} title="Diagnóstico Funcional" color="blue" />
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Conclusão Clínica</p>
                      <p className="text-sm font-bold leading-relaxed">{ficha.diagnosticoFuncionalProvavel || "Aguardando diagnóstico..."}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-blue-800">
                      <Badge className="bg-blue-600 text-white border-none">{ficha.probabilidadeClinica || "Baixa"} Probabilidade</Badge>
                      <span className="text-[10px] text-blue-300 font-medium">Baseado em clusters clínicos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <SectionTitle icon={Target} title="Objetivos e Plano" color="indigo" />
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Curto Prazo</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{ficha.estrategiasCurto || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Longo Prazo</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{ficha.estrategiasLongo || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Prescrições e Exercícios */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <SectionTitle icon={Dumbbell} title="Prescrição de Exercícios" color="emerald" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prescricoes.length > 0 ? (
                  prescricoes.map((p, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-700">{p.descricao}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">{p.frequencia}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 col-span-2 py-4 text-center">Nenhum exercício prescrito.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ADM e Força Tabela */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <SectionTitle icon={Scale} title="Amplitude de Movimento e Força" color="amber" />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-[10px] font-black text-slate-400 uppercase">Movimento</th>
                      <th className="py-3 text-[10px] font-black text-slate-400 uppercase text-center">Dir.</th>
                      <th className="py-3 text-[10px] font-black text-slate-400 uppercase text-center">Esq.</th>
                      <th className="py-3 text-[10px] font-black text-slate-400 uppercase text-center">Força (MRC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admForca.map((item, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 text-xs font-bold text-slate-700">{item.movimento}</td>
                        <td className="py-3 text-xs font-mono text-center text-blue-600">{item.admDireita}°</td>
                        <td className="py-3 text-xs font-mono text-center text-blue-600">{item.admEsquerda}°</td>
                        <td className="py-3 text-xs font-bold text-center text-amber-600">{item.forcaD || item.forcaE || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
