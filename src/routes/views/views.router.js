import { Router } from 'express';

const router = Router();

router.get('/vista',(req,res)=>{

  res.render('vista');  
});


router.get('/realtimeproducts', (req,res)=>{
res.render('realTimeProducts');

});


export default router;