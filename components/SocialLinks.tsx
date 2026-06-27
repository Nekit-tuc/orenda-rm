type SocialLink = {
  name: string;
  href: string;
  icon: "telegram" | "instagram" | "tiktok";
};

const socialLinks: SocialLink[] = [
  {
    name: "Telegram",
    href: "https://t.me/orenda_rm",
    icon: "telegram",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/orenda_rm?igsh=anhvZGV5cDVxZTdi",
    icon: "instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@romaniuk_yevheniy?_r=1&_t=ZS-97YSgliz5AS",
    icon: "tiktok",
  },
];

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
        <path
          fill="currentColor"
          d="M21.94 4.16a1.35 1.35 0 0 0-1.5-.2L3.1 10.66c-.74.29-1.16.78-1.09 1.29.07.51.6.91 1.38 1.04l4.39.74 1.7 5.46c.16.51.52.86.96.92.43.07.88-.15 1.18-.57l2.37-3.34 4.52 3.34c.43.32.88.43 1.26.31.39-.13.67-.5.79-1.05l2.36-13.21c.1-.58-.06-1.1-.98-1.43ZM8.07 12.39l8.54-5.17c.21-.13.4.15.22.31l-7.05 6.31-.28 3.22-1.43-4.67Zm3.02 4.85.21-2.35 1.43 1.06-1.64 1.29Z"
        />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
        <path
          fill="currentColor"
          d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.77 2.1a1.32 1.32 0 1 1 0 2.64 1.32 1.32 0 0 1 0-2.64ZM12 7.15a4.85 4.85 0 1 1 0 9.7 4.85 4.85 0 0 1 0-9.7Zm0 2a2.85 2.85 0 1 0 0 5.7 2.85 2.85 0 0 0 0-5.7Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path
        fill="currentColor"
        d="M16.6 3c.32 2.62 1.78 4.18 4.4 4.35v3.08a7.47 7.47 0 0 1-4.33-1.33v6.25c0 3.16-2.15 5.65-5.73 5.65-3.42 0-5.94-2.25-5.94-5.42 0-3.64 3.16-6.08 6.77-5.35v3.25c-1.62-.51-3.58.15-3.58 1.96 0 1.3 1.08 2.17 2.49 2.17 1.53 0 2.45-.9 2.45-2.63V3h3.47Z"
      />
    </svg>
  );
}

export function SocialIconLink({
  link,
  className = "",
  iconClassName = "h-5 w-5",
}: {
  link: SocialLink;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.name}
      title={link.name}
      className={`group grid shrink-0 cursor-pointer place-items-center rounded-full border border-[#b89652]/40 bg-black/40 text-white shadow-[0_0_25px_rgba(184,150,82,0.18)] backdrop-blur transition-all duration-300 hover:scale-105 hover:border-[#d4af37] hover:text-[#d4af37] hover:shadow-[0_0_35px_rgba(212,175,55,0.35)] focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${className}`}
    >
      <span className={iconClassName}>
        <SocialIcon icon={link.icon} />
      </span>
    </a>
  );
}

export function HeaderSocialLinks() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {socialLinks.map((link) => (
        <SocialIconLink
          key={link.name}
          link={link}
          className="h-10 w-10"
          iconClassName="h-5 w-5"
        />
      ))}
    </div>
  );
}

export function DesktopSocialLinks() {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <a
        href={socialLinks[0].href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#caa854] px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(202,168,84,0.22)] transition-all duration-300 hover:scale-105 hover:bg-[#d8ba68] hover:shadow-[0_0_35px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-[#d8ba68] md:px-5"
      >
        <span className="h-4 w-4">
          <SocialIcon icon="telegram" />
        </span>
        Telegram
      </a>

      {socialLinks.slice(1).map((link) => (
        <SocialIconLink
          key={link.name}
          link={link}
          className="h-10 w-10"
          iconClassName="h-5 w-5"
        />
      ))}
    </div>
  );
}

export function FooterSocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3 md:justify-end">
      {socialLinks.map((link) => (
        <SocialIconLink
          key={link.name}
          link={link}
          className="h-12 w-12 sm:h-14 sm:w-14"
          iconClassName="h-6 w-6 sm:h-7 sm:w-7"
        />
      ))}
    </div>
  );
}
