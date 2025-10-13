import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bus,
  Shield,
  Users,
  MapPin,
  Bell,
  BarChart3,
  Settings,
  User,
  ShieldCheck,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Monitor,
  Smartphone,
  Database,
  Lock,
  Zap,
  Globe,
  Layers
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const handleParentLogin = () => {
    navigate('/parent/login');
  };

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Modern Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Bus className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-neutral-900">SafeGo</span>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleParentLogin}
                className="px-4 py-2 text-neutral-700 hover:text-blue-600 transition-colors duration-200"
              >
                Parent Portal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogin}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                Admin Portal
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  className="text-5xl lg:text-7xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  SafeGo
                  <span className="block text-3xl lg:text-5xl font-medium text-white/80 mt-2">
                    Smart Transportation
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl text-white/90 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Safe, Secure, and Reliable School Transportation Management System designed for peace of mind and operational excellence.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleParentLogin}
                  className="group flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
                >
                  <User className="w-5 h-5 mr-2" />
                  Parent Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdminLogin}
                  className="group flex items-center justify-center px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Portal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-9xl lg:text-9xl text-center"
                >
                  🚌
                </motion.div>

                {/* Floating cards around the bus */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute top-10 left-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-800">Real-time Tracking</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-800">Instant Alerts</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute bottom-1/2 left-5 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Maximum Safety</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection('overview')}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/70"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* System Overview Section */}
      <section id="overview" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-7xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                🚀 System Overview
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Bus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Complete Bus Management
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  SafeGo is a full-stack web application designed to streamline bus transportation operations.
                  It provides complete solution for managing buses, drivers, coordinators, and passenger services.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-100"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Multi-Role Architecture
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Designed to support multiple user roles including Administrators, Coordinators, Drivers,
                  and Parents - each with tailored interfaces and functionality.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-100"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Secure & Modern
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Built with security-first approach using JWT authentication, secure password hashing,
                  and modern web development practices for reliable protection.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                🛠️ Technology Stack
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
              <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
                Built with modern technologies for reliability, performance, and scalability
              </p>
            </motion.div>

            <motion.div
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Frontend Stack */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                    <Monitor className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Frontend</h3>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">⚛️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">React 19.1.1</h4>
                      <p className="text-sm text-gray-600">Modern UI framework with hooks and concurrent features</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Tailwind CSS</h4>
                      <p className="text-sm text-gray-600">Utility-first CSS framework for rapid styling</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">React Router</h4>
                      <p className="text-sm text-gray-600">Client-side routing with role-based navigation</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Backend Stack */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                    <Settings className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Backend</h3>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🟢</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Node.js</h4>
                      <p className="text-sm text-gray-600">Runtime environment for server-side JavaScript</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Express.js</h4>
                      <p className="text-sm text-gray-600">Fast, unopinionated Node.js web framework</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Lock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">JWT Authentication</h4>
                      <p className="text-sm text-gray-600">Secure token-based authentication system</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Database Stack */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
                    <Database className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Database</h3>
                </div>

                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🍃</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">MongoDB</h4>
                      <p className="text-sm text-gray-600">NoSQL document database for flexible data storage</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mongoose ODM</h4>
                      <p className="text-sm text-gray-600">MongoDB object modeling for Node.js</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <Star className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Jest Testing</h4>
                      <p className="text-sm text-gray-600">JavaScript testing framework for reliable code</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h2
              className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ready to Experience SafeGo?
            </motion.h2>

            <motion.p
              className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of education institutions who trust SafeGo for reliable,
              safe, and efficient school transportation management.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleParentLogin}
                className="group flex items-center justify-center px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:shadow-xl transition-all duration-300"
              >
                <User className="w-6 h-6 mr-3" />
                Start as Parent
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdminLogin}
                className="group flex items-center justify-center px-10 py-5 bg-blue-800 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition-all duration-300"
              >
                <Shield className="w-6 h-6 mr-3" />
                Start as Administrator
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Bus className="w-10 h-10 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold">SafeGo</h3>
                  <p className="text-gray-400">Smart Transportation Solutions</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                SafeGo revolutionizes school transportation through innovative technology,
                ensuring safety, efficiency, and peace of mind for families and educational institutions.
              </p>

              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <span className="text-lg">📘</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <span className="text-lg">🐦</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <span className="text-lg">📧</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('overview')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleParentLogin}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Parent Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleAdminLogin}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2025 SafeGo. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>University Project</span>
              <span>•</span>
              <span>MERN Stack</span>
              <span>•</span>
              <span>Educational Demo</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
