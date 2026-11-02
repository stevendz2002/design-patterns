## Patrones de diseño

El código está escrito en TypeScript y usamos Deno para ejecutarlo, puedes usar Bun o Node si lo prefieres.

Si usas Node, deberás configurar TypeScript, por lo que te recomiendo Deno o Bun.

## Ejecución de Archivos

### Ejecutar Archivo Una Vez
```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno builder.ts
```
```
deno builder.task.ts
```

### Ejecutar Archivo de Forma Automatica
```
cd 01-Patrones-Creacionales/01-Builder
```
```
deno --watch builder.ts
```
```
deno --watch builder.task.ts
```

# Recursos adicionales

* [Refactoring Guru](https://refactoring.guru/es/design-patterns/catalog)

* [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans?tab=readme-ov-file)

* [Patterns.dev](https://www.patterns.dev/)

* [Java Design Patterns](https://github.com/iluwatar/java-design-patterns)

* [Design Patterns TypeScript](https://github.com/torokmark/design_patterns_in_typescript?tab=readme-ov-file)

# Listado de Patrones Recomendados para el Curso

## Creacionales
- Builder
- Abstract Factory
- Factory Function
- Singleton

## Estructurales
- Adapter
- Composite
- Facade
- Flyweight

## Comportamiento
- Chain Responsability
- Observer
- Strategy
- Template Method

---

# Taller UCEVA — Arquitectura de Software (Docente: Jesus David Mejia Vergara)

## Integrantes del Grupo y Reparto de Trabajo

| # | Integrante | Responsabilidad |
|---|------------|-----------------|
| 1 | Andrés Felipe Saavedra | Patrones obligatorios: Builder, Adapter, Flyweight y Observer |
| 2 | Sebastián Arenas Moncada | 3 patrones de comportamiento (en desarrollo) |
| 3 | Jhon Edward Steven Loaiza Díaz | 2 patrones creacionales: Factory Method y Singleton + 1 patrón estructural: Decorator |

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