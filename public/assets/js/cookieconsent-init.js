
const isPlPath = /^\/pl(\/|$)/.test(window.location.pathname);
const ccLang = isPlPath ? 'pl' : 'en';

document.documentElement.classList.add('cc--darkmode');
document.documentElement.lang = ccLang;

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "cloud",
            position: "bottom right",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        functionality: {},
        analytics: {},
        marketing: {}
    },
      revisionButton: {
    enabled: true,
    position: "left",
    label: "Ustawienia cookies dzTS"
  },
    language: {
        default: ccLang,
        autoDetect: "document",
        translations: {
            pl: {
                consentModal: {
                    title: "Ta strona uLLywa plikAlw cookies",
                    description: "ULLywamy plikAlw cookies do personalizowania treL�ci i reklam, udostępniania funkcji mediAlw spoL�ecznoL�ciowych i analizowania ruchu na stronie. ",
                    acceptAllBtn: "Akceptuj",
                    showPreferencesBtn: "Ustawienia"
                },
                preferencesModal: {
                    title: "Ustawienia plikAlw cookies",
                    acceptAllBtn: "Akceptuj",
                    acceptNecessaryBtn: "Odrzuć",
                    savePreferencesBtn: "Zapisz ustawienia",
                    closeIconLabel: "Zamknij",
                    serviceCounterLabel: "UsL�uga|UsL�ugi",
                    sections: [
                        {
                            title: "Wykorzystanie plikAlw cookie",
                            description: "PoniewaLL szanujemy Twoje prawo do prywatnoL�ci, moLLesz nie zezwalać na niektAlre rodzaje plikAlw cookie. Kliknij nagL�Alwki rAlLLnych kategorii, aby dowiedzieć się więcej i zmienić domyL�lne ustawienia."
                        },
                        {
                            title: "Niezbędne pliki cookie<span class=\"pm__badge\">Zawsze aktywne</span>",
                            description: "Te pliki cookies są niezbędne do dziaL�ania witryny i nie moLLna ich wyL�ączyć w naszych systemach. Zazwyczaj są one ustawiane wyL�ącznie w odpowiedzi na podejmowane przez Ciebie dziaL�ania, ktAlre są rAlwnoznaczne z LLądaniem usL�ug, jak np. ustawienie preferencji dotyczących prywatnoL�ci, logowanie czy wypeL�nianie formularzy. Te pliki cookie nie przechowują LLadnych danych osobowych.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Funkcjonalne pliki cookie",
                            description: "Funkcjonalne pliki cookie pomagają realizować okreL�lone funkcje, takie jak udostępnianie zawartoL�ci witryny na platformach mediAlw spoL�ecznoL�ciowych, zbieranie opinii i inne funkcje stron trzecich.",
                            linkedCategory: "functionality"
                        },
 						{
                            title: "Analityczne pliki cookie",
                            description: "Te pliki cookie mogą być ustawiane za poL�rednictwem naszej witryny przez naszych partnerAlw reklamowych. Mogą być one wykorzystywane przez te firmy do tworzenia profilu Twoich zainteresowaL� i wyL�wietlania odpowiednich reklam w innych witrynach.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Reklamowe pliki cookie",
                            description: "Pliki cookie dotyczące wydajnoL�ci sL�uLLą do zrozumienia i analizy kluczowych wskaLsnikAlw wydajnoL�ci witryny, co pomaga zapewnić odwiedzającym lepsze doL�wiadczenia uLLytkownika.",
                            linkedCategory: "marketing"
                        },
                        {
                            title: "Więcej informacji",
                            description: "W przypadku jakichkolwiek pytaL� związanych z polityką dotyczącą plikAlw cookie, prosimy o <a class=\"cc__link\" href=\"/kontakt\">kontakt</a>."
                        }
                    ]
                }
            },
            en: {
                consentModal: {
                    title: "This website uses cookies",
                    description: "We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic.",
                    acceptAllBtn: "Accept",
                    showPreferencesBtn: "Settings"
                },
                preferencesModal: {
                    title: "Cookie settings",
                    acceptAllBtn: "Accept",
                    acceptNecessaryBtn: "Reject",
                    savePreferencesBtn: "Save settings",
                    closeIconLabel: "Close",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Cookie usage",
                            description: "Because we respect your right to privacy, you can choose not to allow some types of cookies. Click the different category headings to learn more and change the default settings."
                        },
                        {
                            title: "Necessary cookies<span class=\"pm__badge\">Always active</span>",
                            description: "These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. These cookies do not store any personally identifiable information.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Functional cookies",
                            description: "Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features.",
                            linkedCategory: "functionality"
                        },
                        {
                            title: "Analytics cookies",
                            description: "Analytics cookies help us understand how visitors interact with the website, discover errors, and provide a better user experience.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Marketing cookies",
                            description: "Marketing cookies are used to deliver advertisements that are relevant to you. These cookies help provide information on metrics such as the number of visitors and ad click-through rate.",
                            linkedCategory: "marketing"
                        },
                        {
                            title: "More information",
                            description: "If you have any questions about our cookie policy, please <a class=\"cc__link\" href=\"/kontakt\">contact us</a>."
                        }
                    ]
                }
            }
        }
    }
});
