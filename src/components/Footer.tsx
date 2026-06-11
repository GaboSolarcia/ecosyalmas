export default function Footer() {
  return (
    <footer className="bg-stone-900 dark:bg-black text-stone-400 py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-medium text-stone-300">Ecos y Almas</p>
        <p>Constelaciones Familiares · Costa Rica</p>
        <p>© {new Date().getFullYear()} Taty Garnaj</p>
      </div>
    </footer>
  );
}
