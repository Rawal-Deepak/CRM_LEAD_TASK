export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-[#FAFBFC] dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src="/groweasy.svg"
            alt="GrowEasy Logo"
            className="w-5 h-5 object-contain"
          />
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
            GrowEasy
          </span>
        </div>
        <p className="text-theme-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} GrowEasy. AI-Powered CRM Import.
        </p>
      </div>
    </footer>
  );
}
