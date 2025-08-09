"use client";



import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";
import { format, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";




const ResultPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [product, setProduct] = useState(null);
    const [expandedHistory, setexpandedHistory] = useState(null);

    const [filteredHistory, setFilteredHistory] = useState([]);
    const [selectedRange, setSelectedRange] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [PredictedHistory, setPredictedHistory] = useState([])
    const [selectedDays, setSelectedDays] = useState(null);

    const [showAlertForm, setShowAlertForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [alertMessage, setAlertMessage] = useState(""); // message store karne ke liye


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/price-alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    productId: product._id
                    // productTitle: product.title,
                    // productLink: product.productLink,
                    // currentPrice: product.currentPrice
                })
            });

            const data = await res.json();
            if (res.ok) {
                // alert("✅ Price alert set successfully!");
                setAlertMessage(data.message || "✅ Price alert set successfully!");
                setShowAlertForm(false);
                setFormData({ name: "", email: "" });
            } else {
                setAlertMessage(data.error || "❌ Failed to set alert!");
                setShowAlertForm(false);
            }
        } catch (error) {
            console.error(error);
            setAlertMessage("⚠️ Something went wrong!");
        }
    };


    const calculateDropChances = (days) => {
        console.log(days)
        console.log(PredictedHistory)
        if (!PredictedHistory || PredictedHistory.length === 0 || !product) return 0;

        const selectedPredictions = PredictedHistory.slice(0, days);
        console.log(selectedPredictions)
        const drops = selectedPredictions.filter(p => p.predictedPrice < product.currentPrice);
        console.log(drops)
        return Math.round((drops.length / days) * 100);
    };


    // useEffect(() => {
    //     if (!expandedHistory || expandedHistory.length === 0) return;

    //     const fetchPrediction = async () => {
    //         try {
    //             const res = await fetch("http://localhost:8000/predict", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     history: expandedHistory
    //                 }),
    //             });

    //             const predictionData = await res.json();
    //             const formattedPredictionData = predictionData.map(item => ({
    //                 date: item.ds,
    //                 predictedPrice: Math.round(item.yhat),  // Round if you want clean prices
    //             }));
    //             console.log(formattedPredictionData)
    //             setPredictedHistory(formattedPredictionData);  // <- store separately
    //         } catch (error) {
    //             console.error("Prediction fetch error", error);
    //         }
    //     };

    //     fetchPrediction();
    // }, [expandedHistory]);



    useEffect(() => {
        if (!expandedHistory || expandedHistory.length === 0) return;
    
        const fetchPrediction = async () => {
            try {
                const res = await fetch("http://localhost:8000/predict", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        history: expandedHistory
                    }),
                });
    
                if (!res.ok) {
                    console.warn("Prediction API returned an error:", res.status);
                    setPredictedHistory([]); // Default empty array
                    return;
                }
    
                let predictionData = [];
                try {
                    predictionData = await res.json();
                } catch (jsonError) {
                    console.warn("Invalid JSON response from prediction API");
                    setPredictedHistory([]);
                    return;
                }
    
                const formattedPredictionData = Array.isArray(predictionData)
                    ? predictionData.map(item => ({
                        date: item.ds,
                        predictedPrice: Math.round(item.yhat),
                    }))
                    : [];
    
                setPredictedHistory(formattedPredictionData);
    
            } catch (error) {
                console.error("Prediction fetch error:", error);
                setPredictedHistory([]); // Fallback to empty
            }
        };
    
        fetchPrediction();
    }, [expandedHistory]);
    

    useEffect(() => {
        const fetchProduct = async () => {
            console.log(query)
            if (!query) return;

            setLoading(true);
            setError(""); // reset error

            try {
                console.log("phela to sahi hao")
                const res = await fetch(`/api/getProductByLink?url=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (res.ok) {
                    setProduct(data);
                    console.log(data.priceHistory)
                    expandPriceHistory(data.priceHistory);
                } else {
                    console.log(res)
                    setError("This product was not found in our database, but we’ll start tracking it from now.");
                    setProduct(null);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
                setError("Something went wrong while fetching the product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [query]);



    const expandPriceHistory = async (priceHistory) => {
        const expanded = [];

        for (let i = 0; i < priceHistory.length - 1; i++) {
            const current = priceHistory[i];
            const next = priceHistory[i + 1];

            let currentDate = new Date(current.date);
            currentDate.setHours(0, 0, 0, 0);

            const nextDate = new Date(next.date);
            nextDate.setHours(0, 0, 0, 0);

            while (currentDate < nextDate) {
                // console.log(currentDate)
                const dateStr = currentDate.toLocaleDateString('en-CA');
                // console.log(dateStr)
                expanded.push({
                    date: dateStr,
                    // price: dateStr === next.date ? next.price : current.price,
                    price: current.price,
                });
                // console.log(expanded)

                currentDate.setDate(currentDate.getDate() + 1);
            }
            console.log(expanded)
        }
        console.log(expanded);
        const lastPoint = priceHistory[priceHistory.length - 1];
        console.log(lastPoint)

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastDate = new Date(lastPoint.date);
        lastDate.setHours(0, 0, 0, 0);

        if (lastDate <= today) {
            let currentDate = new Date(lastPoint.date);
            currentDate.setHours(0, 0, 0, 0);

            while (currentDate <= today) {
                const dateStr = currentDate.toLocaleDateString('en-CA');
                console.log(dateStr)
                expanded.push({
                    date: dateStr,
                    price: lastPoint.price,
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        setexpandedHistory(expanded)

        // filterHistory(selectedRange);
        // return expanded;
    };

    useEffect(() => {
        filterHistory(selectedRange);
    }, [expandedHistory, selectedRange]);


    const filterHistory = (range) => {
        const today = new Date();
        let fromDate = new Date(today);
        console.log("idhar aya ki nhi")
        console.log(range)

        if (range === '1M') {
            fromDate.setMonth(today.getMonth() - 1);
        } else if (range === '3M') {
            fromDate.setMonth(today.getMonth() - 3);
        } else if (range === '10D') {
            fromDate.setDate(today.getDate() - 10);
        } else {
            setFilteredHistory(expandedHistory);
            return;
        }

        const filtered = expandedHistory.filter(entry => {
            const entryDate = new Date(Date.parse(entry.date));
            return entryDate >= fromDate;
        });

        setFilteredHistory(filtered);
    };






    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const formattedDate = new Date(label).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            return (
                <div className="bg-gray-800 text-white p-3 rounded-lg shadow-md border border-gray-700">
                    <p className="text-sm text-blue-400">{formattedDate}</p>
                    <p className="text-base font-semibold text-yellow-300">
                        ₹{payload[0].value}
                    </p>
                </div>
            );
        }

        return null;
    };
    const CustomTooltippredicted = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const formattedDate = new Date(label).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            return (
                <div className="bg-gray-800 text-white p-3 rounded-lg shadow-md border border-gray-700">
                    <p className="text-sm text-blue-400">{formattedDate}</p>
                    <p className="text-base font-semibold text-yellow-300">
                        Predicted ₹{payload[0].value}
                    </p>
                </div>
            );
        }

        return null;
    };

    const getColor = (score) => {
        if (score <= 25) return "left-[5%]";
        if (score <= 50) return "left-[33%]";
        if (score <= 75) return "left-[60%]";
        return "left-[88%]";
    };

    if (loading) {
        return (
            <div className="text-white text-center py-20 text-base sm:text-xl font-medium animate-pulse">
                🔍 Searching for the product...
            </div>
        );
    }


    if (error) {
        return (
            <div className="text-white text-center py-20 px-4 max-w-xl mx-auto">
                <h2 className="text-base sm:text-lg lg:text-2xl font-semibold font-sans text-red-400 mb-2">Product Not Found</h2>
                <p className="text-gray-300">{error}</p>
                {/* <p className="text-gray-400 font-sans sm:text-base text-sm">This product was not found in our database, but we’ll start tracking it from now.</p> */}
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-3 sm:px-6 py-10 relative overflow-hidden">

            {/* 🔴 Blobs for background aesthetic */}
            <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-25 animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>








            <div className="relative z-10 max-w-6xl mx-auto bg-white/5 backdrop-blur-md  rounded-xl shadow-2xl p-4 sm:p-6 md:p-10 transition-all duration-300 hover:shadow-indigo-800/40">

                {/* 📦 Product Info Section */}
                <div className="flex flex-col md:flex-row gap-6 lg:gap-10 ">
                    {/* Product Image Section */}
                    <div className="bg-white flex justify-center items-center w-full md:w-1/3 h-60 rounded-xl">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain p-4"
                        />
                    </div>

                    {/* Product Info Section */}
                    <div className="w-full lg:w-2/3 flex flex-col justify-between space-y-4">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                            {product.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-2xl sm:text-3xl font-bold text-green-400">₹{product.currentPrice}</p>
                            <p className="line-through text-gray-400 text-lg">₹{product.mrp}</p>
                            <span className="bg-gradient-to-r from-green-600 to-lime-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-sm">
                                {product.discount}% OFF
                            </span>
                        </div>

                        <a
                            href={product.productLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 transition-all px-5 py-2.5 rounded-full text-white font-semibold shadow-md hover:shadow-lg text-sm sm:text-base w-fit"
                        >
                            Check on {product.platform}
                        </a>


                        {/* Check Price on Other Platform */}
                        {/* <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(product.title)}+site:amazon.in`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block bg-yellow-600 hover:bg-yellow-700 transition-all px-5 py-2.5 rounded-full text-white font-semibold shadow-md hover:shadow-lg text-sm sm:text-base w-fit"
                        >
                            Check on Amazon
                        </a> */}
                        {/* {product.platform === "flipkart" ? (
                            <a
                                href={`/search?query=${encodeURIComponent(product.title)}&platform=Amazon`}
                                className="inline-block bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2.5 rounded-full text-white font-semibold shadow-md hover:shadow-lg text-sm sm:text-base w-fit"
                            >
                                Check Price on Amazon
                            </a>
                        ) : product.platform === "amazon" ? (
                            <a
                                href={`/search?query=${encodeURIComponent(product.title)}&platform=Flipkart`}
                                className="inline-block bg-yellow-600 hover:bg-yellow-700 transition-all px-5 py-2.5 rounded-full text-black font-semibold shadow-md hover:shadow-lg text-sm sm:text-base w-fit"
                            >
                                Check Price on Flipkart
                            </a>
                        ) : null} */}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between pt-4 text-sm text-gray-300 space-y-2 sm:space-y-0">
                    <p className="text-xl"><span className="text-red-400 text-xl font-semibold">Highest:</span> ₹{product.highest}</p>
                    {/* <p><span className="text-blue-400 font-semibold">Average:</span> ₹{product.average}</p> */}
                    <p className="text-xl"><span className="text-green-400 text-xl font-semibold">Lowest:</span> ₹{product.lowest}</p>
                </div>

                {/* ❓ Should You Buy Section */}
                <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-3 text-white/90">
                        Should you buy at this price?
                    </h3>

                    {/* Gradient Bar with Price Pointer */}
                    <div className="relative bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 h-4 rounded-full shadow-inner">
                        <div className="relative h-4 ml-9 -mr-3">
                            <div
                                className="absolute -top-2 w-7 h-7 bg-white rounded-full border-2 border-black transition-all duration-300"
                                style={{
                                    right: `${((product.currentPrice - product.lowest) /
                                        (product.highest - product.lowest)) *
                                        100}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-2 text-xs sm:text-sm text-white/80 px-1">
                        <span>Skip</span>
                        <span>Wait</span>
                        <span>Okay</span>
                        <span>Yes</span>
                    </div>

                    <div className="relative">
                        {/* Product Info (Tera existing code yaha aayega) */}

                        {/* Button */}
                        {/* <button
                            onClick={() => setShowAlertForm(!showAlertForm)}
                            className={`mt-4 bg-red-500 hover:bg-red-600 transition-all ${showAlertForm ? "hidden" : ""}  px-5 py-2.5 rounded-full text-white font-semibold shadow-md hover:shadow-lg text-sm sm:text-base`}                        >
                            Price Drop Alert
                        </button> */}
                        <div className={`mt-4 flex flex-col font-sans transition-all ${showAlertForm ? "hidden" : ""} text-sm sm:text-base`}>
                            <div className="flex items-start">

                            <button onClick={() => setShowAlertForm(!showAlertForm)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600  text-white rounded">
                                Drop Price Alert 
                            </button>
                            </div>
                            {alertMessage && (
                                <span className= "text-xs sm:text-sm text-green-500">{alertMessage}</span>
                            )}
                        </div>

                        {/* Slide-down Form */}
                        {showAlertForm && (
                            <div className="sticky top-2 left-0 w-full mt-2 sm:w-1/2 bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg animate-slideDown z-50">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="sm:text-lg text-base lg:text-xl font-semibold">📩 Price Drop Alert</h3>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 sm:p-3 rounded-lg font-sans text-sm sm:text-base bg-white/5  backdrop-blur-md"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-2 sm:p-3 rounded-lg bg-white/5 font-sans text-sm sm:text-base  backdrop-blur-md"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-500 hover:bg-green-600 transition-all px-4 py-2 rounded-lg  text-sm sm:text-base  text-white font-semibold"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAlertForm(false)}
                                        className="ml-4 text-gray-400  text-sm sm:text-base  hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* <p className="mt-4 text-sm text-gray-300">
                        📊 Explore our price trend predictions for the coming days through the interactive graph below.
                    </p> */}

                    {/* 🧠 Drop Chances UI */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-white/90">
                            📉 Chances of Price Drop
                        </h3>
                        <div className="flex items-center ml-3 ">
                            {[10, 20, 30].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setSelectedDays(days)}
                                    className={`  px-4 py-2   font-medium text-sm transition-all ${selectedDays === days
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    <span className="font-medium">{days}D</span>
                                </button>
                            ))}
                            <span className={`text-green-400 font-bold ml-4 ${selectedDays ? '' : 'hidden'}`}>
                                {selectedDays ? `${calculateDropChances(selectedDays)}%` : ''}
                            </span>
                        </div>
                        {/* ⬇️ Explore + Scroll Button */}
                        <div className="mt-5 px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-gray-300">
                                📊 Explore our price trend predictions for the coming days through the interactive graph.
                            </p>
                            <button
                                onClick={() => {
                                    document.getElementById('predictedgraph')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="mt-1 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-md"
                            >
                                See Predicted Graph ↓
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            {/* 📈 Price Trend Chart */}
            <div className="relative mt-12  mx-auto  max-w-6xl">
                <h3 className="text-lg font-semibold mb-4 text-white/90">
                    Price Trend (Past)
                </h3>

                <div className="bg-white/5 rounded-2xl shadow-2xl z-10 backdrop-blur-md transition-all duration-300 hover:shadow-indigo-800/40 p-4 pl-1">
                    <div className="recharts-wrapper outline-none focus:outline-none">
                        {/* chart inside */}
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={filteredHistory}>
                                <XAxis
                                    dataKey="date"
                                    stroke="#ccc"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(dateStr) => {
                                        const date = parseISO(dateStr);
                                        const currentYear = new Date().getFullYear();
                                        return format(date, date.getFullYear() === currentYear ? "d MMM" : "d MMM yyyy");
                                    }}
                                    tick={{
                                        fill: '#facc15',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                />
                                <YAxis
                                    stroke="#ccc"
                                    axisLine={false}
                                    tickLine={false}
                                    domain={([min, max]) => {
                                        const padding = Math.floor(min * 0.3);
                                        return [min - padding, max + padding];
                                    }}
                                    tick={{
                                        fill: '#BBF7D0',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#60a5fa"
                                    // fill="#60a5fa"
                                    fill="url(#colorPrediction)"
                                    strokeWidth={2}
                                    fillOpacity={0.2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#00bcd4", stroke: "#fff", strokeWidth: 2, style: { outline: "none" } }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        {/* Range Buttons */}
                        <div className="flex  mb-4 justify-end">
                            {['10D', '1M', '3M', 'All'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setSelectedRange(range)}
                                    className={`px-4 py-2  font-medium text-sm transition-all ${selectedRange === range
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-2">Hover on the chart to see daily prices.</p>
            </div>



            {/* 📊 Predicted Price Chart */}
            <div id="predictedgraph" className="relative mt-16  mx-auto  max-w-6xl">
                <h3 className="text-lg font-semibold mb-4 text-white/90">
                    Predicted Prices (Next 30 Days)
                </h3>
                {/* Disclaimer Note */}
                <p className="text-sm text-yellow-400 mb-4">
                    <span className="text-red-500">Note</span>: This is a predicted price based on data analysis and trends. It is not the actual price and may not be 100% accurate.
                </p>

                <div className="bg-white/5 rounded-2xl shadow-2xl z-10 backdrop-blur-md transition-all duration-300 hover:shadow-indigo-800/40 p-4 pl-1">
                    <div className="recharts-wrapper outline-none focus:outline-none">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={PredictedHistory}>
                                <XAxis
                                    dataKey="date"
                                    stroke="#ccc"
                                    axisLine={false}
                                    tickLine={false}
                                    // tickFormatter={(dateStr) => {
                                    //     const date = parseISO(dateStr);
                                    //     return format(date, "d MMM");
                                    // }}
                                    tickFormatter={(dateStr) => {
                                        const date = parseISO(dateStr);
                                        const currentYear = new Date().getFullYear();
                                        return format(date, date.getFullYear() === currentYear ? "d MMM" : "d MMM yyyy");
                                    }}
                                    tick={{
                                        fill: '#facc15',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                />
                                <YAxis
                                    stroke="#ccc"
                                    axisLine={false}
                                    tickLine={false}
                                    // domain={['dataMin', 'dataMax']}
                                    domain={([min, max]) => {
                                        const padding = Math.floor(min * 0.3);
                                        return [min - padding, max + padding];
                                    }}
                                    tick={{
                                        fill: '#BBF7D0',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                />
                                <Tooltip content={<CustomTooltippredicted />} />
                                {/* <CartesianGrid strokeDasharray="3 3" stroke="#444" /> */}
                                <defs>
                                    <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
                                        <stop offset="75%" stopColor="#60a5fa" stopOpacity={0.05} />
                                    </linearGradient>

                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="predictedPrice"
                                    stroke="#60a5fa"
                                    // fill="#60a5fa"
                                    fill="url(#colorPrediction)"
                                    strokeWidth={2.5}
                                    fillOpacity={0.2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2, style: { filter: "drop-shadow(0 0 6px #60a5fa)", transition: "0.3s ease" } }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ResultPage;
