/* =========================================
   SIAN DIGITAL BUSINESS CARD
   SCRIPT
========================================= */


/* =========================================
   CARD URL
========================================= */

const CARD_URL =
    "https://torryweber.github.io/sian-business-card/";


/* =========================================
   CONTACT INFORMATION
========================================= */

const contact = {

    name:
        "Goh Chun Sian",

    company:
        "Aik Huat Hardware",

    title:
        "Sales Manager",

    mobile:
        "+60102907356",

    whatsapp:
        "+60102907356",

    email:
        "gcs@aikhuathardware.com",

    website:
        "https://aikhuathardware.com/",

    photo:
        "sian-profile.png"

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

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        window.toastTimer
    );

    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* =========================================
   ARRAY BUFFER → BASE64
========================================= */

function arrayBufferToBase64(buffer) {

    let binary = "";

    const bytes =
        new Uint8Array(buffer);

    const chunkSize = 0x8000;

    for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
    ) {

        const chunk =
            bytes.subarray(
                i,
                Math.min(
                    i + chunkSize,
                    bytes.length
                )
            );

        binary +=
            String.fromCharCode(
                ...chunk
            );

    }

    return btoa(binary);

}


/* =========================================
   FOLD VCF PHOTO DATA
========================================= */

function foldBase64(base64) {

    /*
       vCard allows long lines to be
       folded.

       Each continuation line starts
       with one space.
    */

    const lineLength = 72;

    const lines = [];

    for (
        let i = 0;
        i < base64.length;
        i += lineLength
    ) {

        lines.push(
            i === 0
                ? base64.substring(
                    i,
                    i + lineLength
                )
                : " " +
                  base64.substring(
                    i,
                    i + lineLength
                  )
        );

    }

    return lines.join("\r\n");

}


/* =========================================
   LOAD PROFILE PHOTO
========================================= */

async function getProfilePhoto() {

    try {

        const response =
            await fetch(
                contact.photo,
                {
                    cache:
                        "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load profile photo"
            );

        }


        const contentType =
            response.headers.get(
                "content-type"
            ) || "image/png";


        const buffer =
            await response.arrayBuffer();


        const base64 =
            arrayBufferToBase64(
                buffer
            );


        let imageType =
            "PNG";


        if (
            contentType
                .toLowerCase()
                .includes("jpeg") ||
            contentType
                .toLowerCase()
                .includes("jpg")
        ) {

            imageType =
                "JPEG";

        }


        return {

            type:
                imageType,

            base64:
                base64

        };

    } catch (error) {

        console.error(
            "Profile photo error:",
            error
        );

        return null;

    }

}


/* =========================================
   CREATE VCARD
========================================= */

async function createVCard() {

    /*
       Load Sian's profile picture
       and embed it directly into
       the contact file.
    */

    const photo =
        await getProfilePhoto();


    const lines = [

        "BEGIN:VCARD",

        "VERSION:3.0",

        /*
           IMPORTANT:

           FN is the complete name.

           This prevents iPhone from
           displaying:

           Chun Sian Goh

           or splitting first/last name.
        */

        "FN:Goh Chun Sian",

        "ORG:Aik Huat Hardware",

        "TITLE:Sales Manager",

        "TEL;TYPE=CELL:+60102907356",

        "TEL;TYPE=WORK,VOICE:+60102907356",

        "EMAIL;TYPE=WORK:gcs@aikhuathardware.com",

        "URL:https://aikhuathardware.com/"

    ];


    /* =====================================
       ADD PROFILE PHOTO
    ====================================== */

    if (photo) {

        lines.push(
            `PHOTO;ENCODING=b;TYPE=${photo.type}:${foldBase64(photo.base64)}`
        );

    }


    lines.push(
        "END:VCARD"
    );


    return lines.join(
        "\r\n"
    );

}


/* =========================================
   SAVE CONTACT
========================================= */

async function saveContact() {

    try {

        /*
           Let user know we're preparing
           the contact.
        */

        showToast(
            "Preparing contact..."
        );


        /*
           Create VCF with embedded
           profile picture.
        */

        const vcf =
            await createVCard();


        const blob =
            new Blob(
                [vcf],
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


        setTimeout(() => {

            URL.revokeObjectURL(
                url
            );

        }, 1000);


        showToast(
            "Contact card ready"
        );


    } catch (error) {

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
   SAVE CONTACT BUTTON
========================================= */

if (saveContactButton) {

    saveContactButton.addEventListener(
        "click",
        saveContact
    );

}


/* =========================================
   SHARE CARD
========================================= */

async function shareCard() {

    const shareData = {

        title:
            "Goh Chun Sian | Aik Huat Hardware",

        text:
            "Goh Chun Sian\n" +
            "Sales Manager\n" +
            "Aik Huat Hardware\n\n" +
            "Digital Business Card",

        url:
            CARD_URL

    };


    if (
        navigator.share
    ) {

        try {

            await navigator.share(
                shareData
            );

            return;

        } catch (error) {

            if (
                error &&
                error.name ===
                    "AbortError"
            ) {

                return;

            }

        }

    }


    /* =====================================
       FALLBACK
    ====================================== */

    try {

        await navigator.clipboard.writeText(
            CARD_URL
        );

        showToast(
            "Card link copied"
        );

    } catch {

        showToast(
            CARD_URL
        );

    }

}


/* =========================================
   SHARE BUTTON
========================================= */

if (shareButton) {

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
                    "./sw.js"
                )
                .catch(
                    error => {

                        console.log(
                            "Service worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}