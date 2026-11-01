/*
PROBLEMA QUE RESUELVE BUILDER:
En un videojuego RPG se necesitan crear enemigos con características
diferentes: vida, daño, velocidad, arma y habilidades especiales.
Si se utiliza un constructor con muchos parámetros, crear y configurar
cada enemigo puede resultar confuso, especialmente cuando algunas
características son opcionales.

SOLUCIÓN:
Builder permite construir cada enemigo paso a paso. Se configuran solo
las características necesarias y, al llamar a build(), se obtiene
un objeto Enemy terminado.
*/

// Producto que queremos construir.
class Enemy {
    constructor(
        public name: string,
        public health: number,
        public damage: number,
        public speed: number,
        public weapon: string,
        public intelligence: number,
        public specialAbility?: string

    ) {}

    attack(): void {
        console.log(
            `${this.name} ataca con ${this.weapon} causando ${this.damage} de daño`
        );
    }

    useSpecialAbility(): void {
        if (this.specialAbility == undefined){
            console.log(
             `${this.name} no tiene habilidad especial`)
        }else{
            console.log(
             `${this.name} usa ${this.specialAbility}`
            )
        }   
    }

    showStats(): void {
        console.log({
            name: this.name,
            health: this.health,
            damage: this.damage,
            speed: this.speed,
            weapon: this.weapon,
            intelligence: this.intelligence,
            specialAbility: this.specialAbility ?? "Ninguna"
        });
    }
}

class EnemyBuilder {
    private name: string = "Enemigo";
    private health: number = 100;
    private damage: number = 10;
    private speed: number = 5;
    private weapon: string = "Puños";
    private intelligence: number = 1;
    private specialAbility?: string;

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setHealth(health: number): this {
        this.health = health;
        return this;
    }

    setDamage(damage: number): this {
        this.damage = damage;
        return this;
    }

    setSpeed(speed: number): this {
        this.speed = speed;
        return this;
    }

    setWeapon(weapon: string): this {
        this.weapon = weapon;
        return this;
    }

    setIntelligence(intelligence: number): this {
        this.intelligence = intelligence;
        return this;
    }

    setSpecialAbility(ability: string): this {
        this.specialAbility = ability;
        return this;
    }

    build(): Enemy {
        return new Enemy(
            this.name,
            this.health,
            this.damage,
            this.speed,
            this.weapon,
            this.intelligence,
            this.specialAbility
        );
    }
}

function main(){
    // Enemigo básico
const goblin = new EnemyBuilder()
    .setName("Goblin")
    .setHealth(100)
    .setDamage(15)
    .setSpeed(8)
    .setWeapon("Daga")
    .setIntelligence(3)
    .build();

// Enemigo pesado
const orc = new EnemyBuilder()
    .setName("Orco")
    .setHealth(300)
    .setDamage(40)
    .setSpeed(3)
    .setWeapon("Hacha")
    .setIntelligence(5)
    .build();

// Jefe final con habilidad especial
const dragon = new EnemyBuilder()
    .setName("Dragon")
    .setHealth(1000)
    .setDamage(100)
    .setWeapon("Fuego")
    .setSpecialAbility("Aliento de fuego")
    .build();

// Enemigo rápido
const assassin = new EnemyBuilder()
    .setName("Asesino")
    .setHealth(80)
    .setDamage(50)
    .setSpeed(15)
    .setWeapon("Dagas dobles")
    .setIntelligence(8)
    .build();

const darkMage = new EnemyBuilder()
    .setName("Mago oscuro")
    .setHealth(150)
    .setDamage(60)
    .setSpeed(4)
    .setWeapon("Bastón mágico")
    .setSpecialAbility("Bola de fuego")
    .build();    

goblin.showStats();
orc.showStats();
dragon.showStats();
assassin.showStats();

dragon.attack();
dragon.useSpecialAbility();
orc.attack();
orc.useSpecialAbility();
darkMage.useSpecialAbility();
goblin.attack();

}

main();