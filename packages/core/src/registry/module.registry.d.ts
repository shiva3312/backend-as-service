import { IModuleDescriptor } from '../interfaces';
export declare class ModuleRegistry {
    private readonly modules;
    registerModule(descriptor: IModuleDescriptor): void;
    getModule(id: string): IModuleDescriptor | undefined;
    getAllModules(): IModuleDescriptor[];
}
