// "use client"
// import { updateProductPrices } from "@/cron/updatePrices";


export default function Footer() {
    return (
      <footer className="bg-gray-900/50 backdrop-blur-md border-t  border-gray-700/30 mt-20">
        
        {/* 🔹 Top Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* ✅ Brand & Description */}
          <div>
            <h2 className="sm:text-xl text-lg font-bold text-indigo-400">📊 PriceTrackr</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              PriceTrackr helps you monitor and track product prices on Amazon & Flipkart.  
              Stay updated on price drops and get notified instantly.
            </p>
          </div>
  
          {/* ✅ Quick Links */}
          <div>
            <h3 className="sm:text-lg text-base font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Today’s Deals</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Business & API</a></li>
            </ul>
          </div>
  
          {/* ✅ Legal Section */}
          <div>
            <h3 className="sm:text-lg text-base font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Pricing Disclaimer</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Disclaimer</a></li>
              {/* <li><div onClick={()=> updateProductPrices()} className="hover:text-amber-500 transition cursor-pointer">Reload</div></li> */}
            </ul>
          </div>
  
          {/* ✅ Note Section */}
          <div>
            <h3 className="sm:text-lg text-base font-semibold text-white mb-3">Reload</h3>
            <p className="text-sm text-gray-300">
              Prices & offers may vary by seller or location.  
              We only track prices for information purposes — users must verify before purchase.
            </p>
          </div>
        </div>
  
        {/* 🔻 Bottom Bar */}
        <div className="text-center py-4 bg-gray-900/70 border-t border-gray-700/30 text-gray-400 text-xs sm:text-sm">
          © 2021-2025 PriceTrackr — <span className="text-red-400">Proudly made in India ❤️</span>
        </div>
      </footer>
    );
  }
  