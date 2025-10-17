export class Attack {
  public id?: number;
  public name: string;
  public damage: number;
  public usageLimit: number;
  public currentUsage: number;

  constructor(name: string, damage: number, usageLimit: number, id?: number) {
    this.id = id;
    this.name = name;
    this.damage = damage;
    this.usageLimit = usageLimit;
    this.currentUsage = 0;
  }

  canBeUsed(): boolean {
    return this.currentUsage < this.usageLimit;
  }

  use(): void {
    if (this.canBeUsed()) {
      this.currentUsage++;
    } else {
      throw new Error(`L'attaque ${this.name} ne peut plus être utilisée`);
    }
  }

  resetUsage(): void {
    this.currentUsage = 0;
  }

  getInfo(): string {
    return `${this.name} - Dégâts: ${this.damage}, Usage: ${this.currentUsage}/${this.usageLimit}`;
  }
}