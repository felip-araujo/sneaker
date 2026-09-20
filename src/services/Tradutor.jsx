import { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [idioma, setIdioma] = useState("pt");

  // =========================================
  // CARREGA GOOGLE TRANSLATE
  // =========================================

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "pt",
            includedLanguages: "pt,en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const scriptExistente = document.getElementById(
      "google-translate-script"
    );

    if (!scriptExistente) {
      const script = document.createElement("script");

      script.id = "google-translate-script";

      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.body.appendChild(script);
    } else {
      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        window.googleTranslateElementInit();
      }
    }
  }, []);

  // =========================================
  // ALTERA IDIOMA
  // =========================================

  const mudarIdioma = (lang) => {
    if (!lang) return;

    setIdioma(lang);

    localStorage.setItem("idiomaSite", lang);

    document.documentElement.lang =
      lang === "en" ? "en" : "pt-BR";

    const tentarTraduzir = () => {
      const selectGoogle =
        document.querySelector(".goog-te-combo");

      if (selectGoogle) {
        selectGoogle.value = lang;

        selectGoogle.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );

        return true;
      }

      return false;
    };

    if (tentarTraduzir()) return;

    let tentativas = 0;

    const interval = setInterval(() => {
      tentativas += 1;

      if (tentarTraduzir() || tentativas >= 20) {
        clearInterval(interval);
      }
    }, 300);
  };

  // =========================================
  // RESTAURA IDIOMA SALVO
  // =========================================

  useEffect(() => {
    const idiomaSalvo =
      localStorage.getItem("idiomaSite");

    if (
      idiomaSalvo === "pt" ||
      idiomaSalvo === "en"
    ) {
      setIdioma(idiomaSalvo);

      if (idiomaSalvo === "en") {
        setTimeout(() => {
          mudarIdioma("en");
        }, 1500);
      }
    }
  }, []);

  return (
    <>
      {/* GOOGLE TRANSLATE INTERNO */}

      <div
        id="google_translate_element"
        className="hidden"
      />

      {/* ========================================= */}
      {/* SELETOR VISUAL */}
      {/* ========================================= */}

      <div
        className="
          relative
          inline-flex
          w-full
          sm:w-auto
        "
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* ÍCONE */}

        <div
          className="
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2

            flex
            items-center
            justify-center

            pointer-events-none
            z-10

            text-[#6B7280]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="w-[18px] h-[18px]"
          >
            <circle cx="12" cy="12" r="9" />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.5 12h17"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.4 2.5 3.7 5.5 3.7 9S14.4 18.5 12 21"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3C9.6 5.5 8.3 8.5 8.3 12S9.6 18.5 12 21"
            />
          </svg>
        </div>

        {/* SELECT */}

        <select
          value={idioma}
          onChange={(e) =>
            mudarIdioma(e.target.value)
          }
          aria-label="Selecionar idioma"
          className="
            appearance-none

            w-full
            sm:w-auto

            min-w-[170px]
            h-[44px]

            pl-10
            pr-10

            rounded-[11px]

            bg-white
            hover:bg-[#F9FAFB]

            border
            border-[#D1D5DB]

            text-[#1F2937]
            text-[14px]
            font-medium

            shadow-[0_1px_2px_rgba(0,0,0,0.04)]

            outline-none

            focus:border-[#9CA3AF]
            focus:ring-4
            focus:ring-black/[0.04]

            transition-all
            duration-200

            cursor-pointer
          "
        >
          <option value="pt">
            Português
          </option>

          <option value="en">
            English
          </option>
        </select>

        {/* SETA */}

        <div
          className="
            absolute
            right-3.5
            top-1/2
            -translate-y-1/2

            pointer-events-none

            text-[#6B7280]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m7 10 5 5 5-5"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default GoogleTranslate;