import { z } from "zod";

export const MemberStatusSchema = z.enum(["active", "inactive"]);
export type MemberStatus = z.infer<typeof MemberStatusSchema>;

export const MemberNameSchema = z
  .string()
  .trim()
  .min(2, "Nome inválido (mín. 2 caracteres).")
  .max(120, "Nome muito longo (máx. 120).");

export const MemberEmailSchema = z
  .string()
  .trim()
  .email("Email inválido.")
  .max(254, "Email muito longo.")
  .optional()
  .or(z.literal(""))
  .nullable();

export const MemberRiskSchema = z
  .preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, z.number().min(0).max(100))
  .transform((n) => Math.round(n));

export const CreateMemberSchema = z.object({
  name: MemberNameSchema,
  email: MemberEmailSchema,
  status: MemberStatusSchema.default("active"),
});

export const UpdateMemberSchema = z.object({
  name: MemberNameSchema,
  email: MemberEmailSchema,
  status: MemberStatusSchema,
  churn_risk: MemberRiskSchema,
});