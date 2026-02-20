"use server";

import {
  setActionsStatusAction as _setActionsStatusAction,
  listMembersForActionsAction as _listMembersForActionsAction,
  createActionAction as _createActionAction,
  updateActionAction as _updateActionAction,
  softDeleteActionAction as _softDeleteActionAction,
  listActionTypesAction as _listActionTypesAction,
} from "../actions";

import type { ActionStatus } from "@/lib/validators/actions";

export async function setActionsStatusAction(input: { actionIds: string[]; status: ActionStatus }) {
  return _setActionsStatusAction(input);
}

export async function listMembersForActionsAction() {
  return _listMembersForActionsAction();
}

export async function listActionTypesAction() {
  return _listActionTypesAction();
}

export async function createActionAction(input: {
  title: string;
  type?: string | null;
  memberId?: string | null;
  dueAt?: string | null;
}) {
  return _createActionAction(input);
}

export async function updateActionAction(input: {
  id: string;
  title: string;
  type?: string | null;
  memberId?: string | null;
  dueAt?: string | null;
}) {
  return _updateActionAction(input);
}

/** ✅ usado no botão Excluir */
export async function softDeleteActionAction(input: { id: string }) {
  return _softDeleteActionAction(input);
}