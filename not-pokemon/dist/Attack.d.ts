export declare class Attack {
    id?: number;
    name: string;
    damage: number;
    usageLimit: number;
    currentUsage: number;
    constructor(name: string, damage: number, usageLimit: number, id?: number);
    canBeUsed(): boolean;
    use(): void;
    resetUsage(): void;
    getInfo(): string;
}
//# sourceMappingURL=Attack.d.ts.map