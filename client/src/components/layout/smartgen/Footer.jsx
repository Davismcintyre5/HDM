export default function Footer() {
  return (
    <footer className="bg-[var(--accent)] text-white/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-5 text-center">
        <p>SmartGen by HDM Technologies</p>
        <p className="mt-1">© {new Date().getFullYear()} HDM Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}