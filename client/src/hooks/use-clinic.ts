import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { z } from "zod";

type ClinicConfigSaveInput = z.infer<typeof api.clinic.save.input>;

export function useClinicConfig() {
  return useQuery({
    queryKey: [api.clinic.config.path],
    queryFn: async () => {
      const res = await fetch(api.clinic.config.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load clinic configuration");
      return api.clinic.config.responses[200].parse(await res.json());
    }
  });
}

export function useSaveClinic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ClinicConfigSaveInput) => {
      const res = await fetch(api.clinic.save.path, {
        method: api.clinic.save.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save configuration");
      return api.clinic.save.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Update the cached clinic config
      queryClient.setQueryData([api.clinic.config.path], { clinic_type: data.config.clinic_type, config: data.config });
      toast({ title: "Saved", description: "Configuration saved successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save configuration.", variant: "destructive" });
    }
  });
}

export function useClinicRender() {
  return useQuery({
    queryKey: [api.clinic.render.path],
    queryFn: async () => {
      const res = await fetch(api.clinic.render.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load clinic render data");
      return api.clinic.render.responses[200].parse(await res.json());
    }
  });
}
