/*
 * ! Decorator — Canal de transmisión de telemetría (Patrón Estructural)
 *
 * ? ¿QUÉ HACE EL PATRÓN?
 * Envuelve un objeto dentro de "decoradores" que comparten la misma
 * interfaz. Cada decorador delega en el objeto envuelto y LE AÑADE un
 * comportamiento antes o después de la delegación. Así se modifican las
 * responsabilidades de un objeto EN TIEMPO DE EJECUCIÓN y de forma
 * APILABLE (onion), manteniendo una misma interfaz pública para el cliente.
 *
 * ! ¿QUÉ PROBLEMA DE INGENIERÍA SE RESUELVE?
 * Una estación meteorológica remota transmite tramas CSV de sensores hacia
 * el centro de datos por diferentes enlaces físicos (radio rural, cable
 * USB de mantenimiento). Según el enlace y la sensibilidad del dato se
 * exigen combos distintos de: COMPRESIÓN (reducción de uso de radio),
 * CIFRADO (confidencialidad) e INTEGRIDAD (checksum para detectar
 * corrupción del enlace). Con herencia estática se necesitarían 2^N
 * subclases (CompresiónYDetección, CifradoYCompresiónYDetección, etc.) y
 * NINGUNA combinatoria nueva podría añadirse sin recompilar la jerarquía
 * completa.
 *
 * ? ¿POR QUÉ ESTE PATRÓN Y NO OTRAS ALTERNATIVAS?
 * * Herencia para cada combinación: estructura rígida, explota en 2^N
 *   subclases y no permite decidir la pila en tiempo de ejecución.
 * * Campos de configuración (flags compresion = true, encrypt = true ...):
 *   viola SRP (una sola clase con todas las responsabilidades) y obliga a
 *   propagar condicionales en toda la clase.
 * * Cadena de middleware/interceptor externa: útil en frameworks web, pero
 *   introduce una infraestructura ajena; aquí basta la composición textual
 *   de objetos, sin dependencias.
 * * Adapter: se parece en que envuelve objetos, pero ADAPTER cambia la
 *   INTERFAZ para compatibilizar componentes incompatibles; DECORATOR
 *   conserva la MISMA interfaz y solo agrega comportamiento.
 * * Facade: simplifica un subsistema dando UNA fachada de alto nivel,
 *   mientras DECORATOR mantiene granularidad: cada capa es útil por sí sola.
 *
 * ? EJECUCIÓN
 * deno telemetry_channel_decorator.ts   (alternativa: node telemetry_channel_decorator.ts)
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Primitivas de transformación (simulaciones pedagógicas) ----------

const XOR_KEY: number = 42;

/**
 * Compresión RLE a nivel de tokens sobre tramas CSV
 * (p. ej. '22.7,22.7,22.7' -> '22.7x3').
 */
function compressTokens(payload: string): string {
  const tokens: string[] = payload.split(',');
  let compressed: string = '';
  let index: number = 0;

  while (index < tokens.length) {
    let runLength: number = 1;
    while (
      index + runLength < tokens.length &&
      tokens[index + runLength] === tokens[index]
    ) {
      runLength++;
    }
    compressed += tokens[index];
    if (runLength > 1) {
      compressed += `x${runLength}`;
    }
    if (index + runLength < tokens.length) {
      compressed += ',';
    }
    index += runLength;
  }
  return compressed;
}

/** Cifrado simétrico pedagógico (XOR) codificado en hexadecimal. */
function encryptToHex(payload: string): string {
  let encrypted: string = '';
  for (let index: number = 0; index < payload.length; index++) {
    encrypted += (payload.charCodeAt(index) ^ XOR_KEY)
      .toString(16)
      .padStart(2, '0');
  }
  return encrypted;
}

/** Suma de control (checksum) de 16 bits para verificar integridad. */
function checksum16(payload: string): string {
  let sum: number = 0;
  for (let index: number = 0; index < payload.length; index++) {
    sum = (sum + payload.charCodeAt(index)) % 65536;
  }
  return sum.toString(16).padStart(4, '0').toUpperCase();
}

// ---------- Componente base con la interfaz común ----------

/** Contrato de todo canal de transmisión de tramas. */
interface DataChannel {
  send(frameId: string, payload: string): void;
}

/** Enlace físico base: radio banda libre hacia el centro de datos. */
class RadioLinkChannel implements DataChannel {
  send(frameId: string, payload: string): void {
    console.log(
      `%c[RadioLink] Trama ${frameId} sale a la banda libre (${
        payload.length * 2
      } bytes en la señal)`,
      COLORS.blue
    );
    console.log(`%c[RadioLink] Payload final: ${payload}`, COLORS.gray);
  }
}

// ---------- Decorador base ----------

/**
 * Decorador abstracto: implementar DataChannel y referencia el objeto
 * envuelto. Las subclases deciden SI transforman el payload antes de
 * delegar. `protected` permite que los decoradores concretos accedan al
 * envuelto (un campo privado lo impediría).
 */
abstract class ChannelDecorator implements DataChannel {
  protected readonly wrapped: DataChannel;

  constructor(wrapped: DataChannel) {
    this.wrapped = wrapped;
  }

  /** Reenvío por defecto: un decorador puede solo escuchar y no alterar. */
  send(frameId: string, payload: string): void {
    this.wrapped.send(frameId, payload);
  }
}

// ---------- Decoradores concretos ----------

/** Decorador de COMPRESIÓN: reduce el payload antes de delegar. */
class CompressionDecorator extends ChannelDecorator {
  override send(frameId: string, payload: string): void {
    const compressed: string = compressTokens(payload);
    console.log(
      `%c[Compresión RLE] ${payload.length} -> ${compressed.length} bytes`,
      COLORS.green
    );
    this.wrapped.send(frameId, compressed);
  }
}

/** Decorador de CONFIDENCIALIDAD: cifra el payload antes de delegar. */
class EncryptionDecorator extends ChannelDecorator {
  override send(frameId: string, payload: string): void {
    const encrypted: string = encryptToHex(payload);
    console.log(
      `%c[Cifrado XOR] payload ofuscado -> ${encrypted.length} bytes hex`,
      COLORS.red
    );
    this.wrapped.send(frameId, encrypted);
  }
}

/** Decorador de INTEGRIDAD: añade el checksum al final del payload. */
class IntegrityDecorator extends ChannelDecorator {
  override send(frameId: string, payload: string): void {
    const sealedPayload: string = `${payload}#${checksum16(payload)}`;
    console.log(
      `%c[Integridad] checksum ${checksum16(payload)} adjuntado`, 
      COLORS.yellow
    );
    this.wrapped.send(frameId, sealedPayload);
  }
}

/** Decorador de trazabilidad: registra la hora local de cada envío. */
class TelemetryLogDecorator extends ChannelDecorator {
  override send(frameId: string, payload: string): void {
    console.log(
      `%c[Log] ${new Date().toISOString()} -> Trama ${frameId} en tránsito`,
      COLORS.purple
    );
    this.wrapped.send(frameId, payload);
  }
}

// ---------- Código cliente ----------

function main(): void {
  console.log('%c=== Enlace telemetría con Decorator ===', COLORS.cyan);

  const frameOne: string = '22.7,22.7,22.7,22.7,23.1,23.1,23.4';

  // Enlace rural no confiable: se APILAN las tres capas + trazabilidad.
  // El ORDEN del apilado importa y es el de un stack de red real:
  // comprimir el dato crudo -> cifrarlo -> firmarlo (checksum del
  // ciphertext) -> (capa pegada al enlace que audita cada byte en vuelo).
  // La pila se construye componiendo objetos, manteniendo la MISMA interfaz.
  console.log('\n%c--- Configuración: enlace radio rural (seguro) ---', COLORS.blue);
  const secureChannel: DataChannel = new CompressionDecorator(
    new EncryptionDecorator(
      new IntegrityDecorator(
        new TelemetryLogDecorator(new RadioLinkChannel())
      )
    )
  );
  secureChannel.send('TL-1001', frameOne);

  // Cable de mantenimiento USB local: enlace confiable, sin cifrado; basta
  // compresión + integridad. RECOMPOSICIÓN dinámica sin tocar otras clases.
  console.log('\n%c--- Configuración: cable USB de mantenimiento ---', COLORS.blue);
  const maintenanceChannel: DataChannel = new CompressionDecorator(
    new IntegrityDecorator(new TelemetryLogDecorator(new RadioLinkChannel()))
  );
  maintenanceChannel.send('TL-1002', frameOne);

  // La misma base, con capas distintas, sigue siendo un DataChannel válido
  // (el contrato se comprueba por firma, no por clase concreta).
  console.log(
    '\n¿Ambos canales implementan el contrato DataChannel? => ' +
      `${typeof secureChannel.send === 'function' &&
        typeof maintenanceChannel.send === 'function'}`
  );
}

main();
