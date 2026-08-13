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
   CONTACT INFORMATION
========================================= */

const contact = {

    firstName:
        "Chun Sian",

    lastName:
        "Goh",

    fullName:
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
            1800
        );

}


/* =========================================
   CREATE VCARD
========================================= */

function createVCard() {

    const vcard = [

        "BEGIN:VCARD",

        "VERSION:3.0",

        `N:${contact.lastName};${contact.firstName};;;`,

        `FN:${contact.fullName}`,

        `ORG:${contact.company}`,

        `TITLE:${contact.title}`,

        `TEL;TYPE=CELL,VOICE:${contact.phone}`,

        `EMAIL;TYPE=INTERNET:${contact.email}`,

        `URL:${contact.website}`,

        "END:VCARD"

    ].join("\r\n");


    return vcard;

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
   SHARE DIGITAL CARD
========================================= */

async function shareCard() {

    const shareData = {

        title:
            "Goh Chun Sian | Sales Manager",

        text:
            "Goh Chun Sian — Sales Manager\nAik Huat Hardware",

        url:
            CARD_URL

    };


    try {

        if (
            navigator.share
        ) {

            await navigator.share(
                shareData
            );

        }

        else {

            await navigator.clipboard.writeText(
                CARD_URL
            );

            showToast(
                "Card link copied"
            );

        }

    }

    catch (error) {

        if (
            error.name !==
            "AbortError"
        ) {

            showToast(
                "Unable to share"
            );

        }

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
                    () => {}
                );

        }
    );

}