export interface IModuleDescriptor {
    id: string;
    name: string;
    version: string;
    dependencies: string[];
    enabledByDefault: boolean;
}
export interface IFeatureAccessDecision {
    allowed: boolean;
    reason?: string;
    featureName: string;
    requiredCredits?: number;
}
