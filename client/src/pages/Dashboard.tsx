import { useFichas } from "@/hooks/use-fichas";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Users, 
  FileText, 
  Calendar, 
  Plus, 
  Search, 
  ArrowRight,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: fichas, isLoading } = useFichas();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return <div className="p-8 text-center">Carregando painel...</div>;
  }

  const filteredFichas = fichas?.filter(f => 
    f.nomePaciente?.toLowerCase().includes(search.toLowerCase()) ||
    f.cpf?.includes(search)
  ) || [];

  const recentFichas = [...filteredFichas]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const totalPatients = new Set(fichas?.map(f => f.nomePaciente)).size;
  const totalEvaluations = fichas?.length || 0;
  const thisMonthEvaluations = fichas?.filter(f => {
    const date = new Date(f.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Painel" 
        description="Visão geral das suas avaliações de pacientes e atividades recentes."
      >
        <Link href="/fichas/new">
          <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30">
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Pacientes"
          value={totalPatients}
          icon={Users}
          description="Pacientes únicos avaliados"
        />
        <StatCard
          title="Total de Avaliações"
          value={totalEvaluations}
          icon={FileText}
          description="Registros totais"
        />
        <StatCard
          title="Este Mês"
          value={thisMonthEvaluations}
          icon={Calendar}
          description="Avaliações no mês atual"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Relatórios Pendentes"
          value="0"
          icon={Activity}
          description="Relatórios aguardando revisão"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Avaliações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pacientes..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredFichas.length === 0 ? (
              <EmptyState 
                icon={FileText}
                title="Nenhuma avaliação encontrada"
                description={search ? "Tente um termo de busca diferente" : "Crie sua primeira avaliação de paciente para começar."}
                action={!search && (
                  <Link href="/fichas/new">
                    <Button variant="outline">Criar Avaliação</Button>
                  </Link>
                )}
                className="border-none bg-transparent"
              />
            ) : (
              <div className="space-y-4">
                {recentFichas.map((ficha) => (
                  <div 
                    key={ficha.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {ficha.nomePaciente?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{ficha.nomePaciente}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(ficha.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })} • {ficha.diagnosticoClinico || "Sem diagnóstico"}
                        </p>
                      </div>
                    </div>
                    <Link href={`/fichas/${ficha.id}`}>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Tips */}
        <Card className="col-span-3 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/fichas/new">
              <div className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h4 className="font-medium">Nova Avaliação</h4>
                </div>
                <p className="text-sm text-muted-foreground">Inicie uma avaliação física completa para um paciente novo ou existente.</p>
              </div>
            </Link>

            <div className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-medium">Gerar Relatórios</h4>
              </div>
              <p className="text-sm text-muted-foreground">Crie relatórios em PDF a partir das avaliações existentes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
