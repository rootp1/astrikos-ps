import LeafletMap from "../components/LeafletMap";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';

export default function Page() {
  const { data: session } = useSession();
  const videoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const router = useRouter();


  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current) return;

      const heroHeight = heroSectionRef.current.offsetHeight;
      const scrollPosition = window.scrollY;

      // Calculate scroll progress as a percentage (0 to 1)
      const progress = Math.min(scrollPosition / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", () => {
        setIsVideoLoaded(true);
      });

      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Fixed Video Background */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted={true}
          playsInline
          loop
          preload="auto"
        >
          <source
            src="https://videos.pexels.com/video-files/2818559/2818559-sd_640_360_24fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Video Overlay with Parallax Effect */}
        <div
          className="absolute inset-0 bg-black bg-opacity-70 z-10"
          style={{
            opacity: 0.5 + scrollProgress * 0.3,
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section ref={heroSectionRef} className="relative h-screen">
        {/* Header */}
        <header className="relative z-20 bg-transparent py-4">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
                AstriVerse
              </h1>
              <p className="text-gray-200 text-sm">Explore beyond</p>
            </div>

            <nav className="hidden md:flex space-x-6">
              <a
                href="/features.html"
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Features
              </a>
              <a
                href="#about"
                className="hover:text-purple-400 transition-colors duration-300"
              >
                About
              </a>
              <Link href="/plans.html" className="hover:text-purple-400 transition-colors duration-300">
                Plans
              </Link>
              <a
                href="#resources"
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Resources
              </a>
              <a
                href="#about"
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Partner Program
              </a>
              <a
                href="#showcase"
                className="hover:text-purple-400 transition-colors duration-300"
              >
                News
              </a>
              <a
                href="#contact"
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Contact
              </a>
            </nav>
            {session && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    router.replace("/Profile");
                  }}
                >
                  <img
                    src={session.user.image}
                    className="w-10 h-10 cursor-pointer rounded-full shadow-lg transition duration-200 hover:brightness-90 active:brightness-75"
                    alt="Profile"
                  />
                </button>
                <button
                  onClick={() => logoutHandler()}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Content with Parallax Effect */}
        <div
          className="relative z-20 h-full flex items-center justify-center"
          style={{
            transform: `translateY(${scrollProgress * 30}px)`,
            opacity: 1 - scrollProgress * 0.8,
          }}
        >
          <div className="text-center max-w-4xl px-4">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-600">
              Visualize Your World in 2D & 3D
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Interactive mapping solutions for a new perspective on spatial
              data
            </p>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
              Unlock the power of geospatial visualization with our cutting-edge
              platform that transforms complex data into intuitive, interactive
              experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-gradient-to-r cursor-pointer from-purple-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
                Get Started
              </button>
              <button className="bg-transparent border-2 cursor-pointer border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20"
          style={{ opacity: 1 - scrollProgress * 2 }}
        >
          <div className="flex flex-col items-center">
            <p className="mb-2 text-gray-300">Scroll to explore</p>
            <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce mt-2"></div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-600 z-50"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </section>

      {/* Features Section with Parallax Effect */}
      <section id="features" className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-pulse">
            Key Features
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Our platform combines powerful visualization capabilities with
            intuitive controls, enabling you to explore and understand spatial
            data like never before.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg hover:transform hover:-translate-y-2 transition-transform duration-300 border border-purple-500 shadow-xl hover:shadow-purple-500/20 animate-fadeIn">
              <div className="text-pink-400 text-4xl mb-4">
                <svg
                  className="w-12 h-12 animate-float"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-pink-300">
                Interactive 3D Maps
              </h3>
              <p className="text-gray-300 mb-4">
                Explore detailed 3D visualizations with intuitive controls for
                an immersive experience.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Real-time navigation and rotation
                </li>
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Customizable viewing angles
                </li>
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Seamless zooming capabilities
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg hover:transform hover:-translate-y-2 transition-transform duration-300 border border-blue-500 shadow-xl hover:shadow-blue-500/20 animate-fadeIn delay-100">
              <div className="text-blue-400 text-4xl mb-4">
                <svg
                  className="w-12 h-12 animate-float"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-300">
                Advanced Analysis
              </h3>
              <p className="text-gray-300 mb-4">
                Powerful analytical tools to understand spatial relationships
                and discover patterns in your data.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Pattern recognition algorithms
                </li>
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Spatial correlation tools
                </li>
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Predictive modeling capabilities
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg hover:transform hover:-translate-y-2 transition-transform duration-300 border border-purple-500 shadow-xl hover:shadow-purple-500/20 animate-fadeIn delay-200">
              <div className="text-purple-400 text-4xl mb-4">
                <svg
                  className="w-12 h-12 animate-float"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-300">
                Data Integration
              </h3>
              <p className="text-gray-300 mb-4">
                Seamlessly import and visualize your custom datasets to create
                meaningful map visualizations.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Support for multiple data formats
                </li>
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Real-time data synchronization
                </li>
                <li className="transform transition-transform hover:translate-x-2 duration-300">
                  • Automated data cleaning tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Leaflet Map Section */}
      <section id="map" className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
            Interactive Map
          </h2>
          <p className="text-gray-300 text-center mb-8 max-w-3xl mx-auto">
            Explore our interactive map to discover how AstriVerse transforms
            spatial data visualization. Zoom in, pan around, and experience the
            power of our mapping technology.
          </p>

          <div className="max-w-5xl mx-auto bg-gray-800 p-4 rounded-lg border border-purple-500/30 shadow-2xl animate-fadeIn">
            <div id="mapContainer" className="h-96 rounded-lg overflow-hidden">
              <LeafletMap />
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Enhanced Colors and Parallax Effect */}
      <section id="about" className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900 to-blue-900 opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 animate-slideInLeft">
              <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                About AstriVerse
              </h2>
              <p className="text-gray-300 mb-6">
                AstriVerse is the next generation of mapping visualization
                tools, designed to transform complex spatial data into
                intuitive, interactive experiences. Our platform combines
                cutting-edge technology with user-friendly interfaces to make
                map exploration accessible to everyone.
              </p>
              <p className="text-gray-300 mb-6">
                Whether you're a data scientist, urban planner, or just curious
                about the world around you, AstriVerse provides the tools you
                need to visualize, analyze, and understand spatial relationships
                like never before.
              </p>
              <p className="text-gray-300 mb-6">
                Founded by a team of experts in geospatial analysis and data
                visualization, AstriVerse is committed to pushing the boundaries
                of what's possible with modern mapping technology. Our mission
                is to democratize access to powerful spatial analysis tools and
                make them intuitive for users of all skill levels.
              </p>
              <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg animate-pulse">
                Our Story
              </button>
            </div>
            <div className="md:w-1/2 bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-purple-500/30 animate-slideInRight">
              <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="/api/placeholder/800/450"
                  alt="About AstriVerse"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
            Showcase
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Discover how organizations around the world are using AstriVerse to
            transform their spatial data into actionable insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-900 bg-opacity-70 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-pink-500/30 group animate-fadeIn">
              <div className="h-64 bg-gray-800 flex items-center justify-center overflow-hidden">
                {/* Removed the gradient overlay that changes on hover */}
                <img
                  src="/api/placeholder/600/400"
                  alt="Urban Planning Case Study"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 border-t border-pink-500/20">
                <h3 className="text-2xl font-bold mb-3 text-pink-300">
                  Urban Planning Revolution
                </h3>
                <p className="text-gray-300 mb-4">
                  See how city planners are using AstriVerse to visualize
                  traffic patterns, population density, and infrastructure needs
                  to create smarter, more sustainable urban environments.
                </p>
                <a
                  href="#"
                  className="text-pink-400 inline-flex items-center group"
                >
                  <span className="border-b border-pink-400">
                    Read Case Study
                  </span>
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-gray-900 bg-opacity-70 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-blue-500/30 group animate-fadeIn delay-100">
              <div className="h-64 bg-gray-800 flex items-center justify-center overflow-hidden">
                {/* Removed the gradient overlay that changes on hover */}
                <img
                  src="/api/placeholder/600/400"
                  alt="Environmental Analysis"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 border-t border-blue-500/20">
                <h3 className="text-2xl font-bold mb-3 text-blue-300">
                  Environmental Analysis
                </h3>
                <p className="text-gray-300 mb-4">
                  Discover how environmental scientists are tracking climate
                  change impacts, biodiversity patterns, and ecological systems
                  with AstriVerse's advanced visualization tools.
                </p>
                <a
                  href="#"
                  className="text-blue-400 inline-flex items-center group"
                >
                  <span className="border-b border-blue-400">View Project</span>
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 animate-pulse">
            Get In Touch
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Have questions about AstriVerse or want to schedule a demo? Our team
            is ready to help you explore the possibilities.
          </p>
          <div className="max-w-3xl mx-auto">
            <form className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full bg-gray-800 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                  placeholder="Your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg animate-pulse"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 mb-4">
                AstriVerse
              </h3>
              <p className="text-gray-400 mb-4">
                Transforming spatial data into meaningful insights with
                cutting-edge visualization technology.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    AstriVerse Pro
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    AstriVerse Enterprise
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Data Integration
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    API Access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-gray-400">
              © 2025 AstriVerse. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
