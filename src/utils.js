
import { dirname } from "path";
import { fileURLToPath } from "url"; //fileURLToPath() convierte esa URL en una ruta de sistema

export const __dirname = dirname(fileURLToPath(import.meta.url));


/**
 * Este bloque de código tiene como función PRINCIPAL
 * recrear la constante __dirname en proyectos Node.js
 * que usan ES Modules ("type": "module").
 *
 * En ES Modules, Node.js NO proporciona __dirname ni __filename
 * como lo hace en CommonJS, por lo que es necesario construirlos
 * manualmente a partir de import.meta.url.
 *
 * import.meta.url entrega la URL del archivo actual (file://...),
 * fileURLToPath la convierte a una ruta del sistema,
 * y dirname obtiene el directorio donde se encuentra el archivo.
 *
 * El resultado final es una ruta absoluta a la carpeta del archivo,
 * equivalente al __dirname tradicional de CommonJS.
 *
 * Esto se utiliza para:
 * - Servir archivos estáticos (public)
 * - Configurar vistas (Handlebars / views)
 * - Cargar archivos locales de forma segura
 */