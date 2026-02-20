import { z } from "zod";

export const ActionStatusSchema = z.enum(["open", "in_progress", "done"]);
export type ActionStatus = z.infer<typeof ActionStatusSchema>;

export const SetActionsStatusInputSchema = z.object({
  actionIds: z.array(z.string().uuid()).min(1, "Selecione pelo menos 1 ação."),
  status: ActionStatusSchema,
});

export const CreateActionInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Título é obrigatório.")
    .max(120, "Título muito longo (máx. 120)."),
  type: z
    .string()
    .trim()
    .max(50, "Type muito longo (máx. 50).")
    .optional()
    .nullable(),
  memberId: z.string().uuid().optional().nullable(),
  // aceita "yyyy-mm-dd" ou ISO; vamos normalizar no server action
  dueAt: z.string().trim().optional().nullable(),
});