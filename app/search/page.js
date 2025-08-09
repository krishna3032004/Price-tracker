// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// export default function SearchPage() {
//   const searchParams = useSearchParams();
  
//   // const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;
//   const query = searchParams.get('q');
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       const res = await fetch(`/api/search?q=${query}`);
//       const data = await res.json();
//       setResults(data);
//     };
//     if (query) fetchSearchResults();
//   }, [query]);

 

//   return (
//     <div className=" mx-4 md:mx-12 lg:mx-24 min-h-44">
//       <h1 className="text-sm sm:text-base lg:text-lg font-bold my-7">🔎 Search results for &quot;{query}&quot;</h1>
//       {results.length === 0 ? (
//         <p className='text-xs sm:text-sm lg:text-base text-gray-400'>No products found.</p>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           {results.map((prod, idx) => (
//             <Link key={idx} className="z-10" href={`/result?query=${encodeURIComponent(prod.productLink.trim())}`}>
//               <div className="bg-gray-800 z-10 rounded-xl shadow-md p-4 hover:scale-105 transition transform duration-300">
//                 <img
//                   src={prod.image}
//                   alt={prod.title}
//                   className="rounded-lg h-40 w-full object-contain mb-3"
//                 />
//                 <h4 className="font-semibold text-sm text-gray-400 line-clamp-2 break-words">
//                   {prod.title}
//                 </h4>
//                 <p className="text-yellow-600 text-sm">{prod.platform}</p>
//                 <p className="text-lg font-bold text-green-600">₹{prod.currentPrice}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
  
  
// }





'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  
    // const searchParams = typeof window !== 'undefined' ? useSearchParams() : null;
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
  
    useEffect(() => {
      const fetchSearchResults = async () => {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      };
      if (query) fetchSearchResults();
    }, [query]);
  
   
  
    return (
      <div className=" mx-4 md:mx-12 lg:mx-24 min-h-44">
        <h1 className="text-sm sm:text-base lg:text-lg font-bold my-7">🔎 Search results for &quot;{query}&quot;</h1>
        {results.length === 0 ? (
          <p className='text-xs sm:text-sm lg:text-base text-gray-400'>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {results.map((prod, idx) => (
              <Link key={idx} className="z-10" href={`/result?query=${encodeURIComponent(prod.productLink.trim())}`}>
                <div className="bg-gray-800 z-10 rounded-xl shadow-md p-4 hover:scale-105 transition transform duration-300">
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
    );
    
    
  }

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}