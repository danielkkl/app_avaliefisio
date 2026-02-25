import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type FichaInput, type FichaUpdateInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFichas() {
  return useQuery({
    queryKey: [api.fichas.list.path],
    queryFn: async () => {
      const res = await fetch(api.fichas.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado");
        throw new Error("Erro ao buscar avaliações");
      }
      return api.fichas.list.responses[200].parse(await res.json());
    },
  });
}

export function useFicha(id: number) {
  return useQuery({
    queryKey: [api.fichas.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.fichas.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado");
        throw new Error("Erro ao buscar avaliação");
      }
      return api.fichas.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateFicha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: FichaInput) => {
      const res = await fetch(api.fichas.create.path, {
        method: api.fichas.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || "Erro ao criar avaliação");
      }
      return api.fichas.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.fichas.list.path] });
      toast({
        title: "Sucesso",
        description: "Avaliação criada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFicha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FichaUpdateInput }) => {
      const url = buildUrl(api.fichas.update.path, { id });
      const res = await fetch(url, {
        method: api.fichas.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || "Erro ao atualizar avaliação");
      }
      return api.fichas.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.fichas.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.fichas.get.path, data.id] });
      toast({
        title: "Sucesso",
        description: "Avaliação atualizada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFicha() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.fichas.delete.path, { id });
      const res = await fetch(url, {
        method: api.fichas.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir avaliação");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.fichas.list.path] });
      toast({
        title: "Sucesso",
        description: "Avaliação excluída com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
