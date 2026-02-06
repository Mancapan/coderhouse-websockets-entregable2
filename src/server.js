import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import apiRouter from './routes/api/index.router.js';
import viewsRouter from './routes/views/views.router.js';
import { __dirname } from './utils.js';



const app = express();
const PORT = 8080;
app.use(express.json());// solicitud en formato JSON (middleware)
app.use(express.urlencoded({extended:true}));// extended: true = permite objetos y arrays anidados



// proccess.cwd = entrega el directorio actual de trabajo
app.use(express.static(__dirname +'/public')); // archivos estaticos en carpeta public (queda accesible directamente desde el navegador.http://localhost:8080/index.html)



// Handlebars - Configuración CORRECTA
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: `${process.cwd()}/src/views/layouts` //  carpeta donde están los layouts (plantillas base)
}));
app.set('views',__dirname +'/views'); // Define la carpeta donde Express buscará todas las vistas/plantillas. archivos .handlebars (vista1.handlebars, productos.handlebars, etc.)
app.set('view engine', 'handlebars');


app.use('/api', apiRouter);
app.use('/',viewsRouter);

app.get('/prueba', (req,res)=>{
res.send(`Servidor corriento en puerto ${PORT}, para CODERHOUSE_ENTREGABLE2`);
});



const httpServer = app.listen(PORT,()=>{
  console.log(`Servidor corriento en puerto ${PORT}`); 
});



// creación del SOCKET



const socketServer = new Server(httpServer);
/**
 * Evento "connection"
 * - Se dispara cada vez que un cliente abre la página y conecta con io()
 */

socketServer.on('connection',(socket)=>{






  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });


}); // fin socket