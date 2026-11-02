/**
*! ¿Que hace el patrón Command?

El patrón Command encapsula una solicitud como un objeto independiente,
permitiendo parametrizar operaciones, encolar o registrar solicitudes
y soportar la funcionalidad de deshacer (undo) las acciones en orden inverso.

*! ¿Qué problema se está resolviendo?

En un aula inteligente se requiere automatizar dispositivos como iluminación,
proyector y aire acondicionado desde un panel central. Sin el patrón Command,
el panel estaría fuertemente acoplado a la API específica de cada aparato
y sería muy complejo implementar un historial para revertir (deshacer) las
acciones ejecutadas.

*! ¿Por qué ese patrón es adecuado para solucionar dicho problema?

Command es adecuado porque desacopla completamente el emisor (panel de control)
de los receptores (dispositivos del aula). Cada comando concreto encapsula
la llamada a su receptor y sabe exactamente cómo revertir su efecto con `deshacer()`.
Esto permite que el panel mantenga una pila de comandos ejecutados (LIFO) y revierta
las acciones de forma limpia y ordenada.

Ventajas:
- Desacoplamiento total entre el panel emisor y los dispositivos receptores.
- Facilidad para agregar nuevos dispositivos sin modificar el panel de control.
- Soporte nativo para operaciones reversibles (deshacer / undo).
- Permite almacenar un historial de acciones ejecutadas.
 */

import { COLORS } from '../../helpers/colors.ts';

interface Comando {
  ejecutar(): void;
  deshacer(): void;
}

// Dispositivo: Luces del Aula
class LucesAula {
  encender(): void {
    console.log('%cLuces: Iluminación del aula ENCENDIDA.', COLORS.yellow);
  }

  apagar(): void {
    console.log('%cLuces: Iluminación del aula APAGADA.', COLORS.gray);
  }
}

// Dispositivo: Proyector Inteligente
class ProyectorInteligente {
  desplegar(): void {
    console.log('%cProyector: Telón desplegado y proyector ENCENDIDO.', COLORS.blue);
  }

  ocultar(): void {
    console.log('%cProyector: Proyector APAGADO y telón plegado.', COLORS.gray);
  }
}

// Dispositivo: Aire Acondicionado
class AireAcondicionado {
  encender(temperatura: number = 21): void {
    console.log(`%cAire Acondicionado: Climatización ACTIVADA a ${temperatura}°C.`, COLORS.cyan);
  }

  apagar(): void {
    console.log('%cAire Acondicionado: Climatización DESACTIVADA.', COLORS.gray);
  }
}

// Comando para encender luces
class ComandoEncenderLuces implements Comando {
  private luces: LucesAula;

  constructor(luces: LucesAula) {
    this.luces = luces;
  }

  ejecutar(): void {
    this.luces.encender();
  }

  deshacer(): void {
    this.luces.apagar();
  }
}

// Comando para apagar luces
class ComandoApagarLuces implements Comando {
  private luces: LucesAula;

  constructor(luces: LucesAula) {
    this.luces = luces;
  }

  ejecutar(): void {
    this.luces.apagar();
  }

  deshacer(): void {
    this.luces.encender();
  }
}

// Comando para desplegar proyector
class ComandoDesplegarProyector implements Comando {
  private proyector: ProyectorInteligente;

  constructor(proyector: ProyectorInteligente) {
    this.proyector = proyector;
  }

  ejecutar(): void {
    this.proyector.desplegar();
  }

  deshacer(): void {
    this.proyector.ocultar();
  }
}

// Comando para ocultar proyector
class ComandoOcultarProyector implements Comando {
  private proyector: ProyectorInteligente;

  constructor(proyector: ProyectorInteligente) {
    this.proyector = proyector;
  }

  ejecutar(): void {
    this.proyector.ocultar();
  }

  deshacer(): void {
    this.proyector.desplegar();
  }
}

// Comando para activar aire acondicionado
class ComandoEncenderAire implements Comando {
  private aire: AireAcondicionado;
  private temperatura: number;

  constructor(aire: AireAcondicionado, temperatura: number = 21) {
    this.aire = aire;
    this.temperatura = temperatura;
  }

  ejecutar(): void {
    this.aire.encender(this.temperatura);
  }

  deshacer(): void {
    this.aire.apagar();
  }
}

class PanelControlInteligente {
  private historial: Comando[] = [];

  ejecutarComando(comando: Comando): void {
    comando.ejecutar();
    this.historial.push(comando);
  }

  deshacer(): void {
    const ultimoComando = this.historial.pop();
    if (ultimoComando) {
      console.log('%c-> Deshaciendo última acción...', COLORS.orange);
      ultimoComando.deshacer();
    } else {
      console.log('%cNo hay acciones previas en el historial para deshacer.', COLORS.red);
    }
  }

  deshacerTodo(): void {
    console.log('%c\n--- Deshaciendo todas las operaciones del aula ---', COLORS.orange);
    while (this.historial.length > 0) {
      this.deshacer();
    }
  }
}

function main(): void {

  // Dispositivos
  const luces = new LucesAula();
  const proyector = new ProyectorInteligente();
  const aire = new AireAcondicionado();

  // Panel Invocador
  const panel = new PanelControlInteligente();

  console.log('%c1. Preparando el aula para clase:', COLORS.green);
  panel.ejecutarComando(new ComandoEncenderLuces(luces));
  panel.ejecutarComando(new ComandoDesplegarProyector(proyector));
  panel.ejecutarComando(new ComandoEncenderAire(aire, 20));

  console.log('%c\n2. Se cometió un error con el aire acondicionado (Deshacer):', COLORS.yellow);
  panel.deshacer();

  console.log('%c\n3. Fin de la jornada de clase (Deshacer todas las acciones):', COLORS.violet);
  panel.deshacerTodo();

}

main();
