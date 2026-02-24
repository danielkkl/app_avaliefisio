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
  Calendar,
  ClipboardList
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
        <Button variant="link" onClick={() => setLocation("/fichas")}>Voltar para a Lista</Button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteFicha(id);
    setLocation("/fichas");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
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
        description={`Avaliado em ${format(new Date(ficha.createdAt), "d ' de ' MMMM, yyyy", { locale: ptBR })}`}
      >
        <div className="flex gap-2">
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
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Information Card */}
        <Card className="col-span-1 md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Idade</p>
              <p>{ficha.idadeAtual ? `${ficha.idadeAtual} anos` : "-"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Diagnóstico</p>
              <p>{ficha.diagnosticoClinico || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Contato</p>
              <p>{ficha.telefone || "-"}</p>
              <p className="text-sm text-muted-foreground">{ficha.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Sinais Vitais e Avaliação Física
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Pressão Arterial</p>
                <p className="font-mono">{ficha.pa || "-"}</p>
              </div>
               <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Frequência Cardíaca</p>
                <p className="font-mono">{ficha.fc ? `${ficha.fc} bpm` : "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Peso</p>
                <p className="font-mono">{ficha.peso ? `${ficha.peso} kg` : "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Altura</p>
                <p className="font-mono">{ficha.altura ? `${ficha.altura} m` : "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Histórico (Anamnese)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">HDA</p>
                <p className="text-sm leading-relaxed">{ficha.hda || "Nenhuma informação registrada."}</p>
              </div>
              <div className="pt-4 border-t">
                 <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Avaliação da Dor (EVA)</p>
                 <div className="flex items-center gap-3">
                   <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                     <div 
                        className={`h-full ${ficha.eva && ficha.eva > 7 ? 'bg-red-500' : ficha.eva && ficha.eva > 4 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${(ficha.eva || 0) * 10}%` }}
                     />
                   </div>
                   <span className="font-bold text-lg">{ficha.eva || 0}/10</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Plano de Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-primary uppercase mb-2">Curto Prazo</p>
                  <p className="text-sm text-muted-foreground">{ficha.estrategiasCurto || "-"}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-primary uppercase mb-2">Médio Prazo</p>
                  <p className="text-sm text-muted-foreground">{ficha.estrategiasMedio || "-"}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-primary uppercase mb-2">Longo Prazo</p>
                  <p className="text-sm text-muted-foreground">{ficha.estrategiasLongo || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
