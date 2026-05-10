import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./components/Sidebar";
import IconGrid from "./components/IconGrid";

const App = () => {
  const [open, setOpen] = useState(true);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const inpRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault(); // prevents typing "/" in focused input
        inpRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // Theme state
  const [theme, setTheme] = useState("dark");

  // State for variant and weight
  const [variant, setVariant] = useState("path_outline");
  const [weight, setWeight] = useState("regular");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    // Fetch the JSON async to avoid blocking main thread on load
    fetch("/icon-database-inline.json")
      .then((res) => res.json())
      .then((data) => {
        setIcons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load icon database:", err);
        setLoading(false);
      });
  }, []);

  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      // Check if it matches search query
      if (
        searchQuery &&
        !icon.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Check if the icon actually has a file for the selected variant and weight
      const paths = icon[variant] || [];
      const hasWeight = paths.some((p) => p.name === weight);
      return hasWeight;
    });
  }, [icons, searchQuery, variant, weight]);

  return (
    <div className="w-full h-screen bg-[#f5f5f7] dark:bg-[#151515] flex font-geist text-[14px] font-semibold overflow-hidden transition-colors duration-300">
      <Sidebar
        open={open}
        variant={variant}
        setVariant={setVariant}
        weight={weight}
        setWeight={setWeight}
      />

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col relative bg-white dark:bg-[#121212] transition-colors duration-300">
        <nav className="w-full flex justify-between items-center p-4 border-b border-black/5 dark:border-[hsla(0,0%,100%,.05)] shrink-0 bg-[#f5f5f7] dark:bg-[#151515] transition-colors duration-300">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-[hsla(0,0%,100%,.05)] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="w-1/2 max-w-md relative group">
            <input
              type="text"
              ref={inpRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 dark:bg-[#1f1f1f] p-2 text-black dark:text-[#f5f5f7] outline-none focus:shadow-[0_0_0_4px_rgba(30,110,244,.6)] dark:focus:shadow-[0_0_0_4px_rgba(0,122,255,.6)] rounded-sm border border-black/10 dark:border-[hsla(0,0%,100%,.15)] text-[13px] px-9 leading-1.25 transition-all duration-200"
              placeholder="Search icons..."
            />
            <svg
              height="16"
              width="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="absolute top-1/2 transform -translate-y-1/2 left-2.5"
              fill="#007aff"
            >
              <path d="M11.87 10.835c.018.015.035.03.051.047l3.864 3.863a.735.735 0 1 1-1.04 1.04l-3.863-3.864a.744.744 0 0 1-.047-.051 6.667 6.667 0 1 1 1.035-1.035zM6.667 12a5.333 5.333 0 1 0 0-10.667 5.333 5.333 0 0 0 0 10.667z"></path>
            </svg>

            {searchQuery.trim() !== "" && (
              <svg
                viewBox="0 0 24 24"
                className="absolute size-6 text-[#A5A5A5] right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={() => setSearchQuery("")}
              >
                <title>xmark.circle.fill</title>{" "}
                <path
                  transform="matrix(0.8366013071895425, 0, 0, 0.8366013071895425, 0.2450980392156863, 19.07843137254902)"
                  d="M14.05 3.49C20.65 3.49 26.00-1.88 26.00-8.46C26.00-15.06 20.65-20.41 14.05-20.41C7.46-20.41 2.10-15.06 2.10-8.46C2.10-1.88 7.46 3.49 14.05 3.49ZM10.11-3.54C9.57-3.54 9.15-3.97 9.15-4.51C9.15-4.77 9.25-5.02 9.43-5.19L12.68-8.45L9.43-11.70C9.25-11.88 9.15-12.12 9.15-12.38C9.15-12.93 9.57-13.34 10.11-13.34C10.38-13.34 10.59-13.24 10.78-13.07L14.05-9.81L17.34-13.08C17.54-13.28 17.75-13.36 18.01-13.36C18.55-13.36 18.98-12.94 18.98-12.40C18.98-12.13 18.90-11.92 18.69-11.71L15.43-8.45L18.68-5.20C18.88-5.03 18.97-4.78 18.97-4.51C18.97-3.97 18.54-3.54 17.99-3.54C17.72-3.54 17.47-3.63 17.30-3.82L14.05-7.08L10.82-3.82C10.63-3.63 10.38-3.54 10.11-3.54Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>

          <div className="w-10">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        <div className="flex-1 overflow-hidden relative pt-5">
          {/* Top subtle shadow for depth */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 dark:from-black/20 to-transparent z-10 pointer-events-none transition-colors duration-300"></div>

          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-8 h-8 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs tracking-wider uppercase opacity-80">
                Loading 7000+ icons...
              </p>
            </div>
          ) : (
            <IconGrid icons={filteredIcons} variant={variant} weight={weight} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
