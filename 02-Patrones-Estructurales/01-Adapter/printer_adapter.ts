/*
PROBLEMA QUE RESUELVE ADAPTER:
Una aplicación de oficina trabaja con una interfaz Printer que utiliza
el método print(document). Sin embargo, se quiere reutilizar una impresora
antigua cuya biblioteca solo ofrece el método imprimirTexto(texto).

Las interfaces son incompatibles. Cambiar toda la aplicación para utilizar
la biblioteca antigua obligaría a modificar el código existente.

SOLUCIÓN:
El adaptador implementa la interfaz Printer que espera la aplicación
y traduce la llamada print(document) al método imprimirTexto(texto)
de la impresora antigua.
*/

// Interfaz que espera la aplicación moderna.
interface Printer {
    print(document: string): void;
}

// Servicio antiguo que no podemos modificar.
class LegacyPrinter {
    imprimirTexto(texto: string): void {
        console.log(`Impresora antigua: imprimiendo "${texto}"`);
    }
}

// Adaptador que conecta la interfaz moderna con la impresora antigua.
class LegacyPrinterAdapter implements Printer {
    constructor(private legacyPrinter: LegacyPrinter) {}

    print(document: string): void {
        this.legacyPrinter.imprimirTexto(document);
    }
}

// La aplicación solo conoce la interfaz Printer.
class OfficeApplication {
    constructor(private printer: Printer) {}

    printReport(report: string): void {
        console.log("Enviando informe a la impresora...");
        this.printer.print(report);
    }
}

// Crear la impresora antigua, el adaptador y la aplicación.
const oldPrinter = new LegacyPrinter();
const printerAdapter = new LegacyPrinterAdapter(oldPrinter);
const application = new OfficeApplication(printerAdapter);

// Imprimir utilizando la interfaz que espera la aplicación.
application.printReport("Informe de ventas - Octubre 2026");
