"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attack = void 0;
class Attack {
    constructor(name, damage, usageLimit, id) {
        this.id = id;
        this.name = name;
        this.damage = damage;
        this.usageLimit = usageLimit;
        this.currentUsage = 0;
    }
    canBeUsed() {
        return this.currentUsage < this.usageLimit;
    }
    use() {
        if (this.canBeUsed()) {
            this.currentUsage++;
        }
        else {
            throw new Error(`L'attaque ${this.name} ne peut plus être utilisée`);
        }
    }
    resetUsage() {
        this.currentUsage = 0;
    }
    getInfo() {
        return `${this.name} - Dégâts: ${this.damage}, Usage: ${this.currentUsage}/${this.usageLimit}`;
    }
}
exports.Attack = Attack;
//# sourceMappingURL=Attack.js.map