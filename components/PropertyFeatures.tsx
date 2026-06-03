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
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 md:mt-10 md:rounded-3xl md:p-6">
      <h2 className="mb-5 text-xl font-bold md:text-2xl">Характеристики</h2>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="rounded-xl border border-white/10 bg-black/30 p-4 md:rounded-2xl"
          >
            <p className="text-sm text-white/40">{feature.label}</p>
            <p className="mt-1 font-medium">{feature.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
