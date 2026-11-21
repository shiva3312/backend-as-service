import { Injectable } from '@nestjs/common';
import { IModuleDescriptor } from '../interfaces';

@Injectable()
export class ModuleRegistry {
  private readonly modules = new Map<string, IModuleDescriptor>();

  public registerModule(descriptor: IModuleDescriptor): void {
    if (this.modules.has(descriptor.id)) {
      throw new Error(`Module with ID '${descriptor.id}' is already registered.`);
    }
    this.modules.set(descriptor.id, descriptor);
  }

  public getModule(id: string): IModuleDescriptor | undefined {
    return this.modules.get(id);
  }

  public getAllModules(): IModuleDescriptor[] {
    return Array.from(this.modules.values());
  }
}
