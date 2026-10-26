const CACHE='reloj-v19';
const FILES=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./assets/moon-surface.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.delete('reloj-v8'),
    caches.delete('reloj-v9'),
    caches.delete('reloj-v10'),
    caches.delete('reloj-v11'),
    caches.delete('reloj-v12'),
    caches.delete('reloj-v13'),
    caches.delete('reloj-v14'),
    caches.delete('reloj-v15'),
    caches.delete('reloj-v16'),
    caches.delete('reloj-v17'),
    caches.delete('reloj-v18'),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;

  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok&&FILES.some(file=>new URL(file,self.registration.scope).pathname===url.pathname)){
        const cache=await caches.open(CACHE);
        cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      const cache=await caches.open(CACHE);
      const cached=await cache.match(request,{ignoreSearch:true});
      if(cached)return cached;
      if(request.mode==='navigate')return cache.match('./index.html');
      throw error;
    }
  })());
});
