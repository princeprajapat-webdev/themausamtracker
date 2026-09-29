import { useState, useEffect } from "react";
import search from "./assets/search.png";
import cloudy from "./assets/cloudy.png";
import heavyRain from "./assets/heavyrain.png";
import mist from "./assets/mist.jpg";
import rain from "./assets/rain.webp";
import snowy from "./assets/snowy.jpg";
import sunny from "./assets/sunny.png";
import thunderstorm from "./assets/thunderstorm.png";
import humidity from "./assets/humidity.png";
import windspeed from "./assets/windspeed.png";
import airpressure from "./assets/airpressure.png";
import sealevel from "./assets/sealevel.png";

const apiKey = "e338962d7529a510b925e6936fd3370d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const timeUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";


function WeatherApp() {
    const [city, setCity] = useState("Jaipur");
    const [searchCity, setSearchCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!city.trim()) return;
        const controller = new AbortController();
        const fetchWeather = async () => {
            setLoading(true);
            setError("");
            try {
                const data1 = await fetch(`${apiUrl}${city}&appid=${apiKey}`, { signal: controller.signal });
                if (!data1.ok) {
                    throw new Error("City not found");
                }
                const data2 = await data1.json();
                setWeatherData(data2);
                const timeData = await fetch(`${timeUrl}${city}&appid=${apiKey}`, { signal: controller.signal });
                if (timeData.ok) {
                    const timeJSON = await timeData.json();
                    setForecastData(timeJSON.list ? timeJSON.list.slice(0, 6) : []);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to fetch weather data");
                    setWeatherData(null);
                    setForecastData([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        fetchWeather();
        return () => controller.abort();
    }, [city]);

    const getWeatherIcon = (weatherMain) => {
        if (!weatherMain) return cloudy;
        switch (weatherMain.toLowerCase()) {
            case "clear": return sunny;
            case "clouds": return cloudy;
            case "rain":
            case "drizzle": return rain;
            case "thunderstorm": return thunderstorm;
            case "snow": return snowy;
            case "mist":
            case "smoke":
            case "haze":
            case "dust":
            case "fog": return mist;
            default: return heavyRain;
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchCity.trim() !== "") {
            setCity(searchCity.trim());
            setSearchCity("");
        }
    };

    const formatTime = (dtTxt) => {
        if (!dtTxt) return "";
        const date = new Date(dtTxt);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };


    return (
        // Main Div:-
        <div className="relative min-h-screen bg-[#0B0F19] flex items-center justify-center p-1 min-w-screen font-sans text-[#FFFFFF] overflow-hidden">
            <div className="absolute top-1/4 -left-12 w-80 h-80 rounded-full filter blur-[110px] pointer-events-none opacity-80"
                style={{ background: "linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)" }} />
            <div className="absolute bottom-1/4 -right-12 w-80 h-80 rounded-full filter blur-[110px] pointer-events-none opacity-80"
                style={{ background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)" }} />
            <div className="relative z-10 w-[360px] min-h-[580px] rounded-[20px] backdrop-blur-2xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col gap-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold tracking-wider text-[#FFFFFF] drop-shadow-[0_0_8px_rgba(0,242,254,0.4)] uppercase">
                            Weather App
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[#FFFFFF] px-2.5 py-0.5 rounded-full backdrop-blur-md" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                        <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#00F2FE] animate-pulse" />
                        Live
                    </div>
                </div>


                {/* Search Bar:- */}
                <form onSubmit={handleSearch} className="h-11 flex items-center rounded-2xl backdrop-blur-md px-4 focus-within:border-[#00F2FE] focus-within:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all duration-300" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                    <input id="cityInput" type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="Enter your city..."
                        className="flex-1 bg-transparent outline-none text-xs text-[#FFFFFF] placeholder:text-white/70 font-mono tracking-wider" />
                    <button type="submit" className="size-7 rounded-xl flex items-center justify-center bg-white/10 hover:bg-[#00F2FE]/20 hover:border-[#00F2 active:scale-95 transition-all border border-transparent">
                        <img src={search} alt="search" className="size-3.5 object-contain invert" />
                    </button>
                </form>


                {/* Loading:- */}
                {loading && (
                    <div className="flex-1 flex items-center justify-center text-xs font-mono text-white/70">
                        Loading data...
                    </div>
                )}


                {/* Error & Loading:- */}
                {error && !loading && (
                    <div className="flex-1 flex items-center justify-center text-xs font-mono text-red-400">
                        {error}
                    </div>
                )}


                {/* Weather Data:- */}
                {!loading && !error && weatherData && (
                    <>
                        {/* ForeCast Data:- */}
                        <div className="w-full p-2 rounded-2xl backdrop-blur-md overflow-x-auto flex items-center gap-3 scrollbar-thin" style={{
                            backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)"
                        }}>
                            {forecastData.map((item, index) => (
                                <div key={index} className="flex flex-col items-center min-w-[65px] gap-1">
                                    <span className="text-[10px] font-mono text-white/80 whitespace-nowrap">
                                        {formatTime(item.dt_txt)}
                                    </span>
                                    <img src={getWeatherIcon(item.weather[0].main)} alt={item.weather[0].main} className="size-7 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
                                    <span className="text-[10px] font-medium capitalize text-yellow-300 truncate max-w-[60px] text-center">
                                        {item.weather[0].main}
                                    </span>
                                    <span className="text-xs font-semibold">
                                        {Math.round(item.main.temp)}°
                                    </span>
                                </div>
                            ))}
                        </div>


                        {/* City Weather Details:- */}
                        <div className="rounded-[24px] backdrop-blur-xl p-1 px-3 flex items-center justify-between relative overflow-hidden" style={{
                            backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)"
                        }}>
                            <div className="relative z-10">
                                <span className="text-[10px] font-mono tracking-widest text-[#FFFFFF] px-2.5 py-0.5 rounded-full" style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)"
                                }}>
                                    {weatherData.name}
                                </span>
                                <h1 className="text-5xl font-extralight tracking-tight text-[#FFFFFF] mt-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                                    {Math.round(weatherData.main.temp)}°
                                </h1>
                                <p className="text-xs font-medium text-yellow-400 mt-2 capitalize">
                                    {weatherData.weather[0].description}
                                </p>
                                <p className="text-[10px] font-mono text-white/70 mt-0.5 uppercase">
                                    HIGH: {Math.round(weatherData.main.temp_max)}° · LOW: {Math.round(weatherData.main.temp_min)}°
                                </p>
                            </div>
                            <div className="size-20 rounded-2xl backdrop-blur-md flex items-center justify-center" style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)"
                            }}>
                                <img src={getWeatherIcon(weatherData.weather[0].main)} alt="weather icon" className="size-12 object-contain drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]" />
                            </div>
                        </div>


                        {/* Extra Data:- */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Humidity:- */}
                            <div
                                className="rounded-[20px] p-3.5 backdrop-blur-md flex flex-col justify-between hover:border-white/40 transition-all" style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)"
                                }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white font-medium">
                                        Humidity
                                    </span>
                                    <div className="size-8 rounded-lg flex items-center justify-center" style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)",
                                    }}>
                                        <img src={humidity} alt="humidity" className="size-5" />
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-[#FFFFFF]">
                                    {weatherData.main.humidity}%
                                </p>
                            </div>

                            {/* Wind Speed:- */}
                            <div className="rounded-[20px] p-3.5 backdrop-blur-md flex flex-col justify-between hover:border-white/40 transition-all" style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)",
                            }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white font-medium">
                                        Wind Speed
                                    </span>
                                    <div className="size-8 rounded-lg flex items-center justify-center" style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)",
                                    }}>
                                        <img src={windspeed} alt="wind speed" className="size-5 invert" />
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-[#FFFFFF]">
                                    {weatherData.wind.speed}
                                    <span className="text-xs font-mono font-normal text-white/60"> km/h</span>
                                </p>
                            </div>

                            {/* Air Pressure:- */}
                            <div className="rounded-[20px] p-3.5 backdrop-blur-md flex flex-col justify-between hover:border-white/40 transition-all" style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)"
                            }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white font-medium">
                                        Air Pressure
                                    </span>
                                    <div className="size-8 rounded-lg flex items-center justify-center" style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)"
                                    }}>
                                        <img src={airpressure} alt="air quality" className="size-5 invert" />
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-[#FFFFFF]"><span>{(weatherData.main.pressure * 0.02953).toFixed(2)} inHg</span></p>
                            </div>

                            {/* Sea Level:- */}
                            <div className="rounded-[20px] p-3.5 backdrop-blur-md flex flex-col justify-between hover:border-white/40 transition-all" style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)"
                            }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white font-medium">
                                        Sea Level
                                    </span>
                                    <div className="size-8 rounded-lg flex items-center justify-center" style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)"
                                    }}>
                                        <img src={sealevel} alt="UV index" className="size-5 invert" />
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-[#FFFFFF]">{weatherData.main.sea_level} hPa</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}



export default WeatherApp;