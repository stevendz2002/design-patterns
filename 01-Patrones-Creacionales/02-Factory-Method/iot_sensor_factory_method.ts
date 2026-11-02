/*
 * ! Factory Method — Pasarela de sensores IoT (Patrón Creacional)
 *
 * ? ¿QUÉ HACE EL PATRÓN?
 * Define una interfaz para CREAR objetos, pero delega en las subclases la
 * decisión de qué clase concreta instanciar (el "método fábrica"). El
 * cliente (la pasarela de telemetría) solo maneja la abstracción
 * `SensorFactory` y el producto abstracto `Sensor`, sin conocer constructores
 * concretos ni ramificar su lógica por cada tipo de hardware.
 *
 * ! ¿QUÉ PROBLEMA DE INGENIERÍA SE RESUELVE?
 * Una plataforma de monitoreo agroindustrial despliega estaciones que leen
 * distintos tipos de sensores físicos (temperatura, humedad y presión). El
 * equipo de hardware lanza constantemente sensores nuevos (p. ej. un sensor
 * de CO2). Si la pasarela instanciara cada sensor con `new` y condicionales
 * `switch (tipo)`, cada sensor nuevo obligaría a MODIFICAR el código de la
 * pasarela (violación del Principio de Abierto/Cerrado, OCP) y acoplaría la
 * lógica de negocio a los drivers concretos de cada fabricante.
 *
 * ? ¿POR QUÉ ESTE PATRÓN Y NO OTRAS ALTERNATIVAS?
 * * Instanciación directa con `new`/`switch`: rompe OCP y SRP, cada tipo
 *   nuevo obliga a editar todas las funciones que crean sensores.
 * * Simple Factory (clase estática con un `switch`): centraliza la creación,
 *   pero sigue exigiendo modificar esa misma clase ante cada sensor nuevo;
 *   Factory Method delega la creación en SUBCLASES EXTENSIBLES.
 * * Abstract Factory: aplicable cuando hay FAMILIAS de productos
 *   relacionados; aquí cada estación crea una sola familia de sensores, así
 *   que sería sobreingeniería.
 * * Registry/mapa de constructores: viable, pero pierde el comportamiento
 *   común de provisionamiento (calibración de fábrica) que Factory Method
 *   encapsula en el creador abstracto.
 *
 * ? EJECUCIÓN
 * deno iot_sensor_factory_method.ts   (alternativa: node iot_sensor_factory_method.ts)
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Generador determinista (simula la física del instrumento) ----------

const LEHMER_MULTIPLIER: number = 48271;
const LEHMER_MODULUS: number = 2147483647;

function hashSeed(id: string): number {
  let seed: number = 7;
  for (let i = 0; i < id.length; i++) {
    seed = (seed * 31 + id.charCodeAt(i)) % LEHMER_MODULUS;
  }
  return seed;
}

function nextSeed(seed: number): number {
  return (seed * LEHMER_MULTIPLIER + 31) % LEHMER_MODULUS;
}

// ---------- Producto abstracto ----------

/** Lectura tomada por un instrumento físico. */
interface SensorReading {
  readonly unit: string;
  readonly value: number;
}

/** Contrato común de todos los sensores de la plataforma. */
interface Sensor {
  readonly id: string;
  read(): SensorReading;
}

// ---------- Productos concretos (drivers por tipo de instrumento) ----------

class TemperatureSensor implements Sensor {
  readonly id: string;
  private seed: number;

  constructor(id: string) {
    this.id = id;
    this.seed = hashSeed(id);
  }

  read(): SensorReading {
    this.seed = nextSeed(this.seed);
    const value: number = 18 + (this.seed % 1200) / 100; // 18.00 °C - 29.99 °C
    return { unit: '°C', value: Math.round(value * 10) / 10 };
  }
}

class HumiditySensor implements Sensor {
  readonly id: string;
  private seed: number;

  constructor(id: string) {
    this.id = id;
    this.seed = hashSeed(id);
  }

  read(): SensorReading {
    this.seed = nextSeed(this.seed);
    const value: number = 40 + (this.seed % 4000) / 100; // 40 % - 79 % HR
    return { unit: '%HR', value: Math.round(value * 10) / 10 };
  }
}

class PressureSensor implements Sensor {
  readonly id: string;
  private seed: number;

  constructor(id: string) {
    this.id = id;
    this.seed = hashSeed(id);
  }

  read(): SensorReading {
    this.seed = nextSeed(this.seed);
    const value: number = 990 + (this.seed % 4000) / 100; // 990 hPa - 1029 hPa
    return { unit: 'hPa', value: Math.round(value * 10) / 10 };
  }
}

/** Sensor nuevo lanzado DESPUÉS del diseño base (demostración de extensibilidad). */
class Co2Sensor implements Sensor {
  readonly id: string;
  private seed: number;

  constructor(id: string) {
    this.id = id;
    this.seed = hashSeed(id);
  }

  read(): SensorReading {
    this.seed = nextSeed(this.seed);
    const value: number = 400 + (this.seed % 600) / 10; // 400 ppm - 459 ppm
    return { unit: 'ppm', value: Math.round(value * 10) / 10 };
  }
}

// ---------- Creador abstracto ----------

abstract class SensorFactory {
  /**
   * FACTORY METHOD: cada subclase decide qué driver instanciar y le
   * inyecta el identificador físico. La pasarela (cliente) nunca invoca
   * por su cuenta los constructores concretos.
   */
  abstract createSensor(id: string): Sensor;

  /**
   * Flujo de provisionamiento compartido: toda estación calibra el
   * instrumento al instanciarlo. Si mañana cambia el protocolo (calibración
   * remota, verificación de firmware, etc.), solo se edita ESTE método.
   */
  deploySensor(id: string): Sensor {
    const sensor: Sensor = this.createSensor(id);
    console.log(
      `%c[Provisioning] ${this.name()} instaló ${id} y aplicó calibración de fábrica`,
      COLORS.cyan
    );
    return sensor;
  }

  abstract name(): string;
}

// ---------- Creadores concretos ----------

class TemperatureSensorFactory extends SensorFactory {
  createSensor(id: string): Sensor {
    return new TemperatureSensor(id);
  }

  name(): string {
    return 'TemperatureStation';
  }
}

class HumiditySensorFactory extends SensorFactory {
  createSensor(id: string): Sensor {
    return new HumiditySensor(id);
  }

  name(): string {
    return 'HumidityStation';
  }
}

class PressureSensorFactory extends SensorFactory {
  createSensor(id: string): Sensor {
    return new PressureSensor(id);
  }

  name(): string {
    return 'PressureStation';
  }
}

/** Fábrica del sensor nuevo: se AGREGA una clase, no se modifica ninguna. */
class Co2SensorFactory extends SensorFactory {
  createSensor(id: string): Sensor {
    return new Co2Sensor(id);
  }

  name(): string {
    return 'Co2Station';
  }
}

// ---------- Código cliente (pasarela de telemetría) ----------

/** Especificación de provisionamiento (como en un archivo de despliegue). */
interface SensorSpec {
  readonly type: string;
  readonly id: string;
}

function main(): void {
  console.log(
    '%c=== Pasarela de Telemetría con Factory Method ===',
    COLORS.blue
  );

  // Catálogo de fábricas disponibles en la pasarela.
  const sensorFactories: Map<string, SensorFactory> = new Map([
    ['temperature', new TemperatureSensorFactory()],
    ['humidity', new HumiditySensorFactory()],
    ['pressure', new PressureSensorFactory()],
  ]);

  const provisioningPlan: readonly SensorSpec[] = [
    { type: 'temperature', id: 'TEMP-NODE-01' },
    { type: 'temperature', id: 'TEMP-NODE-02' },
    { type: 'humidity', id: 'HUM-NODE-01' },
    { type: 'pressure', id: 'PRESS-NODE-01' },
  ];

  // La pasarela trabaja solo contra las abstracciones.
  const deployedSensors: Sensor[] = [];

  for (const spec of provisioningPlan) {
    const factory: SensorFactory | undefined = sensorFactories.get(spec.type);
    if (typeof factory === 'undefined') {
      console.log(
        `%c[Provisioning] Tipo ${spec.type} no soportado, se omite`,
        COLORS.red
      );
      continue;
    }
    deployedSensors.push(factory.deploySensor(spec.id));
  }

  // El fabricante lanza un sensor nuevo: se registra su fábrica y NADA del
  // código existente cambia (Principio de Abierto/Cerrado).
  console.log('\n%c=== Nuevo hardware disponible: sensor de CO2 ===', COLORS.yellow);
  sensorFactories.set('co2', new Co2SensorFactory());
  deployedSensors.push(new Co2SensorFactory().deploySensor('CO2-NODE-01'));

  // Ciclo de lectura en producción.
  console.log('\n%c=== Ciclo de lecturas ===', COLORS.green);
  for (const sensor of deployedSensors) {
    const reading: SensorReading = sensor.read();
    console.log(
      `%c${sensor.id} → ${reading.value} ${reading.unit}`,
      COLORS.white
    );
  }
}

main();
