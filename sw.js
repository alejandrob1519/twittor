// importando sw-utils.js
importScripts ('js/sw-utils.js');

//Lo 1ro que haremos en el SW, es crear las constantes
const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//lo 2do es crear nuestra APPSHELL
//asegurarse que esten bien escritas, porque si una falla no se podrá instalar el appshell
const APP_SHELL = [
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHEL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//3ro procederemso a instalar nuestroas appshels
self.addEventListener('install', e => {

    const cacheStaticPromesa = caches.open(STATIC_CACHE)
                              .then(cacheResp => cacheResp.addAll(APP_SHELL));

    const cacheInmutablePromesa = caches.open(INMUTABLE_CACHE)
                              .then(cacheResp => cacheResp.addAll(APP_SHEL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStaticPromesa, cacheInmutablePromesa]));  
});

//4to ahora haremos un proceso para borrar las caches antiguas
self.addEventListener('activate', e => {

    //verificamos si la version del cache actual es la misma que el anterior, de ser diferente se tiene que borrar el cache estatico.
    const respuesta = caches.keys().then(llavesCache => {

        llavesCache.forEach(llave => {
            if(llave !== STATIC_CACHE && llave.includes('static')){
                return caches.delete(llave);
            }
        });
    });

    e.waitUntil(respuesta);
});

//5to implementando estrategia cache con network fallback
self.addEventListener('fetch', e => {

    const respuesta =  caches.match(e.request).then(respCache => {
        
        if(respCache){
            return respCache;
        }else{
            //con este console, atraparé las peticiones secundarias que hace por ejemplo google fonts, las cuales no estan registradas en mi APP_SHEL_INMUTABLE
            //console.log(e.request.url);

            //ahora implementaremos parte de la estrategia del "dynamic cache" es decir del "network fallback".
            //ahora necesito hacer un fetch al recurso nuevo para almacenarlo en el cache dinamico
            return fetch(e.request).then( newResp => {

                //Actualizando el cache dinamico, para ello le paso los argumentos a la funcion que cree en 'js/sw-utils.js'
                return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });
        }
    });

    e.respondWith(respuesta);
});
