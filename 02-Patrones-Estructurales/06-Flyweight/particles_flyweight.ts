
/*
PROBLEMA QUE RESUELVE FLYWEIGHT:

En una aplicación de animación se necesitan crear miles de partículas
para representar efectos visuales como humo y fuego.

Si cada partícula almacena su propia textura, color y tipo, se duplica
información y se consume memoria innecesariamente.

SOLUCIÓN:

Utilizar el patrón Flyweight para compartir las características comunes
de las partículas (textura, color y tipo), mientras cada partícula
conserva sus características individuales (posición, tamaño y velocidad).

*/

// Clase que almacena las características compartidas.
class ParticleType {
    constructor(
        public id: number,
        public texture: string,
        public color: string,
        public type: string
    ) {}

    render(x: number, y: number, size: number): void {
        console.log(
            `Renderizando ${this.type} en (${x}, ${y}), tamaño: ${size}, color: ${this.color}, textura: ${this.texture}`
        );
    }
}

// Fábrica que evita crear objetos ParticleType duplicados.
class ParticleFactory {

    private static particles: Map<string, ParticleType> = new Map();
    private static nextId: number = 1;

    static getParticleType(
        texture: string,
        color: string,
        type: string
    ): ParticleType {

        const key = `${texture}-${color}-${type}`;

        if (!this.particles.has(key)) {
            this.particles.set(
                key,
                new ParticleType(++this.nextId, texture, color, type)
            );
        }

        return this.particles.get(key)!;
    }

    static getTotalTypes(): number {
        return this.particles.size;
    }
}

// Clase que representa cada partícula individual.
class Particle {

    constructor(
        private x: number,
        private y: number,
        private size: number,
        private speed: number,
        public particleType: ParticleType
    ) {}

    render(): void {
        this.particleType.render(
            this.x,
            this.y,
            this.size
        );
    }
}

// Lista que almacenará todas las partículas.
const particles: Particle[] = [];

// Crear 1000 partículas de humo.
for (let i = 0; i < 1000; i++) {

    const type = ParticleFactory.getParticleType(
        "humo.png",
        "Gris",
        "Humo"
    );

    particles.push(
        new Particle(
            Math.random() * 500,
            Math.random() * 500,
            Math.round(Math.random() * 10 + 1),
            Math.round(Math.random() * 10 + 1),
            type
        )
    );
}

// Crear 1000 partículas de fuego.
for (let i = 0; i < 1000; i++) {

    const type = ParticleFactory.getParticleType(
        "fuego.png",
        "Naranja",
        "Fuego"
    );

    particles.push(
        new Particle(
            Math.random() * 500,
            Math.random() * 500,
            Math.round(Math.random() * 50 + 1),
            Math.round(Math.random() * 50 + 1),
            type
        )
    );
}

// Mostrar resultados.
console.log("Total de partículas:", particles.length);

console.log(
    "Tipos de partículas almacenados:",
    ParticleFactory.getTotalTypes()
);

// Renderizar algunas partículas.
particles[0].render();
particles[4].render();
particles[1000].render();
particles[1990].render();

console.log(
    "¿Las partículas de humo comparten el mismo objeto?",
    particles[0].particleType === particles[1].particleType
);

console.log(
    "¿Las partículas de fuego comparten el mismo objeto?",
    particles[1000].particleType === particles[1001].particleType
);

console.log(
    "¿Humo y fuego comparten el mismo objeto?",
    particles[0].particleType === particles[1000].particleType
);