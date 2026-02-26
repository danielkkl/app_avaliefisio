import { useFichas, useDeleteFicha } from "@/hooks/use-fichas";
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
  Eye,
  User,
  Calendar,
  Activity
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
import { Badge } from "@/components/ui/badge";

export default function FichasList() {
  const { data: fichas, isLoading } = useFichas();
  const { mutate: deleteFicha } = useDeleteFicha();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="h-[500px] w-full bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  const filteredFichas = fichas?.filter(f => 
    f.nomePaciente?.toLowerCase().includes(search.toLowerCase()) ||
    f.cpf?.includes(search)
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Avaliações</h1>
          <p className="text-slate-500 text-sm">Gerencie os prontuários e avaliações físicas dos seus pacientes.</p>
        </div>
        <Link href="/fichas/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-6">
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-blue-50 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
            {filteredFichas.length} Registros
          </Badge>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paciente</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diagnóstico</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data da Avaliação</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFichas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FileText className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm font-medium">Nenhuma avaliação encontrada</p>
                    <p className="text-xs">Tente mudar os termos da busca ou crie uma nova.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredFichas.map((ficha) => (
                <TableRow key={ficha.id} className="hover:bg-blue-50/30 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                        {ficha.nomePaciente?.[0] || "P"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{ficha.nomePaciente}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">CPF: {ficha.cpf || "Não informado"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3 text-blue-400" />
                      <span className="text-sm text-slate-600 line-clamp-1">{ficha.diagnosticoClinico || "---"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {format(new Date(ficha.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 transition-colors text-[10px] font-bold uppercase">
                      Finalizado
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <Link href={`/fichas/${ficha.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2 text-blue-600" />
                            Ver Prontuário
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/fichas/${ficha.id}/edit`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2 text-slate-600" />
                            Editar Dados
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => setDeleteId(ficha.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir Registro
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">Excluir Prontuário?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Esta ação é irreversível. Todos os dados da avaliação, incluindo o mapa da dor e prescrições, serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteId) deleteFicha(deleteId);
                setDeleteId(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700 rounded-xl"
            >
              Sim, Excluir Registro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
