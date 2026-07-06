import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProposePropertyForm from "@/components/ProposePropertyForm";

export const metadata = {
  title: "Запропонувати обʼєкт | Orenda RM",
  description:
    "Запропонуйте свій обʼєкт нерухомості для перевірки командою Orenda RM.",
};

const rules = [
  "Ваш обʼєкт надходить на перевірку. Після розгляду ми звʼяжемося з вами та повідомимо про подальші кроки.",
  "Вказуйте лише достовірну інформацію. Ми можемо перевіряти надані дані перед публікацією.",
  "Для земельних ділянок кадастровий номер та фотографія кадастрового плану є обовʼязковими.",
  "Надсилати заявку може лише власник обʼєкта або його уповноважений представник.",
  "Додавайте реальні фотографії обʼєкта. Чим більше якісних фото, тим швидше ми зможемо оцінити пропозицію.",
  "Ми використовуємо ваш телефон лише для звʼязку щодо цього обʼєкта.",
  "Адміністрація Orenda RM залишає за собою право відмовити у розміщенні без пояснення причин.",
];

export default function ProposePropertyPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#020202] text-white">
      <Header />

      <section className="relative overflow-hidden border-b border-white/10 px-4 py-10 sm:px-6 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,150,82,0.2),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b89652]">
            Orenda RM
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Запропонувати свій обʼєкт
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
            Ми розглядаємо кожну заявку індивідуально. Перед додаванням вашого
            обʼєкта уважно ознайомтеся з правилами.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        <ProposePropertyForm rules={rules} />
      </section>

      <Footer />
    </main>
  );
}
