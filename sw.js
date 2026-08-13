/* =========================================
   AIK HUAT HARDWARE
   SIAN DIGITAL BUSINESS CARD
   SERVICE WORKER
========================================= */


/* =========================================
   CACHE VERSION
========================================= */

const CACHE_NAME =
    "sian-card-v3";


/* =========================================
   FILES TO CACHE
========================================= */

const ASSETS = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./aik-huat-logo.png",

    "./sian-profile.png",

    "./share-contact.png",

    "./favicon.svg",

    "./icon-192.svg",

    "./icon-512.svg",

    "./share-preview.svg"

];


/* =========================================
   INSTALL
========================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache => {

                        return cache.addAll(
                            ASSETS
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

            caches
                .keys()
                .then(
                    keys => {

                        return Promise.all(

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

        /* Only handle GET requests */

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        event.respondWith(

            caches
                .match(
                    event.request
                )

                .then(
                    cachedResponse => {

                        /* =========================
                           USE CACHE IF AVAILABLE
                        ========================== */

                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        /* =========================
                           OTHERWISE USE NETWORK
                        ========================== */

                        return fetch(
                            event.request
                        )

                        .then(
                            response => {

                                /*
                                 * Only cache valid
                                 * successful responses.
                                 */

                                if (
                                    !response ||
                                    response.status !== 200 ||
                                    response.type !==
                                    "basic"
                                ) {

                                    return response;

                                }


                                const responseClone =
                                    response.clone();


                                caches
                                    .open(
                                        CACHE_NAME
                                    )
                                    .then(
                                        cache => {

                                            cache.put(
                                                event.request,
                                                responseClone
                                            );

                                        }
                                    );


                                return response;

                            }
                        )

                        .catch(
                            () => {

                                /*
                                 * Offline fallback
                                 */

                                return caches.match(
                                    "./index.html"
                                );

                            }
                        );

                    }
                )

        );

    }
);