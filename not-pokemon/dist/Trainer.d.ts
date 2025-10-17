import { Pokemon } from './Pokemon';
export declare class Trainer {
    id?: number;
    name: string;
    level: number;
    experience: number;
    pokemons: Pokemon[];
    constructor(name: string, level?: number, experience?: number, id?: number);
    addPokemon(pokemon: Pokemon): void;
    healAllPokemons(): void;
    gainExperience(points: number): void;
    getRandomPokemon(): Pokemon | null;
    getStrongestPokemon(): Pokemon | null;
    hasAlivePokemon(): boolean;
    static randomChallenge(trainer1: Trainer, trainer2: Trainer): Trainer;
    static arena1(trainer1: Trainer, trainer2: Trainer): Trainer;
    static deterministicChallenge(trainer1: Trainer, trainer2: Trainer): Trainer;
    static arena2(trainer1: Trainer, trainer2: Trainer): Trainer;
}
//# sourceMappingURL=Trainer.d.ts.map