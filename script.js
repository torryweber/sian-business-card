/* =========================================
   AIK HUAT HARDWARE
   SIAN DIGITAL BUSINESS CARD
========================================= */


/* =========================================
   CARD URL
========================================= */

const CARD_URL =
    "https://torryweber.github.io/sian-business-card/";


/* =========================================
   SHARE IMAGE
========================================= */

const SHARE_IMAGE =
    "share-contact.png";


/* =========================================
   CONTACT INFORMATION
========================================= */

const contact = {

    name:
        "Goh Chun Sian",

    title:
        "Sales Manager",

    company:
        "Aik Huat Hardware",

    phone:
        "+60102907356",

    whatsapp:
        "60102907356",

    email:
        "gcs@aikhuathardware.com",

    website:
        "https://aikhuathardware.com/"

};


/* =========================================
   ELEMENTS
========================================= */

const saveContactButton =
    document.getElementById(
        "saveContactButton"
    );


const shareButton =
    document.getElementById(
        "shareButton"
    );


const toast =
    document.getElementById(
        "toast"
    );


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2000
        );

}


/* =========================================
   CREATE VCARD
========================================= */

function createVCard() {

    return [

        "BEGIN:VCARD",

        "VERSION:3.0",

        /*
         * IMPORTANT
         *
         * Keep the complete name together.
         *
         * N format:
         *
         * Family Name;
         * Given Name;
         * Additional Name;
         * Prefix;
         * Suffix
         *
         * We intentionally put the complete
         * name in the Family Name field so
         * iPhone does not rearrange it.
         */

        "N:Goh Chun Sian;;;;",

        /*
         * FN controls the displayed name.
         */

        "FN:Goh Chun Sian",

        /*
         * Company
         */

        "ORG:Aik Huat Hardware",

        /*
         * Job Title
         */

        "TITLE:Sales Manager",

        /*
         * Mobile
         */

        "TEL;TYPE=CELL,VOICE:+60102907356",

        /*
         * Email
         */

        "EMAIL;TYPE=INTERNET:gcs@aikhuathardware.com",

        /*
         * Website
         */

        "URL:https://aikhuathardware.com/",

        /*
         * End VCard
         */

        "END:VCARD"

    ].join("\r\n");

}


/* =========================================
   SAVE CONTACT
========================================= */

function saveContact() {

    try {

        const vcard =
            createVCard();


        const blob =
            new Blob(
                [vcard],
                {
                    type:
                        "text/vcard;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "Goh-Chun-Sian.vcf";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        showToast(
            "Contact ready to save"
        );

    }

    catch (error) {

        console.error(
            "Save contact error:",
            error
        );


        showToast(
            "Unable to create contact"
        );

    }

}


/* =========================================
   LOAD SHARE IMAGE
========================================= */

async function getShareImageFile() {

    try {

        const response =
            await fetch(
                SHARE_IMAGE,
                {
                    cache:
                        "no-cache"
                }
            );


        if (
            !response.ok
        ) {

            return null;

        }


        const blob =
            await response.blob();


        return new File(

            [blob],

            "Goh-Chun-Sian.png",

            {
                type:
                    blob.type ||
                    "image/png"
            }

        );

    }

    catch (error) {

        console.error(
            "Share image error:",
            error
        );


        return null;

    }

}


/* =========================================
   SHARE DIGITAL CARD
========================================= */

async function shareCard() {


    /*
     * Share text
     */

    const shareText =
        "Goh Chun Sian — Sales Manager\nAik Huat Hardware";


    /*
     * Load contact picture
     */

    const imageFile =
        await getShareImageFile();


    /* =====================================
       SHARE IMAGE + URL
    ====================================== */

    if (

        imageFile &&

        navigator.share &&

        navigator.canShare &&

        navigator.canShare({
            files:
                [imageFile]
        })

    ) {

        try {

            await navigator.share({

                title:
                    "Goh Chun Sian | Sales Manager",

                text:
                    `${shareText}\n${CARD_URL}`,

                files:
                    [imageFile]

            });


            return;

        }

        catch (error) {

            /*
             * User pressed Cancel
             */

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

            console.error(
                "Image share error:",
                error
            );

        }

    }


    /* =====================================
       NORMAL WEB SHARE
    ====================================== */

    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "Goh Chun Sian | Sales Manager",

                text:
                    shareText,

                url:
                    CARD_URL

            });


            return;

        }

        catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    /* =====================================
       COPY URL FALLBACK
    ====================================== */

    try {

        await navigator.clipboard.writeText(
            CARD_URL
        );


        showToast(
            "Card link copied"
        );

    }

    catch (error) {

        console.error(
            "Copy error:",
            error
        );


        showToast(
            "Unable to share"
        );

    }

}


/* =========================================
   SAVE CONTACT BUTTON
========================================= */

if (
    saveContactButton
) {

    saveContactButton.addEventListener(
        "click",
        saveContact
    );

}


/* =========================================
   SHARE BUTTON
========================================= */

if (
    shareButton
) {

    shareButton.addEventListener(
        "click",
        shareCard
    );

}


/* =========================================
   SERVICE WORKER
========================================= */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "sw.js"
                )
                .then(
                    registration => {

                        console.log(
                            "Service Worker registered:",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Service Worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}