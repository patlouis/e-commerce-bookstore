import React, { useState, useEffect, useRef } from "react";

export default function Dropdown({ options, selected, setSelected, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => !ref.current?.contains(e.target) && setIsOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 text-sm border rounded-lg bg-white text-gray-800 flex justify-between items-center cursor-pointer transition-colors duration-150 hover:border-gray-400"
      >
        {options.find((o) => o.value === selected)?.label ?? placeholder}
        <span className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}>&#9662;</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
          {options.map((o) => (
            <li
              key={o.value}
              onClick={() => { setSelected(o.value); setIsOpen(false); }}
              className={`px-3 py-1.5 cursor-pointer text-gray-800 ${selected === o.value ? "bg-gray-100" : "hover:bg-gray-100"}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
