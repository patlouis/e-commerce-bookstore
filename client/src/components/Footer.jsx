import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#363A36] text-gray-200 pt-10 pb-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 cursor-default">Fully Booked</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Your one-stop shop for the latest bestsellers, classics, and
            everything in between. Dive into a world of stories with us.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Explore</h3>
          <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            {[
              ["About Us", "/about"],
              ["Contact Us", "/contact"],
              ["FAQs", "/faq"],
              ["Privacy Policy", "/privacy"],
              ["Terms of Service", "/terms"]
            ].map(([label, link]) => (
              <li key={label}>
                <a href={link} className="hover:underline text-gray-300 block">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Follow Us</h3>
          <div className="flex space-x-4 sm:space-x-5 text-lg sm:text-xl">
            {[
              { icon: <FaFacebookF />, link: "https://facebook.com/fullybooked", label: "Facebook" },
              { icon: <FaTwitter />, link: "https://twitter.com/fullybooked", label: "Twitter" },
              { icon: <FaInstagram />, link: "https://instagram.com/fullybooked", label: "Instagram" },
              { icon: <FaYoutube />, link: "https://youtube.com/fullybooked", label: "YouTube" },
            ].map(({ icon, link, label }) => (
              <a
                key={label}
                href={link}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Newsletter</h3>
          <p className="text-sm sm:text-base mb-3 sm:mb-4 text-gray-300">
            Subscribe to get updates on new arrivals, promotions & more.
          </p>
          <form className="flex flex-col sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-grow px-3 py-2 mb-2 sm:mb-0 rounded-md sm:rounded-l-md text-gray-300 focus:outline-none"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-gray-300 text-[#363A36] font-semibold px-4 py-2 rounded-md sm:rounded-l-none hover:bg-gray-400 transition-colors w-full sm:w-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs sm:text-sm select-none text-gray-400">
        &copy; {new Date().getFullYear()} Fully Booked. All rights reserved.
      </div>
    </footer>
  );
}
