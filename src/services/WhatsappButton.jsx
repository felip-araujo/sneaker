function WhatsAppButton() {
  const whatsappNumber = "5592981562259";

  const mensagem =
    "Olá! Vim pelo site e gostaria de falar com um consultor.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    mensagem
  )}`;

  return (
    <div
      className="
        fixed
        bottom-6
        right-6
        z-[9999]
        group
      "
    >
      {/* Tooltip */}
      <div
        className="
          absolute
          right-[72px]
          top-1/2
          -translate-y-1/2
          whitespace-nowrap
          bg-blue-950
          text-white
          text-sm
          font-semibold
          px-4
          py-2.5
          rounded-xl
          shadow-xl
          opacity-0
          invisible
          translate-x-2
          group-hover:opacity-100
          group-hover:visible
          group-hover:translate-x-0
          transition-all
          duration-300
          hidden
          md:block
        "
      >
        Fale conosco

        {/* Seta */}
        <span
          className="
            absolute
            right-[-5px]
            top-1/2
            -translate-y-1/2
            w-3
            h-3
            bg-blue-950
            rotate-45
          "
        />
      </div>

      {/* Efeito pulsante */}
      <span
        className="
          absolute
          inset-0
          rounded-full
          bg-green-500/30
          animate-ping
          pointer-events-none
        "
      />

      {/* Botão */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Fortiva Cred pelo WhatsApp"
        className="
          relative
          w-16
          h-16
          rounded-full
          bg-green-500
          text-white
          flex
          items-center
          justify-center
          shadow-2xl
          shadow-green-500/40
          hover:bg-green-600
          hover:scale-110
          transition-all
          duration-300
        "
      >
        {/* WhatsApp */}
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <path d="M16.004 3C8.83 3 3 8.73 3 15.79c0 2.49.74 4.92 2.14 6.99L3 29l6.42-2.05a13.15 13.15 0 0 0 6.58 1.77h.01C23.18 28.72 29 23 29 15.94 29 8.88 23.18 3 16.004 3Zm7.57 18.24c-.32.89-1.86 1.7-2.57 1.8-.66.1-1.5.14-2.42-.15-.56-.18-1.28-.42-2.2-.81-3.87-1.64-6.4-5.46-6.6-5.72-.2-.26-1.57-2.06-1.57-3.93 0-1.88.99-2.8 1.34-3.18.35-.38.76-.47 1.02-.47.25 0 .51 0 .73.01.24.01.55-.09.86.65.32.76 1.09 2.63 1.18 2.82.1.19.16.42.03.68-.13.26-.19.42-.38.65-.19.22-.4.5-.57.67-.19.19-.39.39-.17.77.22.38.98 1.6 2.1 2.59 1.44 1.27 2.66 1.66 3.04 1.85.38.19.6.16.83-.1.22-.26.95-1.1 1.2-1.48.25-.38.51-.32.86-.19.35.13 2.22 1.03 2.6 1.22.38.19.63.29.73.45.09.16.09.92-.23 1.81Z" />
        </svg>
      </a>
    </div>
  );
}

export default WhatsAppButton;