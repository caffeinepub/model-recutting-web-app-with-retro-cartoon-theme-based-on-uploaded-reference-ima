import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Project {
    id: bigint;
    owner: Principal;
    name: string;
    description: string;
    recutsSettings: RecutsSettings;
}
export interface UserProfile {
    name: string;
}
export interface RecutsSettings {
    cutPlaneAngle: number;
    showReferenceModel: boolean;
    showSectionHelper: boolean;
    cutPlaneOffset: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRecutsProject(name: string, description: string, recutsSettings: RecutsSettings): Promise<bigint>;
    deleteRecutsProject(productID: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRecutsProjectById(projectId: bigint): Promise<Project>;
    getRecutsProjectsByCaller(): Promise<Array<Project>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateRecutsProject(productId: bigint, name: string, description: string, recutsSettings: RecutsSettings): Promise<void>;
}
