export default function Tooltip({ text, children }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-black text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
        {text}
      </span>
    </span>
  );
}