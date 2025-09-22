import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { 
  Hotel, 
  Users, 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Shield,
  ArrowRight,
  Play,
  Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AnimatedSection = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}

const StatCard = ({ number, label, suffix = "", delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="text-center text-white"
    >
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {inView && <CountUp end={number} duration={2.5} />}{suffix}
      </div>
      <div className="text-lg opacity-90">{label}</div>
    </motion.div>
  )
}

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: Hotel,
      title: "Multi-Hotel Management",
      description: "Manage multiple properties from a single dashboard with role-based access control."
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Organize your team with hierarchical roles from super admin to front desk staff."
    },
    {
      icon: Star,
      title: "Restaurant Management",
      description: "Complete POS system, menu management, and kitchen operations for restaurants."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with real-time monitoring and backup systems."
    },
    {
      icon: MapPin,
      title: "Multi-Location",
      description: "Expand your business across multiple locations with centralized control."
    },
    {
      icon: Coffee,
      title: "Restaurant & F&B",
      description: "Integrated restaurant management with POS and inventory systems."
    }
  ]

  const amenities = [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Car, name: "Parking" },
    { icon: Coffee, name: "Restaurant" },
    { icon: Shield, name: "24/7 Security" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full"
          />
          <motion.div
            animate={{
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hotel Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Redefined
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-100"
          >
            Streamline operations, manage restaurants, and scale your hospitality business 
            with our comprehensive management platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              to="/rooms"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 text-lg"
            >
              Explore Rooms
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            {!isAuthenticated ? (
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-lg"
              >
                Get Started Free
                <Play className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                to={user?.role === 'super_admin' ? '/super-admin' : user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number={150} label="Hotels Managed" delay={0} />
            <StatCard number={12000} label="Rooms Available" delay={0.2} />
            <StatCard number={98} label="Customer Satisfaction" suffix="%" delay={0.4} />
            <StatCard number={24} label="Support Available" suffix="/7" delay={0.6} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From room management to guest services, our platform provides comprehensive tools 
              for modern hotel operations.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Designed for Every Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From super admins to front desk staff, everyone gets the tools they need
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                role: "Super Admin",
                color: "from-purple-500 to-indigo-600",
                features: ["System Control", "Admin Management", "Global Settings", "Analytics"]
              },
              {
                role: "Hotel Admin",
                color: "from-blue-500 to-cyan-600",
                features: ["Multi-Hotel Control", "Staff Management", "Revenue Reports", "Operations"]
              },
              {
                role: "Manager",
                color: "from-green-500 to-emerald-600",
                features: ["Daily Operations", "Staff Tasks", "Guest Relations", "Bookings"]
              },
              {
                role: "Staff",
                color: "from-orange-500 to-red-600",
                features: ["Guest Check-in", "Room Management", "Service Requests", "Housekeeping"]
              },
              {
                role: "Owner",
                color: "from-yellow-500 to-orange-600",
                features: ["Property Control", "Pricing Management", "Revenue Tracking", "Analytics"]
              },
              {
                role: "Restaurant Owner",
                color: "from-pink-500 to-rose-600",
                features: ["Menu Management", "POS System", "Kitchen Operations", "Order Tracking"]
              }
            ].map((item, index) => (
              <AnimatedSection key={index}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className={`bg-gradient-to-r ${item.color} w-full h-2 rounded-full mb-6`}></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.role}</h3>
                  <ul className="space-y-3">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-gray-600">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Hotel Business?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-100">
              Join thousands of successful hoteliers who trust our platform to manage 
              their operations and delight their guests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 text-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/demo"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-lg"
                  >
                    Watch Demo
                    <Play className="w-5 h-5" />
                  </Link>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default Home