const CACHE='reloj-v30';
const FILES=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./assets/moon-surface.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(FILES.map(f=>cache.add(f).catch(()=>{})))));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
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
      if(request.mode==='navigate'){
        const page=await cache.match('./index.html');
        if(page)return page;
      }
      return Response.error();
    }
  })());
});
