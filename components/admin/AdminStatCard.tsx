type AdminStatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export default function AdminStatCard({
  label,
  value,
  helper,
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-blue-950/10 backdrop-blur-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 break-words text-3xl font-bold text-white">{value}</p>
      {helper && <p className="mt-2 text-xs text-blue-200/70">{helper}</p>}
    </div>
  );
}
