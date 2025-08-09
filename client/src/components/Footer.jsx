import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#363A36] text-gray-200 pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold mb-4 cursor-default">Fully Booked</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for the latest bestsellers, classics, and
            everything in between. Dive into a world of stories with us.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:underline text-gray-300">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline text-gray-300">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline text-gray-300">
                FAQs
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline text-gray-300">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline text-gray-300">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-5 text-xl">
            <a
              href="https://facebook.com/fullybooked"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/fullybooked"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/fullybooked"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com/fullybooked"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-4 text-gray-300">
            Subscribe to get updates on new arrivals, promotions & more.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-3 py-2 rounded-l-md text-black focus:outline-none"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-gray-300 text-[#363A36] font-semibold px-4 rounded-r-md hover:bg-gray-400 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm select-none text-gray-400">
        &copy; {new Date().getFullYear()} Fully Booked. All rights reserved.
      </div>
    </footer>
  );
}
