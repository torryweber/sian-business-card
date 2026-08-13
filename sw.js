const CACHE_NAME =
    "sian-card-v4";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./favicon.svg",

    "./icon-192.svg",

    "./icon-512.svg",

    "./aik-huat-logo.png",

    "./sian-profile.png",

    "./whatsapp-logo.svg",

    "./share-preview.png"

];


/* =========================================
   INSTALL
========================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(
                cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );

        self.skipWaiting();
    }
);


/* =========================================
   ACTIVATE
========================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    name =>
                                        name !==
                                        CACHE_NAME
                                )
                                .map(
                                    name =>
                                        caches.delete(
                                            name
                                        )
                                )

                        );

                    }
                )

        );

        self.clients.claim();
    }
);


/* =========================================
   FETCH
========================================= */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !== "GET"
        ) {

            return;
        }


        event.respondWith(

            caches.match(
                event.request
            ).then(
                cachedResponse => {

                    if (cachedResponse) {

                        return cachedResponse;
                    }


                    return fetch(
                        event.request
                    ).then(
                        response => {

                            if (
                                !response ||
                                response.status !== 200 ||
                                response.type ===
                                    "opaque"
                            ) {

                                return response;
                            }


                            const responseClone =
                                response.clone();


                            caches.open(
                                CACHE_NAME
                            ).then(
                                cache => {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                }
                            );


                            return response;
                        }
                    );

                }
            )

        );
    }
);