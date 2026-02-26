import { useFichas } from "@/hooks/use-fichas";
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
  Activity,
  TrendingUp,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: fichas, isLoading } = useFichas();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <div className="col-span-4 h-96 bg-slate-200 rounded-xl animate-pulse" />
          <div className="col-span-3 h-96 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bem-vindo, Dr. Daniel</h1>
          <p className="text-slate-500 text-sm font-medium">Aqui está o resumo da sua clínica para hoje.</p>
        </div>
        <Link href="/fichas/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-6">
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Pacientes Ativos", value: totalPatients, icon: Users, color: "blue", label: "Total únicos" },
          { title: "Avaliações", value: totalEvaluations, icon: FileText, color: "emerald", label: "Registros totais" },
          { title: "Este Mês", value: thisMonthEvaluations, icon: Calendar, color: "amber", label: "Novas avaliações" },
          { title: "Performance", value: "94%", icon: TrendingUp, color: "indigo", label: "Taxa de retorno" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="ghost" className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {stat.label}
                </Badge>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm font-bold uppercase text-slate-500 tracking-wider">Atividade Recente</CardTitle>
            </div>
            <Link href="/fichas">
              <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold hover:bg-blue-50">Ver Tudo</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar pacientes recentes..."
                className="pl-10 bg-slate-50 border-slate-100 focus:bg-white transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {recentFichas.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-10" />
                  <p className="text-sm">Nenhuma avaliação recente encontrada.</p>
                </div>
              ) : (
                recentFichas.map((ficha) => (
                  <div 
                    key={ficha.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-white hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                        {ficha.nomePaciente?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{ficha.nomePaciente}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                          {format(new Date(ficha.createdAt), "dd 'de' MMMM", { locale: ptBR })} • {ficha.diagnosticoClinico || "Sem diagnóstico"}
                        </p>
                      </div>
                    </div>
                    <Link href={`/fichas/${ficha.id}`}>
                      <Button variant="ghost" size="icon" className="text-slate-300 group-hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Insights */}
        <div className="col-span-3 space-y-6">
          <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80">Ação Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold leading-tight">Pronto para uma nova avaliação?</h3>
              <p className="text-blue-100 text-sm leading-relaxed">Inicie agora o preenchimento do prontuário eletrônico e diagnóstico funcional.</p>
              <Link href="/fichas/new">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-xl shadow-black/10">
                  Começar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-slate-50 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <CardTitle className="text-sm font-bold uppercase text-slate-500 tracking-wider">Status do Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Banco de Dados</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Servidor de Arquivos</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
