import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedTenantException } from '../errors/base.exception';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const appId = request.headers['x-app-id'] || request.query.appId;

    if (!appId) {
      throw new UnauthorizedTenantException('Missing mandatory x-app-id header');
    }

    request.appId = appId;
    return true;
  }
}
