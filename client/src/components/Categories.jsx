import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories({ selectedCategory, onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mb-8 max-w-[1300px] w-full">
      <div
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm cursor-pointer transition-colors ${
          selectedCategory === null
            ? "bg-orange-600 text-white"
            : "bg-orange-200 text-orange-900 hover:bg-orange-300"
        }`}
      >
        All
      </div>

      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelectCategory(Number(cat.id))} // ensure Number
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm cursor-pointer transition-colors ${
            Number(selectedCategory) === Number(cat.id)
              ? "bg-orange-600 text-white"
              : "bg-orange-200 text-orange-900 hover:bg-orange-300"
          }`}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
}
