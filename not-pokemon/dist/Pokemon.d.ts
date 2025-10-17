import { Attack } from './Attack';
export declare class Pokemon {
    id?: number;
    name: string;
    lifePoints: number;
    maxLifePoints: number;
    attacks: Attack[];
    trainerId?: number;
    constructor(name: string, lifePoints: number, trainerId?: number, id?: number);
    learnAttack(attack: Attack): boolean;
    heal(): void;
    isDead(): boolean;
    takeDamage(damage: number): void;
    attackPokemon(target: Pokemon): boolean;
    getAvailableAttacks(): Attack[];
}
//# sourceMappingURL=Pokemon.d.ts.map