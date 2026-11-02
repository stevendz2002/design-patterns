/**
*! ¿Que hace el patrón State?

El patrón State permite a un objeto alterar su comportamiento cuando su
estado interno cambia. Para el cliente, el objeto parece haber cambiado de clase.

*! ¿Qué problema se está resolviendo?

En la gestión de órdenes de compra, las acciones permitidas (pagar, enviar,
entregar, cancelar) dependen estrictamente del estado actual del pedido.
Sin el patrón State, la clase de la orden estaría saturada de condicionales
if/else o switch para comprobar el estado antes de cada acción, haciendo el
código rígido, difícil de mantener y propenso a errores al agregar nuevos estados.

*! ¿Por qué ese patrón es adecuado para solucionar dicho problema?

State es adecuado porque distribuye la lógica y las transiciones de cada estado
en clases separadas que implementan una interfaz común. La orden delega el
comportamiento en su estado actual, asegurando que solo se ejecuten operaciones
válidas y facilitando la adición de nuevos estados sin modificar el contexto.

Ventajas:
- Elimina bloques condicionales masivos (if/switch) dentro del contexto.
- Aplica el principio de Responsabilidad Única (SRP): cada clase gestiona un estado.
- Aplica el principio Abierto/Cerrado (OCP): agregar nuevos estados no altera el código existente.
- Protege las reglas de negocio al bloquear transiciones inválidas.
 */

import { COLORS } from '../../helpers/colors.ts';


interface EstadoOrden {
  nombre: string;

  pagar(orden: ContextoOrden): void;
  enviar(orden: ContextoOrden): void;
  entregar(orden: ContextoOrden): void;
  cancelar(orden: ContextoOrden): void;
}


class ContextoOrden {
  public id: string;
  public total: number;
  private estado: EstadoOrden;

  constructor(id: string, total: number) {
    this.id = id;
    this.total = total;
    // Toda orden inicia en estado Pendiente
    this.estado = new EstadoPendiente();
    console.log(`%cOrden #${this.id} creada por $${this.total.toLocaleString('es-CO')} COP. Estado inicial: [${this.estado.nombre}]`, COLORS.blue);
  }

  setEstado(nuevoEstado: EstadoOrden): void {
    console.log(`  %c-> Transición de estado: [${this.estado.nombre}] => [${nuevoEstado.nombre}]`, COLORS.cyan);
    this.estado = nuevoEstado;
  }

  obtenerEstado(): string {
    return this.estado.nombre;
  }

  pagar(): void {
    console.log(`\n%cSolicitud: Pagar orden #${this.id}`, COLORS.white);
    this.estado.pagar(this);
  }

  enviar(): void {
    console.log(`\n%cSolicitud: Enviar orden #${this.id}`, COLORS.white);
    this.estado.enviar(this);
  }

  entregar(): void {
    console.log(`\n%cSolicitud: Entregar orden #${this.id}`, COLORS.white);
    this.estado.entregar(this);
  }

  cancelar(): void {
    console.log(`\n%cSolicitud: Cancelar orden #${this.id}`, COLORS.white);
    this.estado.cancelar(this);
  }
}

// Estado 1: Pendiente de pago
class EstadoPendiente implements EstadoOrden {
  nombre: string = 'PENDIENTE';

  pagar(orden: ContextoOrden): void {
    console.log('  %cPago aprobado exitosamente.', COLORS.green);
    orden.setEstado(new EstadoPagado());
  }

  enviar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede enviar una orden que aún no ha sido pagada.', COLORS.red);
  }

  entregar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede entregar una orden sin pagar ni despachar.', COLORS.red);
  }

  cancelar(orden: ContextoOrden): void {
    console.log('  %cOrden cancelada sin costo.', COLORS.yellow);
    orden.setEstado(new EstadoCancelado());
  }
}

// Estado 2: Pagado
class EstadoPagado implements EstadoOrden {
  nombre: string = 'PAGADO';

  pagar(_orden: ContextoOrden): void {
    console.log('  %c[Aviso]: La orden ya fue pagada anteriormente.', COLORS.yellow);
  }

  enviar(orden: ContextoOrden): void {
    console.log('  %cPaquete entregado a la transportadora.', COLORS.green);
    orden.setEstado(new EstadoEnviado());
  }

  entregar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede entregar una orden que no ha sido despachada.', COLORS.red);
  }

  cancelar(orden: ContextoOrden): void {
    console.log('  %cOrden cancelada. Se procesará reembolso al cliente.', COLORS.yellow);
    orden.setEstado(new EstadoCancelado());
  }
}

// Estado 3: Enviado (en camino)
class EstadoEnviado implements EstadoOrden {
  nombre: string = 'ENVIADO';

  pagar(_orden: ContextoOrden): void {
    console.log('  %c[Aviso]: La orden ya está pagada y en camino.', COLORS.yellow);
  }

  enviar(_orden: ContextoOrden): void {
    console.log('  %c[Aviso]: La orden ya se encuentra en camino.', COLORS.yellow);
  }

  entregar(orden: ContextoOrden): void {
    console.log('  %cPaquete recibido a satisfacción por el cliente.', COLORS.green);
    orden.setEstado(new EstadoEntregado());
  }

  cancelar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede cancelar; el paquete ya está en tránsito.', COLORS.red);
  }
}

// Estado 4: Entregado (finalizado con éxito)
class EstadoEntregado implements EstadoOrden {
  nombre: string = 'ENTREGADO';

  pagar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: La orden ya fue entregada y finalizada.', COLORS.red);
  }

  enviar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: La orden ya fue entregada.', COLORS.red);
  }

  entregar(_orden: ContextoOrden): void {
    console.log('  %c[Aviso]: La orden ya fue entregada anteriormente.', COLORS.yellow);
  }

  cancelar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede cancelar una orden ya entregada.', COLORS.red);
  }
}

// Estado 5: Cancelado (terminal)
class EstadoCancelado implements EstadoOrden {
  nombre: string = 'CANCELADO';

  pagar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: La orden está cancelada.', COLORS.red);
  }

  enviar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede enviar una orden cancelada.', COLORS.red);
  }

  entregar(_orden: ContextoOrden): void {
    console.log('  %c[No permitido]: No se puede entregar una orden cancelada.', COLORS.red);
  }

  cancelar(_orden: ContextoOrden): void {
    console.log('  %c[Aviso]: La orden ya se encuentra cancelada.', COLORS.yellow);
  }
}

function main(): void {
  console.log('%cCICLO DE VIDA DE ORDEN DE COMPRA', COLORS.purple);

  // --- ESCENARIO 1: Flujo exitoso ---
  console.log('%c--- Escenario 1: Flujo Exitoso Completo ---', COLORS.blue);
  const orden1 = new ContextoOrden('ORD-101', 350000);

  // Intentar enviar sin pagar (debe fallar)
  orden1.enviar();

  // Pagar -> Enviar -> Entregar
  orden1.pagar();
  orden1.enviar();

  // Intentar cancelar en ruta (debe fallar)
  orden1.cancelar();

  // Entregar finalmente
  orden1.entregar();

  // Intentar cancelar después de entregada (debe fallar)
  orden1.cancelar();

  // --- ESCENARIO 2: Cancelación temprana ---
  console.log('%c\n--- Escenario 2: Cancelación Oportuna ---', COLORS.orange);
  const orden2 = new ContextoOrden('ORD-102', 120000);
  orden2.cancelar();
  orden2.pagar(); // Debe fallar

  console.log('%cDemostración completada con éxito.', COLORS.green);

}

main();
