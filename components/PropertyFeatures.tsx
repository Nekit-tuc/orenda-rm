type PropertyFeaturesProps = {
  address: string;
  floor: number;
  floors: number;
  parking: boolean;
  heating: string;
  internet: boolean;
  security: boolean;
  bathroom: boolean;
};

export default function PropertyFeatures({
  address,
  floor,
  floors,
  parking,
  heating,
  internet,
  security,
  bathroom,
}: PropertyFeaturesProps) {
  const features = [
    {
      label: "Адреса",
      value: address,
    },
    {
      label: "Поверх",
      value: `${floor} з ${floors}`,
    },
    {
      label: "Парковка",
      value: parking ? "Є" : "Немає",
    },
    {
      label: "Опалення",
      value: heating,
    },
    {
      label: "Інтернет",
      value: internet ? "Є" : "Немає",
    },
    {
      label: "Охорона",
      value: security ? "Є" : "Немає",
    },
    {
      label: "Санвузол",
      value: bathroom ? "Є" : "Немає",
    },
  ];

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 shadow-[0_0_18px_rgba(184,150,82,0.05)] md:p-3">
      <h2 className="mb-2 text-sm font-extrabold md:text-base">Характеристики</h2>

      <div className="grid grid-cols-2 gap-1.5 md:gap-2">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="min-w-0 rounded-xl border border-white/10 bg-black/30 p-2 md:p-2.5"
          >
            <p className="truncate text-[10px] uppercase tracking-[0.07em] text-white/38">
              {feature.label}
            </p>
            <p className="mt-0.5 line-clamp-2 break-words text-xs font-semibold leading-snug text-white/82 md:text-sm">
              {feature.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
