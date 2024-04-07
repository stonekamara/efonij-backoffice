/** Bandeau défilant infini (marquee) — signature des sites récompensés. */
export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white py-5">
      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center text-xl font-medium tracking-tight text-slate-400 sm:text-2xl"
          >
            <span className="px-6">{item}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              className="text-fonij-accent"
            >
              <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
