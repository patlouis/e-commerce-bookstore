import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:3000/books');
                setBooks(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
        await axios.delete(`http://localhost:3000/books/${id}`);
        window.location.reload();
        } catch (error) {
        console.error(error);
        }
    };

    return (
        <div className="min-h-screen px-10 py-16 flex flex-col items-center text-center bg-[#f9f9f9] font-sans rounded-xl">
            <h1 className="text-3xl font-semibold mb-4">Patrick's Bookstore</h1>

            <button className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors mb-6 cursor-pointer">
                <Link to="/create">+ Add New Book</Link>
            </button>

            <div className="flex flex-wrap gap-5 justify-center mt-4">
            {books.map((book) => (
                <div
                className="w-[220px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center shadow-sm hover:-translate-y-1 transition-transform"
                key={book.id}
                >
                <img
                    src={book.cover}
                    alt={book.title}
                    className="w-[180px] h-[270px] object-cover rounded-md bg-gray-300"
                />
                <h2 className="text-lg font-semibold mt-4">{book.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{book.desc}</p>
                <p className="text-base font-medium mt-1 text-green-700">₱{book.price}</p>

                <Link to={`/update/${book.id}`} className="w-full">
                    <button className="w-full bg-[#e6f0ff] text-[#0047ab] text-sm mt-3 py-2 rounded-md hover:bg-[#cce0ff] transition-colors cursor-pointer">
                    Update
                    </button>
                </Link>

                <button
                    onClick={() => handleDelete(book.id)}
                    className="w-full bg-[#ffe5e5] text-[#cc0000] text-sm mt-2 py-2 rounded-md hover:bg-[#ffcccc] transition-colors cursor-pointer"
                >
                    Delete
                </button>
                </div>
            ))}
            </div>
        </div>
        );
}

export default Books;
