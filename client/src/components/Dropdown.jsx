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
        className="w-full px-2 py-1.5 text-sm border rounded-lg bg-gray-800 text-white flex justify-between items-center cursor-pointer transition-colors duration-150 hover:border-gray-500"
      >
        {options.find((o) => o.value === selected)?.label ?? placeholder}
        <span className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}>&#9662;</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg text-sm">
          {options.map((o) => (
            <li
              key={o.value}
              onClick={() => { setSelected(o.value); setIsOpen(false); }}
              className={`px-3 py-1.5 cursor-pointer text-white ${selected === o.value ? "bg-gray-600" : "hover:bg-gray-600"}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
