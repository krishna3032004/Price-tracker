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
  const [loadingTrending, setLoadingTrending] = useState(true)

  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoadingTrending(true) // Loader on
        const res = await fetch('/api/trending-products');
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        console.error("❌ Error fetching trending:", err);
      } finally {
        setLoadingTrending(false) // Loader off
      }
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
        {/* Notice Box */}
        {/* <div className="mt-5 p-4 bg-yellow-900 border border-yellow-500 rounded-lg text-yellow-200 text-sm max-w-2xl mx-auto shadow-md">
          <strong>ℹ Note:</strong> If you search for a product link that is <span className="text-yellow-300 font-semibold">not in our database</span>,
          the first time loading may take up to <span className="text-yellow-300 font-semibold">1 minute</span> as we scrape the product details from its website.
          Once scraped, the product will be tracked automatically and will load instantly in future searches.
          
        </div> */}
        {show && 
        <div className="relative mt-5 p-4 bg-yellow-900 border border-yellow-500 rounded-lg text-yellow-200 text-xs sm:text-sm max-w-2xl mx-auto shadow-md">
          {/* Close Button */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-200 text-lg font-bold"
            aria-label="Close"
          >
            ✖
          </button>

          <strong>ℹ Note:</strong> If you search for a product link that is{" "}
          <span className="text-yellow-300 font-semibold">not in our database</span>,
          the first time loading may take up to{" "}
          <span className="text-yellow-300 font-semibold">1 minute</span> as we scrape the product details from its website.
          Once scraped, the product will be tracked automatically and will load instantly in future searches.
        </div>}
        {/* <div
          onClick={() => checkAndUpdatePrices()}
          className="mt-3 cursor-pointer text-gray-400 text-sm hover:underline"
        >
          Reload
        </div> */}
      </div>




      <div className="mt-12 px-4 mb-20 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <h3 className="text-xl font-semibold mb-4 text-red-400">🔥 Trending Deals</h3>
        {loadingTrending ? (
          <div className="flex justify-center py-10">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-t-4 t  border-gray-400 animate-spin"></div>

            </div>
          </div>

        ) : (
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
        )}
      </div>


    </div>
  )
}
