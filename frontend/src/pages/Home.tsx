"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, MapPin, Menu, X } from "lucide-react"
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

// City data for carousel
const cities = [
  {
    id: 1,
    name: "New York",
    image: "https://img.freepik.com/premium-photo/downtown-sydney-skyline-australia-from-top-view-twilight_255553-208.jpg?w=2000",
    parkingLots: ["Central Park Garage", "Times Square Parking"],
    rating: 4.8,
    address: "Manhattan, NY",
  },
  {
    id: 2,
    name: "Los Angeles",
    image: "/placeholder.svg?height=400&width=600",
    parkingLots: ["Hollywood Parking", "Downtown LA Garage"],
    rating: 4.5,
    address: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Chicago",
    image: "/placeholder.svg?height=400&width=600",
    parkingLots: ["Millennium Park Garage", "Navy Pier Parking"],
    rating: 4.7,
    address: "Chicago, IL",
  },
  {
    id: 4,
    name: "Miami",
    image: "/placeholder.svg?height=400&width=600",
    parkingLots: ["South Beach Parking", "Downtown Miami Garage"],
    rating: 4.6,
    address: "Miami, FL",
  },
]

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Regular Commuter",
    avatar: "https://mui.com/static/images/avatar/4.jpg",
    content:
      "This parking system has completely transformed my daily commute. No more circling around looking for spots!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Traveler",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    content:
      "As someone who travels for business frequently, having guaranteed parking in multiple cities is a game-changer.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Shopping Mall Manager",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    content:
      "Implementing this system in our mall has improved customer satisfaction and increased our parking revenue.",
  },
]

// Features data
const features = [
  {
    title: "Book Parking Slots Online",
    description: "Reserve your parking spot in advance from anywhere, anytime.",
    icon: "🔖",
  },
  {
    title: "Pay in Advance or On Arrival",
    description: "Flexible payment options to suit your needs and preferences.",
    icon: "💳",
  },
  {
    title: "Multi-City Availability",
    description: "Access parking spots across multiple cities with a single account.",
    icon: "🌆",
  },
  {
    title: "Admin-Assisted Entry",
    description: "Get help from our staff for a smooth parking experience when you arrive.",
    icon: "👨‍💼",
  },
]

export default function Home() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const nextCity = () => {
    setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length)
  }

  const prevCity = () => {
    setCurrentCityIndex((prevIndex) => (prevIndex - 1 + cities.length) % cities.length)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white ">
      {/* Navigation */}
      <header
  className="fixed top-0 left-0 right-0 z-50 
  bg-white/70 dark:bg-black/10 
  border-b border-gray-200 dark:border-gray-700 
  shadow-md backdrop-blur-3xl 
  transition-colors duration-300"
>

        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter">
            PARK<span className="text-gray-500">EASE</span>
          </Link>

          {isMobile ? (
            <button onClick={toggleMenu} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <nav className="flex items-center space-x-8">
              <Link to="#features" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Features
              </Link>
              <Link to="#locations" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Locations
              </Link>
              <Link to="#testimonials" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Testimonials
              </Link>
              <Link to="#contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Contact
              </Link>
              <Button variant="outlined" className="ml-4">
                Login
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800">Create Account</Button>
            </nav>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg
            dark:bg-zinc-900 dark:border-gray-700
            "
          >
            <nav className="flex flex-col py-4 px-4">
              <Link to="#features" className="py-3 text-sm font-medium hover:text-gray-600 transition-colors">
                Features
              </Link>
              <Link to="#locations" className="py-3 text-sm font-medium hover:text-gray-600 transition-colors">
                Locations
              </Link>
              <Link to="#testimonials" className="py-3 text-sm font-medium hover:text-gray-600 transition-colors">
                Testimonials
              </Link>
              <Link to="#contact" className="py-3 text-sm font-medium hover:text-gray-600 transition-colors">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 mt-4">
                <Button variant="outlined" className="w-full">
                  Login
                </Button>
                <button className="w-full dark:bg-white bg-black text-white dark:text-black hover:bg-gray-800">Create Account</button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-gray-50 to-white
      dark:from-zinc-900 dark:to-black 
      ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
                Book Your Spot.
                <br />
                <span className="text-gray-500">Park with Ease.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                The smart way to find and book parking spaces in your city. No more circling blocks or stressing over
                spots.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg">Create Account</Button>
                <Button variant="outlined" className="px-8 py-6 text-lg">
                  Login
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://img.freepik.com/premium-photo/car-parked-designated-spot_1375194-69289.jpg?w=2000"
                  alt="Parking Management System"
                  className="object-cover fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xl font-bold">Smart Parking Solutions</p>
                  <p>For businesses and individuals</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black text-white dark:bg-black dark:text-white ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Key Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Everything you need for a seamless parking experience
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Account Actions */}
      <section className="py-20 bg-white dark:bg-black dark:text-white ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Started Today</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your parking experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-gray-100 dark:bg-zinc-900 dark:text-white  rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Create Account</h3>
              <p className="text-gray-600 mb-6">Sign up in less than 2 minutes and set up your profile</p>
              <Button className="bg-black text-white hover:bg-gray-800 w-full">Create Account</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Book Slot</h3>
              <p className="text-gray-600 mb-6">Find and reserve your perfect parking spot in seconds</p>
              <Button className="bg-black text-white hover:bg-gray-800 w-full">Find Parking</Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Make Payment</h3>
              <p className="text-gray-600 mb-6">Pay securely online or when you arrive at the location</p>
              <Button className="bg-black text-white hover:bg-gray-800 w-full">Payment Options</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admin Functionality Preview */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-xl overflow-hidden shadow-xl"
            >
              <img src="https://img.freepik.com/free-photo/person-preparing-get-driver-license_23-2150167566.jpg?ga=GA1.1.111555767.1744038035&semt=ais_country_boost&w=740" alt="Admin Dashboard" className="object-cover fill" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold">Admin Functionality</h2>
              <p className="text-xl text-gray-600">
                Our system provides powerful tools for parking administrators to manage spaces efficiently.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-black text-white p-2 rounded-full mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Book Slot on User Arrival</h3>
                    <p className="text-gray-600">
                      Admins can quickly book slots for users who arrive without a reservation
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-black text-white p-2 rounded-full mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Real-time Space Management</h3>
                    <p className="text-gray-600">Monitor and manage all parking spaces from a single dashboard</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-black text-white p-2 rounded-full mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Reporting & Analytics</h3>
                    <p className="text-gray-600">Generate detailed reports on usage, revenue, and occupancy rates</p>
                  </div>
                </div>
              </div>

              <Button className="bg-black text-white hover:bg-gray-800">Learn More About Admin Features</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cities/Locations Carousel */}
      <section id="locations" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Available Locations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find parking spots in these major cities and more</p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-4xl">
                  <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={cities[currentCityIndex].image || "/placeholder.svg"}
                      alt={cities[currentCityIndex].name}
                      
                      className="object-cover fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-3xl font-bold mb-2">{cities[currentCityIndex].name}</h3>
                      <div className="flex items-center mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span>{cities[currentCityIndex].address}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(cities[currentCityIndex].rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400"
                              }
                            />
                          ))}
                        </div>
                        <span>{cities[currentCityIndex].rating.toFixed(1)}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold">Featured Parking Lots:</p>
                        <ul>
                          {cities[currentCityIndex].parkingLots.map((lot, index) => (
                            <li key={index} className="flex items-center">
                              <span className="mr-2">•</span>
                              {lot}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <button
              onClick={prevCity}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-10"
              aria-label="Previous city"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextCity}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg z-10"
              aria-label="Next city"
            >
              <ChevronRight size={24} />
            </button>

            <div className="flex justify-center mt-6 space-x-2">
              {cities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCityIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === currentCityIndex ? "bg-black" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from people who have transformed their parking experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-6">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14 4.93333 12.2667 6.13333 10.5333C7.33333 8.8 9.06667 7.33333 11.3333 6.13333L12.6667 8.13333C11.0667 9 9.8 9.93333 8.86667 10.9333C7.93333 11.9333 7.46667 12.9333 7.46667 13.9333C7.46667 14.2667 7.53333 14.5333 7.66667 14.7333C7.8 14.9333 8 15.0667 8.26667 15.1333C8.53333 15.2 8.8 15.2 9.06667 15.1333C9.33333 15.0667 9.6 15 9.86667 14.9333C10.1333 14.8667 10.4 14.8 10.6667 14.7333C11.2 14.6 11.7333 14.6 12.2667 14.7333C12.8 14.8667 13.2667 15.1333 13.6667 15.5333C14.0667 15.9333 14.3333 16.4667 14.4667 17.1333C14.6 17.8 14.5333 18.4667 14.2667 19.1333C14 19.8 13.5333 20.3333 12.8667 20.7333C12.2 21.1333 11.4 21.3333 10.4667 21.3333H9.33333ZM21.3333 21.3333C19.8667 21.3333 18.6667 20.8 17.7333 19.7333C16.8 18.6667 16.3333 17.3333 16.3333 15.7333C16.3333 14 16.9333 12.2667 18.1333 10.5333C19.3333 8.8 21.0667 7.33333 23.3333 6.13333L24.6667 8.13333C23.0667 9 21.8 9.93333 20.8667 10.9333C19.9333 11.9333 19.4667 12.9333 19.4667 13.9333C19.4667 14.2667 19.5333 14.5333 19.6667 14.7333C19.8 14.9333 20 15.0667 20.2667 15.1333C20.5333 15.2 20.8 15.2 21.0667 15.1333C21.3333 15.0667 21.6 15 21.8667 14.9333C22.1333 14.8667 22.4 14.8 22.6667 14.7333C23.2 14.6 23.7333 14.6 24.2667 14.7333C24.8 14.8667 25.2667 15.1333 25.6667 15.5333C26.0667 15.9333 26.3333 16.4667 26.4667 17.1333C26.6 17.8 26.5333 18.4667 26.2667 19.1333C26 19.8 25.5333 20.3333 24.8667 20.7333C24.2 21.1333 23.4 21.3333 22.4667 21.3333H21.3333Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 mb-6 flex-grow">{testimonial.content}</p>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to Transform Your Parking Experience?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 mb-8"
            >
              Join thousands of users who have simplified their parking with our platform
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg">Create Free Account</Button>
              <Button variant="outlined" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="text-2xl font-bold tracking-tighter">
                PARK<span className="text-gray-500">EASE</span>
              </Link>
              <p className="text-gray-600">The smart way to find and book parking spaces in your city.</p>
              <div className="flex space-x-4">
                <Link to="#" className="text-gray-600 hover:text-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-600 hover:text-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-600 hover:text-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                      fill="currentColor"
                    />
                    <path d="M6 9H2V21H6V9Z" fill="currentColor" />
                    <path
                      d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-600 hover:text-black">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM7.6 4C5.61177 4 4 5.61177 4 7.6V16.4C4 18.3882 5.61177 20 7.6 20H16.4C18.3882 20 20 18.3882 20 16.4V7.6C20 5.61177 18.3882 4 16.4 4H7.6ZM17.25 5.5C17.9404 5.5 18.5 6.05964 18.5 6.75C18.5 7.44036 17.9404 8 17.25 8C16.5596 8 16 7.44036 16 6.75C16 6.05964 16.5596 5.5 17.25 5.5ZM12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Developers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-black">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="text-gray-600">
                  123 Parking Avenue
                  <br />
                  New York, NY 10001
                </li>
                <li>
                  <Link to="mailto:info@parkease.com" className="text-gray-600 hover:text-black">
                    info@parkease.com
                  </Link>
                </li>
                <li>
                  <Link to="tel:+1234567890" className="text-gray-600 hover:text-black">
                    +1 (234) 567-890
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} ParkEase. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-sm text-gray-600 hover:text-black">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-gray-600 hover:text-black">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-gray-600 hover:text-black">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

