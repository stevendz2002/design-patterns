
# Taller UCEVA — Arquitectura de Software (Docente: Jesus David Mejia Vergara)

## Integrantes del Grupo y Reparto de Trabajo

| # | Integrante | Responsabilidad |
|---|------------|-----------------|
| 1 | Andrés Felipe Saavedra | Patrones obligatorios: Builder, Adapter, Flyweight y Observer |
| 2 | Sebastián Arenas Moncada | 3 patrones de comportamiento adicionales: Strategy, Command y State |
| 3 | Jhon Edward Steven Loaiza Díaz | 2 patrones creacionales: Factory Method y Singleton + 1 patrón estructural: Decorator |

## Patrones Obligatorios Agregados por el Integrante 1 (Andrés Felipe Saavedra)

Cada patrón obligatorio se implementó en su propio archivo independiente con función `main` ejecutable en consola y documentación que describe el problema y la solución adoptada.

### 1. Builder — Creacional

**Problema de ingeniería:** en un videojuego RPG se requiere instanciar enemigos con múltiples características (vida, daño, velocidad, arma, inteligencia y habilidad especial opcional). Utilizar un constructor con demasiados parámetros resulta confuso y propenso a errores. Builder permite construir el enemigo paso a paso de forma fluida (`EnemyBuilder`) configurando únicamente los atributos requeridos y obteniendo el objeto terminado con `build()`.

**Archivo:** `01-Patrones-Creacionales/01-Builder/enemy_builder.ts`

```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno enemy_builder.ts
```

### 2. Adapter — Estructural

**Problema de ingeniería:** una aplicación de oficina trabaja con una interfaz estándar `Printer` mediante el método `print(document)`. Al reutilizar una impresora antigua (`LegacyPrinter`), esta solo cuenta con el método `imprimirTexto(texto)`. En lugar de modificar la aplicación o reescribir la biblioteca antigua, el adaptador `LegacyPrinterAdapter` traduce la llamada moderna al método legado, resolviendo la incompatibilidad de interfaces.

**Archivo:** `02-Patrones-Estructurales/01-Adapter/printer_adapter.ts`

```
cd 02-Patrones-Estructurales/01-Adapter
```
```
deno printer_adapter.ts
```

### 3. Flyweight — Estructural

**Problema de ingeniería:** en una aplicación gráfica se simulan miles de partículas para efectos de humo y fuego. Si cada partícula almacena individualmente su textura, color y tipo, se duplica información y se desperdicia memoria RAM. Flyweight extrae el estado intrínseco compartido (`ParticleType` administrado por `ParticleFactory`) y conserva solo el estado extrínseco individual (coordenadas x/y, tamaño) en cada instancia de `Particle`.

**Archivo:** `02-Patrones-Estructurales/06-Flyweight/particles_flyweight.ts`

```
cd 02-Patrones-Estructurales/06-Flyweight
```
```
deno particles_flyweight.ts
```

### 4. Observer — Comportamiento

**Problema de ingeniería:** en una tienda en línea, múltiples clientes esperan recibir una notificación inmediata cuando un producto agotado (ej. consola de videojuegos) vuelve a tener disponibilidad. Sin Observer, el inventario tendría que conocer y gestionar directamente a cada cliente. Observer permite que los clientes (`Cliente`) se suscriban al producto (`Producto`), el cual notifica automáticamente a todos sus observadores cuando cambia su estado.

**Archivo:** `03-Patrones-Comportamiento/06-Observer/notification_observer.ts`

```
cd 03-Patrones-Comportamiento/06-Observer
```
```
deno notification_observer.ts
```

## Patrones Agregados por el Integrante 2 (Sebastián Arenas Moncada)

Cada patrón se encuentra implementado en su propio archivo independiente dentro de su carpeta designada, incluyendo función `main` ejecutable en consola (reproducible directamente con Deno o Node.js) y un encabezado de documentación técnica que responde: qué hace el patrón, qué problema de ingeniería resuelve y por qué es la solución adecuada frente a otras alternativas.

### 1. Strategy — Comportamiento

**Problema de ingeniería:** en una plataforma de comercio electrónico se requiere calcular costos y tiempos de entrega mediante distintos operadores logísticos (terrestre estándar, aéreo express y dron ecológico). El patrón Strategy encapsula cada algoritmo de tarificación en clases independientes intercambiables en tiempo de ejecución, erradicando condicionales `if/switch` dentro del pedido y permitiendo incorporar nuevas opciones de transporte sin modificar la clase de la calculadora (Principio Abierto/Cerrado).

**Archivo:** `03-Patrones-Comportamiento/08-Strategy/strategy-comercio.ts`

```
cd 03-Patrones-Comportamiento/08-Strategy
```
```
deno strategy-comercio.ts
```

### 2. Command — Comportamiento

**Problema de ingeniería:** un sistema de automatización para aulas inteligentes necesita accionar iluminación digital, pantalla motorizada con proyector láser y aire acondicionado desde un panel de control central. El patrón Command encapsula cada solicitud como un objeto independiente con métodos `ejecutar()` y `deshacer()`, permitiendo al panel despachar órdenes y revertirlas en orden estrictamente inverso (pila LIFO / *undo*) sin acoplarse a las implementaciones concretas de cada dispositivo.

**Archivo:** `03-Patrones-Comportamiento/02-Command/command-aula.ts`

```
cd 03-Patrones-Comportamiento/02-Command
```
```
deno command-aula.ts
```

### 3. State — Comportamiento

**Problema de ingeniería:** en la gestión del ciclo de vida de órdenes de compra, las acciones permitidas (pagar, enviar, entregar y cancelar) dependen estrictamente del estado actual del pedido (`Pendiente` -> `Pagado` -> `Enviado` -> `Entregado` / `Cancelado`). El patrón State extrae la lógica de negocio y las reglas de transición a clases de estado independientes, eliminando bloques condicionales anidados dentro del contexto y blindando la orden contra transiciones no permitidas (ej. despachar sin haber pagado o cancelar un pedido en ruta).

**Archivo:** `03-Patrones-Comportamiento/07-State/state-orden.ts`

```
cd 03-Patrones-Comportamiento/07-State
```
```
deno state-orden.ts
```

## Patrones Agregados por el Integrante 3 (Jhon Edward Steven Loaiza Díaz)

Cada patrón vive en su propio archivo independiente con función `main` no interactiva (resultado reproducible por consola) y un encabezado de documentación que responde: qué hace el patrón, qué problema de ingeniería resuelve y por qué es la solución adecuada frente a otras alternativas.

### 1. Factory Method — Creacional

**Problema de ingeniería:** una pasarela de telemetría agroindustrial provisiona estaciones con sensores de distintos fabricantes (temperatura, humedad y presión). Al llegar hardware nuevo (sensor de CO2), la pasarela se limita a registrar una fábrica adicional sin modificar el código existente (Principio de Abierto/Cerrado).

**Archivo:** `01-Patrones-Creacionales/02-Factory-Method/iot_sensor_factory_method.ts`

```
cd 01-Patrones-Creacionales/02-Factory-Method
```
```
deno iot_sensor_factory_method.ts
```

### 2. Singleton — Creacional

**Problema de ingeniería:** en un backend transaccional, los subsistemas (API REST, reportes, jobs) comparten el ÚNICO pool de conexiones a base de datos: se evita crear pools duplicados, se respeta el límite de conexiones concurrentes y las conexiones liberadas son reutilizadas por otros módulos.

**Archivo:** `01-Patrones-Creacionales/06-Singleton/connection_pool_singleton.ts`

```
cd 01-Patrones-Creacionales/06-Singleton
```
```
deno connection_pool_singleton.ts
```

### 3. Decorator — Estructural

**Problema de ingeniería:** el canal de transmisión de tramas de telemetría exigía combinaciones de compresión (RLE por tokens), cifrado (simulación XOR + hexadecimal) y verificación de integridad (checksum de 16 bits) según el enlace físico. El apilado dinámico de decoradores evita la explosión de 2^N subclases y permite recomponer la pila por enlace (radio rural seguro vs. cable USB de mantenimiento).

**Archivo:** `02-Patrones-Estructurales/04-Decorator/telemetry_channel_decorator.ts`

```
cd 02-Patrones-Estructurales/04-Decorator
```
```
deno telemetry_channel_decorator.ts
```

> Nota: sin Deno instalado también se pueden ejecutar directo con Node moderno (>= v23) usando `node <archivo.ts>`, sin compilar (Node 24: type stripping nativo) ni instalar dependencias adicionales.