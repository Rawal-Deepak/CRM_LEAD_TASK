import LandingPage from "./pages/landing/LandingPage";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  );
}
