/**
 * ===========================
 * ✅ public/js/index.js (FRONTEND)
 * ===========================
 * Este archivo corre en el NAVEGADOR.
 *
 * Función principal:
 * - Conectarse al servidor Socket.io con io()
 * - Escuchar eventos del servidor (socket.on)
 * - Emitir eventos al servidor (socket.emit)
 * - Manipular el DOM (inputs, form, lista <ul>)
 *
 * IMPORTANCIA:
 * - Sin este archivo, no hay interactividad.
 * - Sin emit/on, no hay tiempo real.
 */

// ✅ Conexión al servidor de sockets (Socket.io client)
const socket = io();