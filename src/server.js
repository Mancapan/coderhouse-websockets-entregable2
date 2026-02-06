import express from 'express';
import { engine } from 'express-handlebars';
import apiRouter from './routes/api/index.router.js';
import viewsRouter from './routes/views/views.router.js';
import { __dirname } from './utils.js';


const app = express();
const PORT = 8080;
app.use(express.json());// solicitud en formato JSON (middleware)
app.use(express.urlencoded({extended:true}));// extended: true = permite objetos y arrays anidados
app.use(express.urlencoded({extended:true}));// archivos estaticos en carpeta public (queda accesible directamente desde el navegador


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


app.listen(PORT,()=>{
  console.log(`Servidor corriento en puerto ${PORT}`); 
});