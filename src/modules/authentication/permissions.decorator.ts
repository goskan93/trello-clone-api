import { PERMISSIONS } from './permissions';

import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequiredPermissions = (...permissions: PERMISSIONS[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
