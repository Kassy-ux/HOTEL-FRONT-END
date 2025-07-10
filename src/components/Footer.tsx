export const Footer = () => {
    return (
      <footer className="bg-gray-100 text-gray-700 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3 text-center md:text-left">
          {/* Brand & Tagline */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600">StaySmart</h2>
            <p className="mt-2 text-sm">
              Book smart, stay better. Discover comfort wherever you go.
            </p>
          </div>
  
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-500">Home</a></li>
              <li><a href="/about" className="hover:text-blue-500">About</a></li>
              <li><a href="/hotels" className="hover:text-blue-500">Hotels</a></li>
              <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
            </ul>
          </div>
  
          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12.07C22 6.53 17.52 2 12 2S2 6.53 2 12.07c0 4.97 3.66 9.09 8.44 9.91v-7.01H7.9v-2.9h2.54v-2.2c0-2.5 1.48-3.9 3.76-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v7.01C18.34 21.16 22 17.04 22 12.07z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.61 8.61 0 01-2.73 1.04 4.28 4.28 0 00-7.3 3.9A12.13 12.13 0 013 4.89a4.28 4.28 0 001.32 5.71A4.25 4.25 0 012.8 9v.05a4.28 4.28 0 003.43 4.2 4.3 4.3 0 01-1.12.15c-.27 0-.55-.03-.81-.08a4.28 4.28 0 004 2.97 8.58 8.58 0 01-5.3 1.83c-.34 0-.68-.02-1.01-.06a12.1 12.1 0 006.55 1.92c7.87 0 12.18-6.52 12.18-12.17 0-.19 0-.38-.01-.57A8.65 8.65 0 0022.46 6z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4H7zm10 2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
  
        <div className="bg-gray-200 text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} StaySmart Hotels. All rights reserved.
        </div>
      </footer>
    );
  };
  