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

    /*
     * IMPORTANT FOR iPHONE
     *
     * Apple Contacts does not always display
     * FN correctly when N is completely empty.
     *
     * Therefore:
     *
     * Family Name = EMPTY
     * Given Name  = Goh Chun Sian
     *
     * iPhone displays:
     *
     * Goh Chun Sian
     *
     * instead of:
     *
     * Chun Sian Goh
     *
     * There is NO family/last name.
     */

    const vcard = [

        "BEGIN:VCARD",

        "VERSION:3.0",

        "N:;Goh Chun Sian;;;",

        "FN:Goh Chun Sian",

        "ORG:Aik Huat Hardware",

        "TITLE:Sales Manager",

        "TEL;TYPE=CELL,VOICE:+60102907356",

        "EMAIL;TYPE=INTERNET:gcs@aikhuathardware.com",

        "URL:https://aikhuathardware.com/",

        "END:VCARD"

    ].join("\r\n");


    return vcard;

}


/* =========================================
   SAVE CONTACT
========================================= */

function saveContact() {

    try {

        const vcard =
            createVCard();


        console.log(
            "VCF:",
            vcard
        );


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


        link.style.display =
            "none";


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
            1500
        );


        showToast(
            "Contact ready to save"
        );

    }

    catch (error) {

        console.error(
            "Save Contact Error:",
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
            "Share Image Error:",
            error
        );


        return null;

    }

}


/* =========================================
   SHARE CARD
========================================= */

async function shareCard() {

    const shareText =
        "Goh Chun Sian — Sales Manager\nAik Huat Hardware";


    const imageFile =
        await getShareImageFile();


    /* =====================================
       SHARE IMAGE
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

            console.log(
                "Image sharing failed:",
                error
            );

        }

    }


    /* =====================================
       NORMAL SHARE
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
       COPY URL
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
            "Copy Error:",
            error
        );


        showToast(
            "Unable to share"
        );

    }

}


/* =========================================
   SAVE CONTACT EVENT
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
   SHARE EVENT
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
                            "Service Worker error:",
                            error
                        );

                    }
                );

        }
    );

}