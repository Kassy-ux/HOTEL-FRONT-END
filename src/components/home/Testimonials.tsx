export const Testimonial = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-white via-blue-50 to-pink-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          What Our Guests Are Saying
        </h2>

        <div className="bg-white shadow-xl rounded-xl p-8 relative">
          <svg
            className="absolute top-6 left-6 w-10 h-10 text-blue-300 opacity-30"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9.17 6.26a5.76 5.76 0 00-4.09 1.76A6.11 6.11 0 003 12.26a5.81 5.81 0 001.5 4.24A5.62 5.62 0 008.44 18h.12v-2h-.06a3.56 3.56 0 01-2.62-1.07 3.65 3.65 0 01-1-2.67 4.09 4.09 0 011.14-3 3.75 3.75 0 012.71-1 3.82 3.82 0 011.89.49l.94-1.71a5.33 5.33 0 00-2.4-.78zM20.17 6.26a5.76 5.76 0 00-4.09 1.76A6.11 6.11 0 0014 12.26a5.81 5.81 0 001.5 4.24 5.62 5.62 0 003.94 1.5h.12v-2h-.06a3.56 3.56 0 01-2.62-1.07 3.65 3.65 0 01-1-2.67 4.09 4.09 0 011.14-3 3.75 3.75 0 012.71-1 3.82 3.82 0 011.89.49l.94-1.71a5.33 5.33 0 00-2.4-.78z" />
          </svg>

          <p className="text-gray-700 text-lg leading-relaxed">
            “StaySmart made our vacation absolutely perfect. From the intuitive booking process to the friendly customer
            support, everything was smooth. The hotel exceeded our expectations—clean, luxurious, and close to all the spots
            we wanted to visit. We'll definitely book again!”
          </p>

          {/* Customer info */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Customer"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-gray-800">Sarah Wanjiku</p>
              <p className="text-sm text-gray-500">Nairobi, Kenya</p>
            </div>
          </div>

          {/* Star rating */}
          <div className="mt-4 flex justify-center text-yellow-400 text-xl">
            ★★★★☆
          </div>
        </div>
      </div>
    </section>
  );
};
