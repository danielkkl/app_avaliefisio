import { useFicha, useDeleteFicha } from "@/hooks/use-fichas";
import { useRoute, Link, useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
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
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-mono">{value ?? "-"}</p>
    </div>
  );
}

function TextRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
        {label}
      </p>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {value || "Nenhuma informação registrada."}
      </p>
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
    return <div className="flex justify-center p-12">Carregando...</div>;
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
    const titulo = document.title;
    document.title = `Ficha - ${ficha.nomePaciente || "Paciente"}`;
    window.print();
    document.title = titulo;
  };

  const musculos: Array<{ musculo: string; grau: string }> = Array.isArray(
    ficha.musculos
  )
    ? (ficha.musculos as any[])
    : [];

  const prescricoes: Array<{ descricao: string; frequencia: string }> =
    Array.isArray(ficha.prescricoes) ? (ficha.prescricoes as any[]) : [];

  const admForca: Array<{ movimento: string; admDireita: string; admEsquerda: string; forcaD: string; forcaE: string; deficit: string; cif: string }> =
    Array.isArray(ficha.admForca) ? (ficha.admForca as any[]) : [];

  const evolucoes: Array<{ data: string; fisioterapeuta: string; descricao: string; resposta: string; ajuste: string }> =
    Array.isArray(ficha.evolucoes) ? (ficha.evolucoes as any[]) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        className="pl-0 hover:pl-2 transition-all"
        onClick={() => setLocation("/fichas")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Avaliações
      </Button>

      <PageHeader
        title={ficha.nomePaciente || "Avaliação do Paciente"}
        description={`Avaliado em ${format(
          new Date(ficha.createdAt),
          "d ' de ' MMMM, yyyy",
          { locale: ptBR }
        )}`}
      >
        <div className="flex gap-2 flex-wrap">
          <Button type="button" variant="outline" onClick={gerarPDF}>
            <Printer className="w-4 h-4 mr-2" />
            Gerar PDF
          </Button>
          <Link href={`/fichas/${id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação excluirá permanentemente este registro de avaliação.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Sidebar: Informações do Paciente ─────────────────────────── */}
        <Card className="col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Identificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <InfoRow label="Idade" value={ficha.idadeAtual ? `${ficha.idadeAtual} anos` : null} />
            <InfoRow label="Data de Nascimento" value={ficha.dataNascimento} />
            <InfoRow label="Sexo" value={ficha.sexo} />
            <InfoRow label="Perfil Étnico" value={ficha.perfilEtnico} />
            <InfoRow label="Estado Civil" value={ficha.estadoCivil} />
            <InfoRow label="Profissão" value={ficha.profissao} />
            <InfoRow label="CPF" value={ficha.cpf} />
            <InfoRow label="Telefone" value={ficha.telefone} />
            <InfoRow label="Email" value={ficha.email} />
            <InfoRow label="Plano de Saúde" value={ficha.planoSaude} />
            <InfoRow label="Data da Avaliação" value={ficha.dataAvaliacao} />
            <InfoRow label="Data da Consulta" value={ficha.dataConsulta} />
            <InfoRow label="Médico Responsável" value={ficha.nomeMedico} />
            <InfoRow label="Fisioterapeuta" value={ficha.consultor} />

            <div className="pt-4 space-y-4 border-t">
              {[
                { key: "alimentacao", label: "Alimentação" },
                { key: "sono", label: "Sono" },
                { key: "ingestaoHidrica", label: "Ingestão Hídrica" },
                { key: "rotinaDiaria", label: "Rotina Diária" },
                { key: "atividadeFisica", label: "Atividade Física" },
                { key: "medicamentos", label: "Medicamentos" },
                { key: "tabagismo", label: "Tabagismo" },
                { key: "etilismo", label: "Etilismo" },
                { key: "estresse", label: "Estresse" },
                { key: "trabalhoRepetitivo", label: "Trabalho Repetitivo" },
                { key: "historicoEsportivo", label: "Histórico Esportivo" },
              ].map((item) => {
                const value = (ficha as any)[item.key];
                if (!value) return null;

                return (
                  <div key={item.key}>
                    <p className="text-xs font-bold text-primary uppercase mb-1">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {/* Diagnóstico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Diagnóstico Clínico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {ficha.diagnosticoClinico || "-"}
              </p>
            </CardContent>
          </Card>

          {/* Sinais Vitais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Sinais Vitais &amp; Antropometria
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <InfoRow label="Pressão Arterial" value={ficha.pa} />
              <InfoRow label="FC" value={ficha.fc ? `${ficha.fc} bpm` : null} />
              <InfoRow label="FR" value={ficha.fr ? `${ficha.fr} rpm` : null} />
              <InfoRow label="SatO2" value={ficha.satO2} />
              <InfoRow label="Temperatura" value={ficha.temperatura} />
              <InfoRow label="Peso" value={ficha.peso ? `${ficha.peso} kg` : null} />
              <InfoRow label="Altura" value={ficha.altura ? `${ficha.altura} m` : null} />
              <InfoRow label="IMC" value={ficha.imc} />
              <InfoRow label="Classificação IMC" value={ficha.classificacaoIMC} />
              <InfoRow label="FC Máx" value={ficha.fcMax ? `${ficha.fcMax} bpm` : null} />
              <InfoRow label="Zona de Treino (60–80%)" value={ficha.zonaTreino} />
              <InfoRow label="FR Máx" value={ficha.frMax ? `${ficha.frMax} rpm` : null} />
            </CardContent>
          </Card>

          {/* Anamnese */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Anamnese
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <TextRow label="HDA – História da Doença Atual" value={ficha.hda} />
              <div className="border-t pt-4">
                <TextRow label="HDP – História Patológica Pregressa" value={ficha.hdp} />
              </div>
              <div className="border-t pt-4">
                <InfoRow label="Início da Dor" value={ficha.inicioDor} />
              </div>
              <div className="border-t pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                  EVA – Avaliação da Dor
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${ficha.eva && ficha.eva > 7
                        ? "bg-red-500"
                        : ficha.eva && ficha.eva > 4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        }`}
                      style={{ width: `${(ficha.eva || 0) * 10}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{ficha.eva || 0}/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ADM / Força Muscular — CLASSIFICAÇÃO CIF */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                ADM / Força Muscular — CIF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted/50 uppercase font-bold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 border-b border-r">Movimento</th>
                      <th className="px-4 py-3 border-b border-r text-center">ADM D</th>
                      <th className="px-4 py-3 border-b border-r text-center">ADM E</th>
                      <th className="px-4 py-3 border-b border-r text-center">Força D</th>
                      <th className="px-4 py-3 border-b border-r text-center">Força E</th>
                      <th className="px-4 py-3 border-b border-r text-center">Déficit %</th>
                      <th className="px-4 py-3 border-b text-center">Classificação CIF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admForca.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/5 transition-colors">
                        <td className="px-4 py-3 border-b border-r font-bold">{row.movimento}</td>
                        <td className="px-4 py-3 border-b border-r text-center">{row.admDireita}</td>
                        <td className="px-4 py-3 border-b border-r text-center">{row.admEsquerda}</td>
                        <td className="px-4 py-3 border-b border-r text-center font-mono">{row.forcaD}</td>
                        <td className="px-4 py-3 border-b border-r text-center font-mono">{row.forcaE}</td>
                        <td className="px-4 py-3 border-b border-r text-center font-bold text-primary">{row.deficit}%</td>
                        <td className="px-4 py-3 border-b text-center">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase">{row.cif}</Badge>
                        </td>
                      </tr>
                    ))}
                    {admForca.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground uppercase font-bold text-[10px]">
                          Nenhum dado de ADM/Força registrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Testes Ortopédicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Testes Ortopédicos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-sm">
              <InfoRow label="Teste de Lachman" value={ficha.testeLachman} />
              <InfoRow label="Fim de Curso" value={ficha.testeFimDeCurso} />
              <InfoRow label="Teste de Neer" value={ficha.testeNeer} />
            </CardContent>
          </Card>

          {/* Escalas Funcionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Escalas Funcionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-sm">
              <InfoRow label="Escala de Berg (0-56)" value={ficha.escalaBerg} />
              <InfoRow label="Escala de Ashworth (0-4)" value={ficha.escalaAshworth} />
              <InfoRow label="TC6 Distância (m)" value={ficha.escalaTC6} />
            </CardContent>
          </Card>

          {/* Avaliação Física */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Avaliação Física
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <TextRow label="Inspeção / Palpação / Sensibilidade" value={ficha.inspecao} />
              <div className="border-t pt-4">
                <TextRow label="Postura Dinâmica – Marcha / Cinturas" value={ficha.posturaDinamica} />
              </div>
              <div className="border-t pt-4">
                <TextRow label="Perimetria" value={ficha.perimetria} />
              </div>
              <div className="border-t pt-4">
                <TextRow label="Testes Especiais" value={ficha.testesEspeciais} />
              </div>
            </CardContent>
          </Card>

          {/* Mapa da Dor */}
          {ficha.mapaDor && (
            <Card>
              <CardHeader>
                <CardTitle>Mapa da Dor</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={ficha.mapaDor}
                  alt="Mapa da Dor"
                  className="max-w-full border rounded"
                />
              </CardContent>
            </Card>
          )}

          {/* Prescrições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Prescrições & Condutas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {prescricoes.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold uppercase tracking-tight">{p.descricao || "-"}</p>
                    </div>
                    <Badge variant="secondary" className="w-fit text-[10px] font-bold uppercase px-3">
                      {p.frequencia || "-"}
                    </Badge>
                  </div>
                ))}
                {prescricoes.length === 0 && (
                  <p className="text-center text-muted-foreground text-xs uppercase font-bold py-6">Nenhuma prescrição registrada.</p>
                )}
              </div>

              {(ficha.prescricoesProgressao || ficha.prescricoesObservacao) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6 mt-6">
                  <div className="p-4 bg-muted/10 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold uppercase text-primary">Progressão do Tratamento</p>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">{ficha.prescricoesProgressao || "-"}</p>
                  </div>
                  <div className="p-4 bg-muted/10 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold uppercase text-primary">Observações Adicionais</p>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">{ficha.prescricoesObservacao || "-"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evoluções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Histórico de Evolução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {evolucoes.map((ev, i) => (
                <div key={i} className="p-6 border rounded-xl bg-muted/5 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-1 w-full bg-primary/20 group-hover:bg-primary transition-all" />
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary/50">
                    <span>SE- {ev.data}</span>
                    <span>{ev.fisioterapeuta}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">Descrição do Atendimento</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{ev.descricao}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase mb-1">Resposta</p>
                        <p className="text-[11px] text-muted-foreground italic">{ev.resposta}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase mb-1">Ajuste de Conduta</p>
                        <p className="text-[11px] text-muted-foreground italic">{ev.ajuste}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {evolucoes.length === 0 && (
                <p className="text-center text-muted-foreground text-xs uppercase font-bold py-6">Nenhuma evolução registrada.</p>
              )}
            </CardContent>
          </Card>

          {/* Estratégias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Plano de Tratamento – Estratégias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-primary uppercase mb-2">
                    Curto Prazo
                  </p>
                  <p className="text-muted-foreground">
                    {ficha.estrategiasCurto || "-"}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-primary uppercase mb-2">
                    Médio Prazo
                  </p>
                  <p className="text-muted-foreground">
                    {ficha.estrategiasMedio || "-"}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-primary uppercase mb-2">
                    Longo Prazo
                  </p>
                  <p className="text-muted-foreground">
                    {ficha.estrategiasLongo || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interpretação Automática */}
          {ficha.interpretacaoAutomatica && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Interpretação Automática
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {ficha.interpretacaoAutomatica}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Termo de Consentimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Termo de Consentimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[11px] uppercase font-bold">
              <div className="flex items-center gap-2">
                <Badge className="h-5 px-1.5">{ficha.termoConsentimentoFoto ? "X" : " "}</Badge>
                <span>Consentimento Fotográfico</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-5 px-1.5">{ficha.termoConsentimentoFaltas ? "X" : " "}</Badge>
                <span>Política de Faltas (24h)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="h-5 px-1.5">{ficha.termoConsentimentoReposicao ? "X" : " "}</Badge>
                <span>Política de Reposição</span>
              </div>
              <div className="pt-2 text-muted-foreground">
                Data de Assinatura: {ficha.dataAssinaturaTermo || "-"}
              </div>
            </CardContent>
          </Card>

          {/* Assinaturas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-primary" />
                Assinaturas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 text-center">
                  <div className="h-24 flex items-center justify-center bg-white border rounded-xl overflow-hidden p-2 group relative">
                    {ficha.assinaturaPaciente ? (
                      <img src={ficha.assinaturaPaciente} alt="Assinatura Paciente" className="max-h-full object-contain" />
                    ) : (
                      <div className="w-32 border-b border-primary/20" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-primary">Assinatura do Paciente</p>
                    <p className="text-[9px] text-muted-foreground italic">{ficha.nomePaciente}</p>
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <div className="h-24 flex items-center justify-center bg-white border rounded-xl overflow-hidden p-2 group relative">
                    {ficha.assinaturaFisioterapeuta ? (
                      <img src={ficha.assinaturaFisioterapeuta} alt="Assinatura Profissional" className="max-h-full object-contain" />
                    ) : (
                      <div className="w-32 border-b border-primary/20" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-primary">Assinatura do Profissional</p>
                    <p className="text-[9px] text-muted-foreground italic">Dr. Daniel Barcellos — CREFITO 10 389091-F</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
