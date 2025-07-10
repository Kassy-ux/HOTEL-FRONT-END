
import { Footer } from "../components/Footer"
import { HeroHotel } from "../components/hotels/HeroHotel"
import { HotelCardSection } from "../components/hotels/HotelCardSection"
import { Navbar } from "../components/Navbar"


const Hotels = () => {
  return (
    <div>
      <Navbar />
        <HeroHotel />
        <HotelCardSection />
        <Footer />
     
    </div>
  )
}

export default Hotels
