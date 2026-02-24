import { Button } from "@/components/ui/button";
import { Activity, Check, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Panel - Brand & Value */}
      <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">Beyond Avaliação</span>
          </div>

          <h1 className="font-display font-bold text-4xl lg:text-6xl leading-tight mb-6">
            Sistema Avançado de Avaliação Fisioterapêutica
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
            Otimize suas avaliações de pacientes, acompanhe o progresso com precisão e gere relatórios profissionais em minutos.
          </p>
          
          <div className="space-y-4">
            {[
              "Avaliação Corporal Completa",
              "Geração Automática de Relatórios",
              "Acompanhamento do Progresso do Paciente",
              "Armazenamento Seguro na Nuvem"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 text-sm text-slate-400">
          © {new Date().getFullYear()} Beyond Avaliação. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Auth Action */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo ao Beyond Avaliação</h2>
            <p className="text-muted-foreground">Faça login ou registre-se para continuar</p>
          </div>

          <div className="pt-4">
            <Button 
              size="lg" 
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              onClick={() => window.location.href = "/login"}
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
