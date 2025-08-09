import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/books?category=${cat.id}`}
            className="px-4 py-2 rounded-full bg-orange-200 text-orange-900 hover:bg-orange-300 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
