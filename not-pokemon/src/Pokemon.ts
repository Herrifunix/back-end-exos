import { Attack } from './Attack';

export class Pokemon {
  public id?: number;
  public name: string;
  public lifePoints: number;
  public maxLifePoints: number;
  public attacks: Attack[];
  public trainerId?: number;

  constructor(name: string, lifePoints: number, trainerId?: number, id?: number) {
    this.id = id;
    this.name = name;
    this.lifePoints = lifePoints;
    this.maxLifePoints = lifePoints;
    this.attacks = [];
    this.trainerId = trainerId;
  }

  learnAttack(attack: Attack): boolean {
    if (this.attacks.length >= 4) {
      console.log(`${this.name} connaît déjà 4 attaques!`);
      return false;
    }

    if (this.attacks.some(a => a.name === attack.name)) {
      console.log(`${this.name} connaît déjà l'attaque ${attack.name}!`);
      return false;
    }

    this.attacks.push(attack);
    console.log(`${this.name} a appris ${attack.name}!`);
    return true;
  }

  heal(): void {
    this.lifePoints = this.maxLifePoints;
    this.attacks.forEach(attack => attack.resetUsage());
    console.log(`${this.name} a été soigné!`);
  }

  isDead(): boolean {
    return this.lifePoints <= 0;
  }

  takeDamage(damage: number): void {
    this.lifePoints = Math.max(0, this.lifePoints - damage);
    console.log(`${this.name} a reçu ${damage} dégâts! PV restants: ${this.lifePoints}`);
  }

  attackPokemon(target: Pokemon): boolean {
    const availableAttacks = this.attacks.filter(attack => attack.canBeUsed());
    
    if (availableAttacks.length === 0) {
      console.log(`${this.name} n'a plus d'attaques disponibles!`);
      return false;
    }

    const randomAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
    randomAttack.use();
    
    console.log(`${this.name} utilise ${randomAttack.name}!`);
    target.takeDamage(randomAttack.damage);
    
    return true;
  }

  getAvailableAttacks(): Attack[] {
    return this.attacks.filter(attack => attack.canBeUsed());
  }
}