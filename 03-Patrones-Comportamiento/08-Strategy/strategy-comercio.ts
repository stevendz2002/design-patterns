/**
*! ¿Que hace el patrón Strategy?

El patrón Strategy permite definir diferentes algoritmos para realizar
una misma tarea, permite que un objeto utilice diferentes estrategias
para ejecutar una operación sin necesidad de conocer los detalles internos
de cada algoritmo.

*! ¿Qué problema se está resolviendo?

En el sistema de comercio electrónico se necesita calcular el costo
de envío dependiendo del operador logístico seleccionado por el usuario.

Sin aplicar un patrón de diseño, la clase principal del pedido podría
contenermúltiples condiciones if/else o switch para determinar qué algoritmo utilizar.

Esto ocasionaría que, al agregar un nuevo operador logístico, fuera necesario modificar
constantemente la clase principal, aumentando la complejidad y dificultando el
mantenimiento del sistema.

*! ¿Por qué ese patrón es adecuado para solucionar dicho problema?

Strategy es adecuado porque permite separar cada algoritmo de cálculo en una clase
independiente, todas implementando una misma interfaz.

Por ejemplo:
- EnvioTerrestre: implementa el cálculo del envío terrestre.
- EnvioAereo: implementa el cálculo del envío aéreo.
- EnvioDron: implementa el cálculo del envío ecológico.
La clase Pedido solamente utiliza la estrategia seleccionada,
sin conocer cómo se realiza internamente el cálculo.

Ventajas:
- Evita utilizar múltiples condiciones if/else o switch.
- Permite agregar nuevos operadores logísticos sin modificar
  los algoritmos existentes.
- Facilita el mantenimiento y las pruebas del código.
- Permite cambiar dinámicamente el algoritmo utilizado.
 */


/**
 * Interfaz común que define el contrato que deben satisfacer
   todos los algoritmos de cálculo de costo y logística de envío.
 */

import { COLORS } from '../../helpers/colors.ts';


export interface EstrategiaEnvio {

  readonly nombre: string;

   //Calcula el costo total del envío en pesos colombianos (COP).
  calcularCosto(pesoKg: number, distanciaKm: number): number;

  // Retorna una estimación legible del tiempo de entrega.
  obtenerTiempoEntrega(distanciaKm: number): string;

   //Retorna el detalle del cálculo y las condiciones logísticas aplicadas.
  obtenerDetalle(pesoKg: number, distanciaKm: number): string;
}
/**
 * Estrategia # 1: Envío Terrestre Estándar.
 * 
 * Modelo logístico convencional mediante transporte por carretera:
 *  - Tarifa base fija: $5.000 COP
 *  - Costo por kilogramo: $1.200 COP
 *  - Costo por kilómetro: $80 COP
 *  - Tiempo de entrega estimado: 3 a 5 días hábiles.
 */
class EnvioTerrestreEstandar implements EstrategiaEnvio {
  nombre: string = 'Envío Terrestre Estándar';

  private  TARIFA_BASE: number = 5000;
  private  COSTO_POR_KG: number = 1200;
  private  COSTO_POR_KM: number = 80;

  calcularCosto(pesoKg: number, distanciaKm: number): number {
    const costoPeso = pesoKg * this.COSTO_POR_KG;
    const costoDistancia = distanciaKm * this.COSTO_POR_KM;
    return this.TARIFA_BASE + costoPeso + costoDistancia;
  }

  obtenerTiempoEntrega(distanciaKm: number): string {
    if (distanciaKm > 400) {
      return '4 a 6 días hábiles (Ruta nacional de larga distancia)';
    }
    return '2 a 3 días hábiles (Ruta regional estándar)';
  }

  obtenerDetalle(pesoKg: number, distanciaKm: number): string {
    const total = this.calcularCosto(pesoKg, distanciaKm);
    return `
    [Terrestre]
    Base: $${this.TARIFA_BASE.toLocaleString('es-CO')}
    Peso (${pesoKg}kg): $${(pesoKg * this.COSTO_POR_KG).toLocaleString('es-CO')} 
    Distancia (${distanciaKm}km): $${(distanciaKm * this.COSTO_POR_KM).toLocaleString('es-CO')} 
    => Total: $${total.toLocaleString('es-CO')} COP`;
  }
}

/**
 * Estrategia # 2: Envío Aéreo Express.
 * 
 * Modelo logístico de alta prioridad mediante flota aérea comercial:
 *  - Tarifa base prioritaria: $20.000 COP
 *  - Costo por kilogramo: $3.500 COP
 *  - Costo por kilómetro: $150 COP
 *  - Recargo de despacho preferencial 24h: $8.000 COP
 *  - Tiempo de entrega estimado: 24 a 48 horas.
 */
export class EnvioAereoExpress implements EstrategiaEnvio {
  readonly nombre: string = 'Envío Aéreo Express';

  private readonly TARIFA_BASE: number = 20000;
  private readonly COSTO_POR_KG: number = 3500;
  private readonly COSTO_POR_KM: number = 150;
  private readonly RECARGO_DESPACHO_URGENTE: number = 8000;

  calcularCosto(pesoKg: number, distanciaKm: number): number {
    const costoPeso = pesoKg * this.COSTO_POR_KG;
    const costoDistancia = distanciaKm * this.COSTO_POR_KM;
    return this.TARIFA_BASE + this.RECARGO_DESPACHO_URGENTE + costoPeso + costoDistancia;
  }

  obtenerTiempoEntrega(_distanciaKm: number): string {
    return '24 a 48 horas (Prioridad máxima con despacho aéreo preferente)';
  }

  obtenerDetalle(pesoKg: number, distanciaKm: number): string {
    const total = this.calcularCosto(pesoKg, distanciaKm);
    return `
    [Aéreo Express]
    Base: $${this.TARIFA_BASE.toLocaleString('es-CO')}
    Despacho urgente: $${this.RECARGO_DESPACHO_URGENTE.toLocaleString('es-CO')}
    Peso (${pesoKg}kg): $${(pesoKg * this.COSTO_POR_KG).toLocaleString('es-CO')}
    Distancia (${distanciaKm}km): $${(distanciaKm * this.COSTO_POR_KM).toLocaleString('es-CO')}
    => Total: $${total.toLocaleString('es-CO')} COP`;
  }
}

/**
 * Estrategia # 3: Envío Ecológico en Dron.
 * 
 * Modelo logístico sustentable de última milla mediante drones eléctricos autónomos:
 *  - Tarifa base ecológica: $10.000 COP
 *  - Rango operativo máximo: 25 km (zona urbana y periferia inmediata).
 *  - Capacidad máxima óptima: hasta 3.0 kg.
 *    * Si el peso supera 3 kg, se aplica recargo por consumo de batería de $4.500 COP por kg adicional.
 *  - Costo por kilómetro: $180 COP
 *  - Emisiones de CO2: 0g (100% energía solar recargable).
 *  - Tiempo de entrega estimado: 35 a 60 minutos.
 */
export class EnvioEcologicoDron implements EstrategiaEnvio {
  readonly nombre: string = 'Envío Ecológico en Dron (Cero Emisiones)';

  private readonly TARIFA_BASE: number = 10000;
  private readonly LIMITE_PESO_BASE_KG: number = 3.0;
  private readonly RECARGO_BATERIA_POR_KG_EXTRA: number = 4500;
  private readonly COSTO_POR_KM: number = 180;
  private readonly RADIO_MAXIMO_KM: number = 25;

  calcularCosto(pesoKg: number, distanciaKm: number): number {
    let costoTotal = this.TARIFA_BASE + (distanciaKm * this.COSTO_POR_KM);

    // Si supera el límite de carga eficiente, aplica recargo de consumo de batería
    if (pesoKg > this.LIMITE_PESO_BASE_KG) {
      const pesoExtra = pesoKg - this.LIMITE_PESO_BASE_KG;
      costoTotal += pesoExtra * this.RECARGO_BATERIA_POR_KG_EXTRA;
    }

    // Si excede el radio urbano de cobertura del dron, recargo de estación repetidora
    if (distanciaKm > this.RADIO_MAXIMO_KM) {
      costoTotal += 5000; // Tarifa de relevo en estación remota
    }

    return costoTotal;
  }

  obtenerTiempoEntrega(distanciaKm: number): string {
    if (distanciaKm <= 10) {
      return '30 a 45 minutos (Entrega directa punto a punto por dron)';
    }
    return '45 a 75 minutos (Ruta con estación de reabastecimiento rápido)';
  }

  obtenerDetalle(pesoKg: number, distanciaKm: number): string {
    const total = this.calcularCosto(pesoKg, distanciaKm);
    const recargoPeso = pesoKg > this.LIMITE_PESO_BASE_KG
      ? (pesoKg - this.LIMITE_PESO_BASE_KG) * this.RECARGO_BATERIA_POR_KG_EXTRA
      : 0;
    return `
    [Dron Verde]
    Base: $${this.TARIFA_BASE.toLocaleString('es-CO')}
    Km (${distanciaKm}km): $${(distanciaKm * this.COSTO_POR_KM).toLocaleString('es-CO')}
    Recargo Batería: $${recargoPeso.toLocaleString('es-CO')}
    => Total: $${total.toLocaleString('es-CO')} COP [0% Huella Carbono]`;
  }
}

/**
 * Clase Contexto que utiliza el patrón Strategy.
 * Mantiene una referencia a la estrategia seleccionada y delega la ejecución de los
 * cálculos de envío sin preocuparse por los detalles técnicos de cada operador.
 */
export class CalculadoraEnvio {
  private estrategia: EstrategiaEnvio;

  /**
   * Inicializa la calculadora con una estrategia de envío concreta por defecto.
   * @param estrategiaInicial Implementación de EstrategiaEnvio.
   */
  constructor(estrategiaInicial: EstrategiaEnvio) {
    this.estrategia = estrategiaInicial;
  }

  /**
   * Permite sustituir la estrategia de cálculo en tiempo de ejecución.
   * Este método es el núcleo de la flexibilidad del patrón Strategy.
   * @param nuevaEstrategia Nueva instancia de EstrategiaEnvio a utilizar.
   */
  cambiarEstrategia(nuevaEstrategia: EstrategiaEnvio): void {
    console.log(`%c\n>>> [Transición de Estrategia] Cambiando operador a: "${nuevaEstrategia.nombre}"`, COLORS.purple);
    this.estrategia = nuevaEstrategia;
  }

  /**
   * Obtiene la estrategia actual en uso.
   */
  obtenerEstrategiaActual(): EstrategiaEnvio {
    return this.estrategia;
  }

  /**
   * Ejecuta el cálculo delegando en la estrategia actual.
   * @param pesoKg Peso del paquete en kilogramos.
   * @param distanciaKm Distancia de entrega en kilómetros.
   */
  calcularCosto(pesoKg: number, distanciaKm: number): number {
    return this.estrategia.calcularCosto(pesoKg, distanciaKm);
  }

  /**
   * Imprime en consola la cotización completa y detallada usando la estrategia activa.
   */
  mostrarCotizacion(pesoKg: number, distanciaKm: number): void {
    const costo = this.calcularCosto(pesoKg, distanciaKm);
    const tiempo = this.estrategia.obtenerTiempoEntrega(distanciaKm);
    const detalle = this.estrategia.obtenerDetalle(pesoKg, distanciaKm);

    console.log(`%cOperador Logístico : ${this.estrategia.nombre}`, COLORS.orange);
    console.log(`%cCarga a transportar: ${pesoKg.toFixed(1)} kg | Distancia: ${distanciaKm.toFixed(1)} km`, COLORS.blue);
    console.log(`%cTiempo Estimado    : ${tiempo}`, COLORS.green);
    console.log(`%cDesglose Financiero: ${detalle}`, COLORS.yellow);
    console.log(`%cCOSTO FINAL A PAGAR: $${costo.toLocaleString('es-CO')} COP`, COLORS.red);
  }
}

// =========================================================================================
// 4. DEMOSTRACIÓN FUNCIONAL EN CONSOLA (Cliente)
// =========================================================================================

function main(): void {

  // Datos del paquete y destino a cotizar
  const pesoPaqueteKg: number = 4.2;
  const distanciaEntregaKm: number = 18.5;

  console.log(`\nPedido del cliente: Paquete de ${pesoPaqueteKg} kg con destino a ${distanciaEntregaKm} km de la bodega central.\n`);

  // Instanciación de las 3 estrategias concretas
  const estrategiaTerrestre = new EnvioTerrestreEstandar();
  const estrategiaAerea = new EnvioAereoExpress();
  const estrategiaDron = new EnvioEcologicoDron();

  // 1. Inicialización del contexto con la estrategia Terrestre Estándar
  const calculadora = new CalculadoraEnvio(estrategiaTerrestre);
  calculadora.mostrarCotizacion(pesoPaqueteKg, distanciaEntregaKm);

  // 2. Cambio en tiempo de ejecución a Envío Aéreo Express
  calculadora.cambiarEstrategia(estrategiaAerea);
  calculadora.mostrarCotizacion(pesoPaqueteKg, distanciaEntregaKm);

  // 3. Cambio en tiempo de ejecución a Envío Ecológico en Dron
  calculadora.cambiarEstrategia(estrategiaDron);
  calculadora.mostrarCotizacion(pesoPaqueteKg, distanciaEntregaKm);
}

// Ejecutar demostración automáticamente si se ejecuta con node o deno
main();
