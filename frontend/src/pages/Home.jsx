import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Scale, 
  Gavel, 
  Shield, 
  Users, 
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  BookOpen,
  ChevronRight,
  TrendingUp,
  FileText,
  Building2,
  Landmark,
  GraduationCap,
  Target
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: Award, value: "25+", label: "Years Experience", color: "border-blue-500" },
    { icon: Users, value: "500+", label: "Happy Clients", color: "border-green-500" },
    { icon: Scale, value: "100+", label: "Expert Lawyers", color: "border-purple-500" },
    { icon: Shield, value: "98%", label: "Success Rate", color: "border-orange-500" }
  ];

  const practiceAreas = [
    {
      icon: Building2,
      title: "Corporate Law",
      description: "Expert counsel for businesses of all sizes, from startups to multinational corporations.",
      border: "border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950"
    },
    {
      icon: Gavel,
      title: "Criminal Defense",
      description: "Aggressive representation to protect your rights and freedom in criminal matters.",
      border: "border-red-500",
      bg: "bg-red-50 dark:bg-red-950"
    },
    {
      icon: Heart,
      title: "Family Law",
      description: "Compassionate guidance through divorce, custody, and family-related legal matters.",
      border: "border-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950"
    },
    {
      icon: Briefcase,
      title: "Employment Law",
      description: "Protecting employee rights and employer interests in workplace disputes.",
      border: "border-green-500",
      bg: "bg-green-50 dark:bg-green-950"
    },
    {
      icon: BookOpen,
      title: "Intellectual Property",
      description: "Safeguarding your innovations, trademarks, and creative works.",
      border: "border-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950"
    },
    {
      icon: Landmark,
      title: "Civil Litigation",
      description: "Skilled representation in complex civil disputes and court proceedings.",
      border: "border-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "The team at LegalCompliance handled my corporate merger with exceptional professionalism. Their attention to detail saved us from potential legal pitfalls.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Priya Sharma",
      role: "Startup Founder",
      content: "I was struggling with intellectual property issues until I found LegalCompliance. They secured my patents and provided invaluable advice.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "Amit Patel",
      role: "Individual Client",
      content: "Their family law experts helped me navigate a difficult divorce with compassion and professionalism. I couldn't have asked for better representation.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  const achievements = [
    { icon: Scale, count: "10,000+", label: "Cases Won" },
    { icon: Users, count: "500+", label: "Clients Served" },
    { icon: Award, count: "25+", label: "Legal Awards" },
    { icon: Clock, count: "24/7", label: "Client Support" }
  ];

  const featuredLawyers = [
    {
      name: "Adv. Vikram Singh",
      expertise: "Corporate Law",
      experience: "15 years",
      cases: "200+ cases",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
      name: "Adv. Meera Reddy",
      expertise: "Criminal Defense",
      experience: "12 years",
      cases: "150+ cases",
      image: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
      name: "Adv. Suresh Iyer",
      expertise: "Family Law",
      experience: "18 years",
      cases: "300+ cases",
      image: "https://randomuser.me/api/portraits/men/6.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section - Sharp edges, geometric pattern */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900">
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-0 h-full">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className={`grid lg:grid-cols-2 gap-12 items-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center border border-blue-500 bg-blue-500/10 px-3 py-1 mb-6">
                <Shield className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-xs font-medium text-blue-400">TRUSTED SINCE 1998</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Legal Excellence,
                <span className="block text-blue-400 mt-2">Proven Results</span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                We provide sophisticated legal counsel to corporations and individuals 
                facing complex regulatory challenges. Trust our 25+ years of experience 
                and track record of success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors border-2 border-transparent group"
                >
                  Get Consultation
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Right Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white/5 border-l-4 ${stat.color} p-6`}
                  >
                    <Icon className="h-8 w-8 text-blue-400 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Bar */}
      <section className="bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center border-r border-gray-200 dark:border-gray-700 last:border-0">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-4">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">WHAT WE DO</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Practice Areas
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive legal expertise across multiple domains to serve all your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div
                  key={index}
                  className={`group border-l-4 ${area.border} ${area.bg} p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className={`inline-flex p-3 bg-white dark:bg-gray-800 border ${area.border} mb-4`}>
                    <Icon className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {area.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {area.description}
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center border border-purple-600 px-3 py-1 mb-4">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">OUR TEAM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Expert Lawyers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Seasoned professionals dedicated to protecting your rights and interests
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredLawyers.map((lawyer, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm">{lawyer.experience}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {lawyer.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {lawyer.expertise}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{lawyer.experience}</span>
                    <span>{lawyer.cases}</span>
                  </div>
                  <Link
                    to="/about"
                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-t border-gray-200 dark:border-gray-700 pt-4 w-full"
                  >
                    View Profile
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center border border-yellow-500 px-3 py-1 mb-4">
              <Star className="h-4 w-4 text-yellow-500 mr-2 fill-current" />
              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Client Success Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from clients we've helped protect their rights and secure their future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 object-cover mr-3"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 dark:bg-black border-t border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Future?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Schedule a consultation with our expert lawyers today and take the first step towards protecting your rights.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors border-2 border-transparent group"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">LegalCompliance</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Trusted legal partner since 1998, providing expert counsel to corporations and individuals.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition">Login</Link></li>
                <li><Link to="/register" className="text-sm text-gray-400 hover:text-white transition">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Practice Areas</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-400">Corporate Law</li>
                <li className="text-sm text-gray-400">Criminal Defense</li>
                <li className="text-sm text-gray-400">Family Law</li>
                <li className="text-sm text-gray-400">Intellectual Property</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-400">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>+91 12345 67890</span>
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>info@legalcompliance.com</span>
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} LegalCompliance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}