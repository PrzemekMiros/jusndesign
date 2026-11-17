const isEnPath = /^\/en(\/|$)/.test(window.location.pathname);
const ccLang = isEnPath ? 'en' : 'pl';
const contactLink = ccLang === 'pl' ? '/kontakt' : '/en/contact';
const revisionLabel = ccLang === 'pl' ? 'Ustawienia cookies' : 'Cookie settings';

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
    label: revisionLabel
  },
    language: {
        default: ccLang,
        autoDetect: "document",
        translations: {
            pl: {
                consentModal: {
                    title: "Ta strona używa plików cookies",
                    description: "Używamy plików cookies do personalizowania treści i reklam, udostępniania funkcji mediów społecznościowych i analizowania ruchu na stronie.",
                    acceptAllBtn: "Akceptuj",
                    showPreferencesBtn: "Ustawienia"
                },
                preferencesModal: {
                    title: "Ustawienia plików cookies",
                    acceptAllBtn: "Akceptuj",
                    acceptNecessaryBtn: "Odrzuć",
                    savePreferencesBtn: "Zapisz ustawienia",
                    closeIconLabel: "Zamknij",
                    serviceCounterLabel: "Usługa|Usługi",
                    sections: [
                        {
                            title: "Wykorzystanie plików cookie",
                            description: "Ponieważ szanujemy Twoje prawo do prywatności, możesz nie zezwalać na niektóre rodzaje plików cookie. Kliknij nagłówki różnych kategorii, aby dowiedzieć się więcej i zmienić domyślne ustawienia."
                        },
                        {
                            title: "Niezbędne pliki cookie<span class=\"pm__badge\">Zawsze aktywne</span>",
                            description: "Te pliki cookies są niezbędne do działania witryny i nie można ich wyłączyć w naszych systemach. Zazwyczaj są one ustawiane wyłącznie w odpowiedzi na podejmowane przez Ciebie działania, które są równoznaczne z żądaniem usług, jak np. ustawienie preferencji dotyczących prywatności, logowanie czy wypełnianie formularzy. Te pliki cookie nie przechowują żadnych danych osobowych.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Funkcjonalne pliki cookie",
                            description: "Funkcjonalne pliki cookie pomagają realizować określone funkcje, takie jak udostępnianie zawartości witryny na platformach mediów społecznościowych, zbieranie opinii i inne funkcje stron trzecich.",
                            linkedCategory: "functionality"
                        },
 						{
                            title: "Analityczne pliki cookie",
                            description: "Analityczne pliki cookie pomagają nam zrozumieć, jak użytkownicy korzystają z witryny, wykrywać błędy i poprawiać doświadczenia odwiedzających.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Reklamowe pliki cookie",
                            description: "Reklamowe pliki cookie służą do dostarczania reklam, które są dla Ciebie istotne. Pomagają mierzyć skuteczność reklam, np. liczbę odwiedzin i kliknięć.",
                            linkedCategory: "marketing"
                        },
                        {
                            title: "Więcej informacji",
                            description: `W przypadku jakichkolwiek pytań związanych z polityką dotyczącą plików cookie, prosimy o <a class=\"cc__link\" href=\"${contactLink}\">kontakt</a>.`
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
                            description: `If you have any questions about our cookie policy, please <a class=\"cc__link\" href=\"${contactLink}\">contact us</a>.`
                        }
                    ]
                }
            }
        }
    }
});
