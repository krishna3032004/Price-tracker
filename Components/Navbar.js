import Link from "next/link";

export default function Navbar() {
    return (
      <nav className=" w-full z-50 bg-gray-900/50 backdrop-blur-md border-b border-gray-700/30 shadow-md">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          
          {/* ✅ Logo */}
          <Link href={'/'}><h1 className="text-xl sm:text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition">
            📊 PriceTrackr
          </h1></Link>
  
          {/* ✅ Links */}
          <div className="space-x-6 hidden sm:block">
            <Link href={'/'}><button className="text-gray-200 hover:text-indigo-400 cursor-pointer transition font-medium">Home</button></Link>
            <button className="text-gray-200 hover:text-indigo-400 transition font-medium">Deals</button>
            <button className="text-gray-200 hover:text-indigo-400 transition font-medium">About</button>
          </div>
  
          {/* ✅ Optional CTA Button */}
          {/* <button className="ml-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition">
            🔔 Track Price
          </button> */}
        </div>
      </nav>
    );
  }
  