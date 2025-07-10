import Container from "../components/Container"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"

export const About = () => {
  return (
    <>
      <Container className="bg-gradient-to-br from-blue-100 via-white to-pink-100 flex flex-col gap-6 min-h-screen">
        <Navbar />

        <section className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to <span className="text-blue-500 font-semibold">StaySmart</span>, your trusted hotel booking platform.
            Whether you're planning a quick getaway or a long vacation, our mission is to make your stay smooth, affordable, and unforgettable.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="Our Hotel Experience"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                Easy booking with instant confirmation
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                Best price guarantee with zero hidden fees
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                Handpicked hotels and verified guest reviews
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">✓</span>
                24/7 customer support for peace of mind
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl mx-6 p-8 shadow-xl max-w-5xl text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h3>
          <p className="text-gray-600">
            To revolutionize travel by providing seamless, secure, and enjoyable hotel booking experiences for everyone, everywhere.
          </p>
        </section>

        <Footer />
      </Container>
    </>
  )
}
