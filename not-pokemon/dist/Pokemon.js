"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
class Pokemon {
    constructor(name, lifePoints, trainerId, id) {
        this.id = id;
        this.name = name;
        this.lifePoints = lifePoints;
        this.maxLifePoints = lifePoints;
        this.attacks = [];
        this.trainerId = trainerId;
    }
    learnAttack(attack) {
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
    heal() {
        this.lifePoints = this.maxLifePoints;
        this.attacks.forEach(attack => attack.resetUsage());
        console.log(`${this.name} a été soigné!`);
    }
    isDead() {
        return this.lifePoints <= 0;
    }
    takeDamage(damage) {
        this.lifePoints = Math.max(0, this.lifePoints - damage);
        console.log(`${this.name} a reçu ${damage} dégâts! PV restants: ${this.lifePoints}`);
    }
    attackPokemon(target) {
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
    getAvailableAttacks() {
        return this.attacks.filter(attack => attack.canBeUsed());
    }
}
exports.Pokemon = Pokemon;
//# sourceMappingURL=Pokemon.js.map