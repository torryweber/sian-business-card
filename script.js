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
   TOAST
========================================= */

function showToast(message) {

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
         * IMPORTANT:
         * Use FN only.
         *
         * This prevents the name from being
         * split into First Name / Last Name.
         */

        `FN:${contact.name}`,

        `ORG:${contact.company}`,

        `TITLE:${contact.title}`,

        `TEL;TYPE=CELL,VOICE:${contact.phone}`,

        `EMAIL;TYPE=INTERNET:${contact.email}`,

        `URL:${contact.website}`,

        "END:VCARD"

    ].join("\r\n");

}


/* =========================================
   SAVE CONTACT
========================================= */

function saveContact() {

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
   SHARE DIGITAL CARD + IMAGE
========================================= */

async function shareCard() {

    const shareText =
        "Goh Chun Sian — Sales Manager\nAik Huat Hardware";


    const imageFile =
        await getShareImageFile();


    /* =====================================
       SHARE WITH IMAGE
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

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    /* =====================================
       NORMAL SHARE FALLBACK
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
       COPY LINK FALLBACK
    ====================================== */

    try {

        await navigator.clipboard.writeText(
            CARD_URL
        );


        showToast(
            "Card link copied"
        );

    }

    catch {

        showToast(
            "Unable to share"
        );

    }

}


/* =========================================
   BUTTON EVENTS
========================================= */

saveContactButton.addEventListener(
    "click",
    saveContact
);


shareButton.addEventListener(
    "click",
    shareCard
);


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
                .catch(
                    error => {

                        console.log(
                            "Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}