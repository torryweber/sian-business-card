/* =========================================
   SIAN DIGITAL BUSINESS CARD
   SERVICE WORKER
========================================= */

const CACHE_NAME =
    "sian-card-v1";


const ASSETS = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./assets/aik-huat-logo.png",

    "./assets/sian-profile.png",

    "./assets/favicon.svg",

    "./assets/icon-192.svg",

    "./assets/icon-512.svg",

    "./assets/share-preview.svg"

];


/* =========================================
   INSTALL
========================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    cache =>
                        cache.addAll(
                            ASSETS
                        )
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
                    keys =>

                        Promise.all(

                            keys
                                .filter(
                                    key =>
                                        key !==
                                        CACHE_NAME
                                )
                                .map(
                                    key =>
                                        caches.delete(
                                            key
                                        )
                                )

                        )

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
            event.request.method !==
            "GET"
        ) {

            return;

        }


        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                cachedResponse => {

                    if (
                        cachedResponse
                    ) {

                        return cachedResponse;

                    }


                    return fetch(
                        event.request
                    )
                    .then(
                        response => {

                            const copy =
                                response.clone();


                            caches.open(
                                CACHE_NAME
                            )
                            .then(
                                cache => {

                                    cache.put(
                                        event.request,
                                        copy
                                    );

                                }
                            );


                            return response;

                        }
                    )
                    .catch(
                        () =>
                            caches.match(
                                "./index.html"
                            )
                    );

                }
            )

        );

    }
);