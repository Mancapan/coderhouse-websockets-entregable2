import express from 'express';


const app = express();
const PORT = 8080;
app.use(express.json());// solicitud en formato JSON (middleware)
app.use(express.urlencoded({extended:true}));// extended: true = permite objetos y arrays anidados






app.listen(PORT,()=>{
  console.log(`Servidor corriento en puerto ${PORT}`); 
});