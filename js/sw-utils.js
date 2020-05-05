//esta funcion se encargará de guardar las peticiones secundarias en el cache dinanico

// dynamicCache: es donde yo lo quiero almacenar
// req: es la request o peticion (es lo que me estan pidiendo)
// res: es la response o respuesta que yo obtengo
function actualizarCacheDinamico(dynamicCache, req, res){

    //verifico si lo hizo (es decir, que la respuesta sea ok)
    if(res.ok){
        // si es ok=true, quiere decir que la respuesta tiene data 
        //y por ende tengo que almacenarla en la cache dinamica
        // le agregaré return a todas la promesas, porque todas las promesas deben retornar una respuesta siempre
        return caches.open(dynamicCache).then(cacheResp => {
            
            cacheResp.put(req, res.clone());
            return req.clone();
        });
    }else{
        //si entra aqui, ya no hay nada que hacer, porque no lo encontró ni en la cache ni de internet
        return res;
    }

}