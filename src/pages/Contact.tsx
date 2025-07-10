import Container from "../components/Container"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Contact = () => {
  return (
    <>
      <Container className="bg-gradient-to-br from-blue-100 via-white to-pink-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12 gap-12">
          {/* Contact Form */}
          <div className="w-full md:w-1/2 max-w-lg bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">We’d love to hear from you. Send us a message and we’ll get back to you shortly.</p>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered w-full"
              />
              <textarea
                placeholder="Your Message"
                className="textarea textarea-bordered w-full h-32"
              ></textarea>
              <button type="submit" className="btn bg-blue-700 text-white hover:bg-blue-800">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/2 max-w-md text-blue-900">
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <p className="mb-2"><strong>Phone:</strong> +254 712 345 678</p>
            <p className="mb-2"><strong>Email:</strong> support@stayease.com</p>
            <p className="mb-6"><strong>Address:</strong> StayEase Hotel HQ, Nairobi, Kenya</p>

            <div className="w-full h-48 rounded-xl overflow-hidden shadow-md">
              {/* Replace with real map iframe later */}
              <iframe
                src="https://maps.google.com/maps?q=nairobi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </main>
        <Footer />
      </Container>
    </>
  )
}
