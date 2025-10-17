import { Pokemon } from './Pokemon';

export class Trainer {
  public id?: number;
  public name: string;
  public level: number;
  public experience: number;
  public pokemons: Pokemon[];

  constructor(name: string, level: number = 1, experience: number = 0, id?: number) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.experience = experience;
    this.pokemons = [];
  }

  addPokemon(pokemon: Pokemon): void {
    pokemon.trainerId = this.id;
    this.pokemons.push(pokemon);
    console.log(`${this.name} a ajouté ${pokemon.name} à son équipe!`);
  }

  healAllPokemons(): void {
    this.pokemons.forEach(pokemon => pokemon.heal());
    console.log(`${this.name} a soigné tous ses Pokémon à la taverne!`);
  }

  gainExperience(points: number): void {
    this.experience += points;
    const newLevel = Math.floor(this.experience / 10) + 1;
    
    if (newLevel > this.level) {
      const levelsGained = newLevel - this.level;
      this.level = newLevel;
      console.log(`${this.name} a gagné ${levelsGained} niveau(x)! Niveau actuel: ${this.level}`);
    }
  }

  getRandomPokemon(): Pokemon | null {
    const alivePokemon = this.pokemons.filter(p => !p.isDead());
    if (alivePokemon.length === 0) return null;
    
    return alivePokemon[Math.floor(Math.random() * alivePokemon.length)];
  }

  getStrongestPokemon(): Pokemon | null {
    const alivePokemon = this.pokemons.filter(p => !p.isDead());
    if (alivePokemon.length === 0) return null;
    
    return alivePokemon.reduce((strongest, current) => 
      current.lifePoints > strongest.lifePoints ? current : strongest
    );
  }

  hasAlivePokemon(): boolean {
    return this.pokemons.some(p => !p.isDead());
  }

  
  static randomChallenge(trainer1: Trainer, trainer2: Trainer): Trainer {
    console.log(`\n🔥 Défi aléatoire entre ${trainer1.name} et ${trainer2.name}!`);
    
    
    trainer1.healAllPokemons();
    trainer2.healAllPokemons();
    
    const pokemon1 = trainer1.getRandomPokemon();
    const pokemon2 = trainer2.getRandomPokemon();
    
    if (!pokemon1 || !pokemon2) {
      throw new Error('Les dresseurs doivent avoir au moins un Pokémon!');
    }
    
    console.log(`${trainer1.name} envoie ${pokemon1.name}!`);
    console.log(`${trainer2.name} envoie ${pokemon2.name}!`);
    
    
    while (!pokemon1.isDead() && !pokemon2.isDead()) {
      
      if (!pokemon1.isDead()) {
        pokemon1.attackPokemon(pokemon2);
      }
      
      
      if (!pokemon2.isDead()) {
        pokemon2.attackPokemon(pokemon1);
      }
    }
    
    const winner = pokemon1.isDead() ? trainer2 : trainer1;
    const loser = pokemon1.isDead() ? trainer1 : trainer2;
    
    winner.gainExperience(1);
    console.log(`🏆 ${winner.name} remporte le combat!`);
    
    return winner;
  }

  
  static arena1(trainer1: Trainer, trainer2: Trainer): Trainer {
    console.log(`\n🏟️ Arène 1: 100 combats aléatoires entre ${trainer1.name} et ${trainer2.name}!`);
    
    let wins1 = 0;
    let wins2 = 0;
    
    for (let i = 0; i < 100; i++) {
      const winner = Trainer.randomChallenge(trainer1, trainer2);
      if (winner === trainer1) {
        wins1++;
      } else {
        wins2++;
      }
    }
    
    console.log(`Résultats: ${trainer1.name}: ${wins1} victoires, ${trainer2.name}: ${wins2} victoires`);
    
    
    if (trainer1.level > trainer2.level) {
      return trainer1;
    } else if (trainer2.level > trainer1.level) {
      return trainer2;
    } else {
      
      return trainer1.experience >= trainer2.experience ? trainer1 : trainer2;
    }
  }

  
  static deterministicChallenge(trainer1: Trainer, trainer2: Trainer): Trainer {
    console.log(`\n⚔️ Défi déterministe entre ${trainer1.name} et ${trainer2.name}!`);
    
    const pokemon1 = trainer1.getStrongestPokemon();
    const pokemon2 = trainer2.getStrongestPokemon();
    
    if (!pokemon1 || !pokemon2) {
      throw new Error('Les dresseurs doivent avoir au moins un Pokémon vivant!');
    }
    
    console.log(`${trainer1.name} envoie ${pokemon1.name} (${pokemon1.lifePoints} PV)!`);
    console.log(`${trainer2.name} envoie ${pokemon2.name} (${pokemon2.lifePoints} PV)!`);
    
    
    while (!pokemon1.isDead() && !pokemon2.isDead()) {
      if (!pokemon1.isDead()) {
        pokemon1.attackPokemon(pokemon2);
      }
      
      if (!pokemon2.isDead()) {
        pokemon2.attackPokemon(pokemon1);
      }
    }
    
    const winner = pokemon1.isDead() ? trainer2 : trainer1;
    winner.gainExperience(1);
    console.log(`🏆 ${winner.name} remporte le combat déterministe!`);
    
    return winner;
  }

  
  static arena2(trainer1: Trainer, trainer2: Trainer): Trainer {
    console.log(`\n🏛️ Arène 2: Combats déterministes jusqu'à élimination entre ${trainer1.name} et ${trainer2.name}!`);
    
    let combats = 0;
    
    while (trainer1.hasAlivePokemon() && trainer2.hasAlivePokemon() && combats < 100) {
      combats++;
      console.log(`\n--- Combat ${combats} ---`);
      
      try {
        Trainer.deterministicChallenge(trainer1, trainer2);
      } catch (error) {
        break;
      }
    }
    
    console.log(`Total de combats: ${combats}`);
    
    if (!trainer1.hasAlivePokemon()) {
      console.log(`🏆 ${trainer2.name} remporte l'Arène 2! Tous les Pokémon de ${trainer1.name} sont KO.`);
      return trainer2;
    } else if (!trainer2.hasAlivePokemon()) {
      console.log(`🏆 ${trainer1.name} remporte l'Arène 2! Tous les Pokémon de ${trainer2.name} sont KO.`);
      return trainer1;
    } else {
      
      if (trainer1.level > trainer2.level) {
        return trainer1;
      } else if (trainer2.level > trainer1.level) {
        return trainer2;
      } else {
        return trainer1.experience >= trainer2.experience ? trainer1 : trainer2;
      }
    }
  }
}