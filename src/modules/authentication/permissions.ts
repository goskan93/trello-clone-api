export enum PERMISSIONS {
  CARD_CREATE = 'card_create',
  CARD_DELETE = 'card_delete',
  CARD_GET = 'card_get',
  TASK_CREATE = 'task_create',
  TASK_DELETE = 'task_delete',
  TASK_GET = 'task_get',
  TASK_MOVE = 'task_move',
}

export const userPermissions = [
  ...Object.values(PERMISSIONS).filter((v) => isNaN(Number(v))),
];
