import { useFichas, useDeleteFicha } from "@/hooks/use-fichas";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Link } from "wouter";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FichasList() {
  const { data: fichas, isLoading } = useFichas();
  const { mutate: deleteFicha } = useDeleteFicha();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-96 w-full bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  const filteredFichas = fichas?.filter(f => 
    f.nomePaciente?.toLowerCase().includes(search.toLowerCase()) ||
    f.cpf?.includes(search)
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Avaliações" 
        description="Gerencie seus registros e avaliações de pacientes."
      >
        <Link href="/fichas/new">
          <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30">
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </Link>
      </PageHeader>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {filteredFichas.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma avaliação encontrada"
            description={search ? "Nenhum resultado corresponde à sua busca." : "Comece criando sua primeira avaliação de paciente."}
            action={!search && (
              <Link href="/fichas/new">
                <Button variant="outline">Criar Avaliação</Button>
              </Link>
            )}
            className="border-none m-8"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Paciente</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFichas.map((ficha) => (
                <TableRow key={ficha.id}>
                  <TableCell className="font-medium">{ficha.nomePaciente}</TableCell>
                  <TableCell>{ficha.diagnosticoClinico || "-"}</TableCell>
                  <TableCell>{format(new Date(ficha.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{ficha.telefone || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/fichas/${ficha.id}`}>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/fichas/${ficha.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(ficha.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de avaliação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteId) deleteFicha(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
