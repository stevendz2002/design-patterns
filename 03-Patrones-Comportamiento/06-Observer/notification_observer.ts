/*
PROBLEMA QUE RESUELVE OBSERVER:
En una tienda en línea, varios clientes quieren recibir una notificación
cuando un producto agotado vuelva a estar disponible. Sin Observer,
el sistema de inventario tendría que conocer y gestionar directamente
a todos los clientes.

SOLUCIÓN:
Observer permite que los clientes se suscriban al producto. Cuando cambia
su disponibilidad, el producto notifica automáticamente a sus suscriptores.
*/

// Interfaz que deben implementar los observadores.
interface Observer {
    update(mensaje: string): void;
}

// Cada cliente recibe las notificaciones del producto.
class Cliente implements Observer {
    constructor(public nombre: string) {}

    update(mensaje: string): void {
        console.log(`${this.nombre}: ${mensaje}`);
    }
}

// El producto es el sujeto observado (Subject).
class Producto {
    private observers: Observer[] = [];

    constructor(
        public nombre: string,
        private disponible: boolean = false
    ) {}

    suscribir(cliente: Observer): void {
        this.observers.push(cliente);
    }

    desuscribir(cliente: Observer): void {
        this.observers = this.observers.filter(
            observer => observer !== cliente
        );
    }

    private notificar(): void {
        for (const observer of this.observers) {
            observer.update(
                `${this.nombre} ya está disponible`
            );
        }
    }

    cambiarDisponibilidad(estado: boolean): void {
        if (this.disponible === estado) {
            return;
        }

        this.disponible = estado;

        if (this.disponible) {
            this.notificar();
        }
    }
}

// Crear un producto inicialmente agotado.
const producto = new Producto("PlayStation 5");

// Crear clientes interesados en recibir una notificación.
const cliente1 = new Cliente("Carlos");
const cliente2 = new Cliente("Maria");
const cliente3 = new Cliente("Andres");

// Los clientes se suscriben al producto.
producto.suscribir(cliente1);
producto.suscribir(cliente2);
producto.suscribir(cliente3);

// El producto vuelve a estar disponible y notifica a sus suscriptores.
producto.cambiarDisponibilidad(true);
