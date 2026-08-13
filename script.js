/* =========================================
   AIK HUAT HARDWARE
   GOH CHUN SIAN
   DIGITAL BUSINESS CARD
========================================= */

const CARD_URL =
    "https://torryweber.github.io/sian-business-card/";


/* =========================================
   CONTACT INFORMATION
========================================= */

const contact = {

    name: "Goh Chun Sian",

    company: "Aik Huat Hardware",

    title: "Sales Manager",

    mobile: "+60102907356",

    whatsapp: "+60102907356",

    email: "gcs@aikhuathardware.com",

    website: "https://aikhuathardware.com/",

    photo: "sian-profile.png"

};


/* =========================================
   ELEMENTS
========================================= */

const saveContactButton =
    document.getElementById("saveContactButton");

const shareButton =
    document.getElementById("shareButton");

const toast =
    document.getElementById("toast");


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

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
            String.fromCharCode(...chunk);
    }

    return btoa(binary);
}


/* =========================================
   FOLD PHOTO DATA
========================================= */

function foldBase64(base64) {

    const lineLength = 72;

    const result = [];

    for (
        let i = 0;
        i < base64.length;
        i += lineLength
    ) {

        const part =
            base64.substring(
                i,
                i + lineLength
            );

        if (i === 0) {

            result.push(part);

        } else {

            result.push(" " + part);

        }
    }

    return result.join("\r\n");
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
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Profile photo could not be loaded"
            );
        }

        const contentType =
            response.headers.get(
                "content-type"
            ) || "image/png";

        const buffer =
            await response.arrayBuffer();

        const base64 =
            arrayBufferToBase64(buffer);

        let imageType = "PNG";

        if (
            contentType
                .toLowerCase()
                .includes("jpeg") ||
            contentType
                .toLowerCase()
                .includes("jpg")
        ) {

            imageType = "JPEG";
        }

        return {
            type: imageType,
            base64: base64
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

    const photo =
        await getProfilePhoto();


    /*
       IMPORTANT FOR iPHONE

       vCard N format:

       N:Family;Given;Additional;Prefix;Suffix

       We use:

       Family = Goh
       Given  = Chun Sian

       FN remains the complete display name.

       This makes Apple Contacts reliably
       recognise the contact name.
    */

    const lines = [

        "BEGIN:VCARD",

        "VERSION:3.0",

        "PRODID:-//Aik Huat Hardware//Digital Card//EN",

        "FN:Goh Chun Sian",

        "N:Goh;Chun Sian;;;",

        "ORG:Aik Huat Hardware",

        "TITLE:Sales Manager",

        "TEL;TYPE=CELL,VOICE:+60102907356",

        "EMAIL;TYPE=WORK:gcs@aikhuathardware.com",

        "URL:https://aikhuathardware.com/",

        "REV:" + new Date().toISOString(),

        "END:VCARD"

    ];


    /* =====================================
       EMBED PROFILE PHOTO
    ====================================== */

    if (photo) {

        /*
           Insert PHOTO before END:VCARD.
        */

        lines.splice(
            lines.length - 1,
            0,
            `PHOTO;ENCODING=b;TYPE=${photo.type}:${foldBase64(photo.base64)}`
        );
    }


    /*
       CRLF is important for vCard/iOS.
    */

    return lines.join("\r\n");
}


/* =========================================
   SAVE CONTACT
========================================= */

async function saveContact() {

    try {

        showToast(
            "Preparing contact..."
        );


        const vcf =
            await createVCard();


        /*
           UTF-8 vCard file
        */

        const blob =
            new Blob(
                [vcf],
                {
                    type:
                        "text/vcard;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "Goh-Chun-Sian.vcf";


        link.style.display = "none";


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        setTimeout(() => {

            URL.revokeObjectURL(url);

        }, 2000);


        showToast(
            "Goh Chun Sian contact ready"
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
                error.name === "AbortError"
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
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .catch(error => {

                    console.log(
                        "Service worker error:",
                        error
                    );

                });

        }
    );
}