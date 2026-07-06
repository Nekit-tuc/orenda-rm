import Link from "next/link";

type SubmitPropertyButtonProps = {
  className?: string;
  label?: string;
};

export default function SubmitPropertyButton({
  className = "",
  label = "Запропонувати обʼєкт",
}: SubmitPropertyButtonProps) {
  return (
    <Link
      href="/propose-property"
      className={
        className ||
        "inline-flex items-center justify-center rounded-2xl border border-[#b89652]/45 bg-black/35 px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_0_20px_rgba(184,150,82,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#b89652]/12 hover:text-[#d8ba68] focus:outline-none focus:ring-2 focus:ring-[#d8ba68]"
      }
    >
      {label}
    </Link>
  );
}
