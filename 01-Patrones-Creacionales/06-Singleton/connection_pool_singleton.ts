/*
 * ! Singleton — Pool de conexiones a base de datos (Patrón Creacional)
 *
 * ? ¿QUÉ HACE EL PATRÓN?
 * Garantiza que una clase tenga UNA ÚNICA instancia en toda la aplicación
 * y expone un punto de acceso global y controlado (`getInstance()`). El
 * constructor se declara privado, de modo que nadie más puede instanciar
 * la clase, y la instanciación es PEREZOSA (lazy): no se crea el pool hasta
 * que alguien lo necesita por primera vez.
 *
 * ! ¿QUÉ PROBLEMA DE INGENIERÍA SE RESUELVE?
 * En un backend transaccional, abrir una conexión a la base de datos es
 * costoso: handshake TCP, autenticación y asignación de memoria en el
 * motor. Varios subsistemas (API REST, reportes, trabajos en lote) necesitan
 * conexiones al mismo tiempo. Si cada módulo creara su propio pool:
 *   1) se abriría el mismo pool repetidamente (establecimiento de conexiones
 *      redundante y latencia extra),
 *   2) se agotaría el límite de conexiones del servidor de base de datos
 *      (error laminado: max_connections), y
 *   3) sería imposible aplicar una única política central de timeouts y de
 *      límites.
 * Un Singleton administra el ÚNICO pool autorizado y su límite de
 * conexiones simultáneas (aquí simulado con objetos DatabaseConnection).
 *
 * ? ¿POR QUÉ ESTE PATRÓN Y NO OTRAS ALTERNATIVAS?
 * * Variable/objeto global (`export const pool = ...`): no permite
 *   inicialización perezosa, no encapsula invariantes y alienta dependencias
 *   ocultas difíciles de trazar.
 * * Módulo singleton de ECMAScript (stateless): útil, pero un POOL necesita
 *   estado mutable con invariantes (conexiones libres/leasings activos); el
 *   Singleton con constructor privado centraliza y protege esas invariantes.
 * * Inyección de dependencias con contenedor DI: recomendable en
 *   aplicaciones grandes con framework; en un servicio ligero sin
 *   dependencias externas, Singleton logra el mismo control sin agregar
 *   infraestructura.
 * * Concurrencia: JavaScript/Deno se ejecutan en un único hilo (event loop),
 *   por lo que no se requiere doble-checked locking ni sincronización como
 *   en Java/C#; la condición de carrera clásica de `getInstance()` no aplica.
 *
 * ? EJECUCIÓN
 * deno connection_pool_singleton.ts   (alternativa: node connection_pool_singleton.ts)
 */

import { COLORS } from '../../helpers/colors.ts';

// ---------- Conexión individual administrada por el pool ----------

/** Conexión física (simulada) prestada por el pool a un subsistema. */
class DatabaseConnection {
  readonly id: string;
  /** false = disponible en el pool, true = prestada a un subsistema. */
  inUse: boolean;
  /** Subsistema que posee el leasing actual (o null si está libre). */
  leasedBy: string | null;

  constructor(id: string) {
    this.id = id;
    this.inUse = false;
    this.leasedBy = null;
  }

  leaseTo(subsystem: string): void {
    this.inUse = true;
    this.leasedBy = subsystem;
  }

  backToPool(): void {
    this.inUse = false;
    this.leasedBy = null;
  }
}

// ---------- Singleton: el único pool autorizado ----------

class DatabaseConnectionPool {
  /** Instancia única (null hasta el primer `getInstance`). */
  private static instance: DatabaseConnectionPool | null = null;

  private readonly maxConnections: number;
  private readonly connections: DatabaseConnection[];

  /**
   * Constructor PRIVADO: impide `new DatabaseConnectionPool()`.
   * Solo el propio Singleton crea su única instancia.
   */
  private constructor(maxConnections: number) {
    this.maxConnections = maxConnections;
    this.connections = [];
    console.log(
      `%c[Pool] Creando pool único (max=${maxConnections}) y abriendo conexiones...`,
      COLORS.blue
    );
    for (let index: number = 1; index <= maxConnections; index++) {
      this.connections.push(new DatabaseConnection(`CONN-0${index}`));
    }
    console.log('%c[Pool] Pool listo y en modo escucha', COLORS.blue);
  }

  /**
   * Punto de acceso global. La creación es perezosa: ocurre en la primera
   * llamada. Las siguientes llamadas devuelven SIEMPRE la misma instancia.
   */
  public static getInstance(maxConnections: number = 3): DatabaseConnectionPool {
    if (DatabaseConnectionPool.instance === null) {
      DatabaseConnectionPool.instance = new DatabaseConnectionPool(maxConnections);
    }
    return DatabaseConnectionPool.instance;
  }

  /** Presta una conexión libre o informa del agotamiento del pool. */
  public acquire(requester: string): DatabaseConnection | null {
    const available: DatabaseConnection | undefined = this.connections.find(
      (connection: DatabaseConnection) => connection.inUse === false
    );

    if (typeof available === 'undefined') {
      console.log(
        `%c[Pool] EXHAUSTO: ${requester} no obtuvo conexión (${this.maxConnections}/${this.maxConnections} en uso)`,
        COLORS.red
      );
      return null;
    }

    available.leaseTo(requester);
    console.log(
      `%c[Pool] ${requester} leasing ${available.id} (en uso: ${
        this.countBusy()}/${this.maxConnections})`,
      COLORS.green
    );
    return available;
  }

  /** Devuelve una conexión al pool para su reutilización. */
  public release(connection: DatabaseConnection): void {
    console.log(
      `%c[Pool] ${connection.leasedBy ?? 'desconocido'} liberó ${connection.id}`,
      COLORS.yellow
    );
    connection.backToPool();
  }

  public countBusy(): number {
    return this.connections.filter(
      (connection: DatabaseConnection) => connection.inUse
    ).length;
  }
}

// ---------- Código cliente (subsistemas del backend) ----------

function main(): void {
  console.log('%c=== Backend con pool Singleton ===', COLORS.cyan);

  // Tres subsistemas solicitan el pool: solo el primero lo crea.
  const apiPool: DatabaseConnectionPool = DatabaseConnectionPool.getInstance(3);
  const reportsPool: DatabaseConnectionPool = DatabaseConnectionPool.getInstance();
  const jobsPool: DatabaseConnectionPool = DatabaseConnectionPool.getInstance();

  // Comprobación del contrato Singleton: todas las referencias apuntan al
  // mismo objeto.
  console.log(
    `\n¿API, Reportes y Jobs comparten el MISMO pool? => ${
      apiPool === reportsPool && reportsPool === jobsPool
    }`,
  );

  // Cada subsistema toma una conexión (3/3: pool lleno).
  const apiConnection: DatabaseConnection | null = apiPool.acquire('API');
  const reportsConnection: DatabaseConnection | null = reportsPool.acquire('Reportes');
  const jobsConnection: DatabaseConnection | null = jobsPool.acquire('Jobs');

  // Cuarto subsistema: el pool está exhausto, se deniega el leasing.
  console.log('\n%c--- El pool ha alcanzado su límite ---', COLORS.purple);
  const syncConnection: DatabaseConnection | null = apiPool.acquire('DataSync');
  console.log(`¿DataSync recibió una conexión? => ${syncConnection !== null}`);

  // Al liberarse una conexión, DataSync puede reintentar y REUTILIZARLA.
  console.log('\n%c--- Reportes termina y libera su conexión ---', COLORS.purple);
  if (reportsConnection !== null) {
    reportsPool.release(reportsConnection);
  }

  const retriedConnection: DatabaseConnection | null = apiPool.acquire('DataSync');
  console.log(
    `\n¿DataSync reutilizó la misma conexión liberada? => ${
      retriedConnection !== null && retriedConnection === reportsConnection
    }`
  );

  // Cierre ordenado de la demo: las conexiones prestadas vuelven al pool.
  const leasedConnections: readonly (DatabaseConnection | null)[] = [
    apiConnection,
    jobsConnection,
    retriedConnection,
  ];
  for (const connection of leasedConnections) {
    if (connection !== null) {
      apiPool.release(connection);
    }
  }
  console.log(`Conexiones ocupadas tras el cierre: ${apiPool.countBusy()}`);
}

main();
