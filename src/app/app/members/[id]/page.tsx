import { getTenantContext } from "@/lib/auth/tenant";
import {
  getMemberById,
  getMemberOpenActions,
  getMemberRecentCheckins,
} from "@/lib/data/member-details";
import MemberProfileClient from "./ui";

export default async function MemberProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { tenantId } = await getTenantContext();
  const memberId = params.id;

  const member = await getMemberById(tenantId, memberId);
  const checkins = await getMemberRecentCheckins(tenantId, memberId);
  const actions = await getMemberOpenActions(tenantId, memberId);

  return <MemberProfileClient member={member} checkins={checkins} actions={actions} />;
}