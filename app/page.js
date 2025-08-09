"use client"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function Home() {
  const [url, setUrl] = useState("")
  const router = useRouter()
  const [count, setcount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await fetch('/api/trending-products');
      const data = await res.json();
      setTrending(data);
    };
    fetchTrending();
  }, []);
  // const [query, setQuery] = useState('')


  // useEffect(() => {
  const checkAndUpdatePrices = async () => {
    try {
      const res = await fetch('/api/update-prices');
      const data = await res.json();
      console.log('✅ Price update response:', data.message);
    } catch (error) {
      console.error('❌ Error updating prices:', error);
    }
  };

  // checkAndUpdatePrices();
  // }, [count]);

  const handleSearch = async (e) => {
    e.preventDefault()
    if (url.trim()) {
      setLoading(true)

      const isLink = url.startsWith("http://") || url.startsWith("https://");

      if (isLink) {
        router.push(`/result?query=${encodeURIComponent(url.trim())}`);
      } else {
        // Agar keyword hai, toh related products fetch karo
        router.push(`/search?q=${url.trim()}`); // neeche display hoga
        // setLoading();
      }
    }
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white relative overflow-hidden">


      <div className="absolute top-20 -left-20 w-96 h-96 z-0 bg-purple-600 rounded-full blur-3xl opacity-30 animate-blob"></div>

      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* 🔹 Navbar */}
      {/* <nav className="flex items-center justify-between px-8 py-4 bg-gray-950">
        <h1 className="text-2xl font-bold text-indigo-400">📊 PriceTrackr</h1>
        <div className="space-x-4">
          <button className="hover:text-indigo-400">Home</button>
          <button className="hover:text-indigo-400">Deals</button>
          <button className="hover:text-indigo-400">About</button>
        </div>
      </nav> */}

      {/* 🔹 Search Section */}
      {/* <div className="text-center mt-10">
        <h2 className="text-3xl font-semibold mb-4">Search Price History</h2>
        <form
          onSubmit={handleSearch}
          className="flex justify-center gap-3"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Product Link or Name"
            className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 w-96 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold"
          >
            Search
          </button>
        </form>
        {loading && (
          <p className="mt-4 text-indigo-400 font-medium text-lg animate-pulse">Loading...</p>
        )}


        <p className="mt-3 text-gray-400 text-sm">
          Paste Amazon/Flipkart product URL or type product name to see price history
        </p>
        <div onClick={() => checkAndUpdatePrices()} className="mt-3 cursor-pointer text-gray-400 text-sm">Reload</div>
      </div> */}


<div className="text-center mt-10 mb-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
  <h2 className="text-xl sm:text-3xl font-semibold  mb-4">Search Price History</h2>

  <form
    onSubmit={handleSearch}
    className="flex flex-col z-10 sm:flex-row justify-center items-center gap-3"
  >
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="Enter Product Link or Name"
      className="px-4 py-3 rounded-lg z-10 bg-gray-800 border border-gray-700 w-full sm:w-[28rem] focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button
      type="submit"
      className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold w-full sm:w-auto"
    >
      Search
    </button>
  </form>

  {loading && (
    <p className="mt-4 text-indigo-400 font-medium text-lg animate-pulse">Loading...</p>
  )}

  <p className="mt-3 text-gray-400 text-sm">
    Paste Amazon/Flipkart product URL or type product name to see price history
  </p>
  {/* <div
    onClick={() => checkAndUpdatePrices()}
    className="mt-3 cursor-pointer text-gray-400 text-sm hover:underline"
  >
    Reload
  </div> */}
</div>


      {/* 🔹 Trending Products */}
      {/* <div className="px-10 mt-12 mx-24">
        <h3 className="text-xl font-semibold mb-4 text-red-400">🔥 Trending Deals</h3>

        <div className="grid grid-cols-2  md:grid-cols-4  gap-10">
          {trending.map((prod, idx) => (
            <Link  key={idx} className="z-10"  href={`/result?query=${encodeURIComponent(prod.productLink.trim())}`}><div className="bg-gray-800 z-10 rounded-xl shadow-md p-4 hover:scale-105 transition">
              <img src={prod.image} alt={prod.title} className="rounded-lg h-40 w-full object-contain mb-3" />
              <h4 className="font-semibold text-sm text-gray-400  line-clamp-2 break-words">{prod.title}</h4>
              <p className="text-yellow-600 text-sm">{prod.platform}</p>
              <p className="text-lg font-bold text-green-600">₹{prod.currentPrice}</p>
            </div></Link>
          ))}
        </div>
      </div> */}

      <div className="mt-12 px-4 mb-20 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <h3 className="text-xl font-semibold mb-4 text-red-400">🔥 Trending Deals</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {trending.map((prod, idx) => (
            <Link
              key={idx}
              href={`/result?query=${encodeURIComponent(prod.productLink.trim())}`}
              className="z-10"
            >
              <div className="bg-gray-800 rounded-xl shadow-md p-4 hover:scale-105 transition transform duration-300">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="rounded-lg h-40 w-full object-contain mb-3"
                />
                <h4 className="font-semibold text-sm text-gray-400 line-clamp-2 break-words">
                  {prod.title}
                </h4>
                <p className="text-yellow-600 text-sm">{prod.platform}</p>
                <p className="text-lg font-bold text-green-600">₹{prod.currentPrice}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>


    </div>
  )
}
