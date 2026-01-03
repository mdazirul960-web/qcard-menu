export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-extrabold text-qcard-purple mb-4">QCard</h1>
      <p className="text-xl text-gray-600 mb-8">Supercharge your Cafe Menu 🚀</p>
      
      <div className="space-y-4 w-full max-w-xs">
        <a href="/urban" className="block w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg">
          View Demo: Urban Roastery
        </a>
        <a href="/demo" className="block w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold">
          View Demo: Burger Joint
        </a>
      </div>
    </div>
  );
}