
document.documentElement.classList.add('cc--darkmode');

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
    label: "Ustawienia cookies 🍪"
  },
    language: {
        default: "pl",
        autoDetect: "browser",
        translations: {
            pl: {
                consentModal: {
                    title: "Ta strona używa plików cookies",
                    description: "Używamy plików cookies do personalizowania treści i reklam, udostępniania funkcji mediów społecznościowych i analizowania ruchu na stronie. ",
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
                            description: "Te pliki cookie mogą być ustawiane za pośrednictwem naszej witryny przez naszych partnerów reklamowych. Mogą być one wykorzystywane przez te firmy do tworzenia profilu Twoich zainteresowań i wyświetlania odpowiednich reklam w innych witrynach.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Reklamowe pliki cookie",
                            description: "Pliki cookie dotyczące wydajności służą do zrozumienia i analizy kluczowych wskaźników wydajności witryny, co pomaga zapewnić odwiedzającym lepsze doświadczenia użytkownika.",
                            linkedCategory: "marketing"
                        },
                        {
                            title: "Więcej informacji",
                            description: "W przypadku jakichkolwiek pytań związanych z polityką dotyczącą plików cookie, prosimy o <a class=\"cc__link\" href=\"/kontakt\">kontakt</a>."
                        }
                    ]
                }
            }
        }
    }
});