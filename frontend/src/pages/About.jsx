import { Link } from "react-router-dom";
import aboutImg from "../assets/about.jpg";
import { Scale, Target, Eye, Heart, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About LawSatu
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                LawSatu is a full-service law firm providing expert legal
                guidance in civil, criminal, corporate, family and cyber law. We
                combine deep legal knowledge with real-world experience to
                protect your rights and deliver outcomes.
              </p>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold">15+</div>
                  <div className="text-blue-200 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold">3,200+</div>
                  <div className="text-blue-200 text-sm">Cases Handled</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold">98%</div>
                  <div className="text-blue-200 text-sm">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutImg}
                  alt="Law firm team"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mission */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide clear, ethical and result-oriented legal services
                that protect client interests and deliver justice.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted legal partner — respected for our
                integrity, professionalism and client-first approach.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Our Values
              </h3>
              <div className="text-gray-600 space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Integrity</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Excellence</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Transparency</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Client-First</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced team of lawyers is dedicated to providing you with
              the best legal solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="aspect-[4/3]">
                <img
                  src={aboutImg}
                  alt="Adv. Mohit Badgujar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900">
                  Adv. Mohit Badgujar
                </h4>
                <p className="text-blue-600 font-medium">
                  Senior Partner — Criminal & Civil Litigation
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="aspect-[4/3]">
                <img
                  src={aboutImg}
                  alt="Adv. Priya Sharma"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900">
                  Adv. Priya Sharma
                </h4>
                <p className="text-blue-600 font-medium">
                  Partner — Family & Matrimonial Law
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="aspect-[4/3]">
                <img
                  src={aboutImg}
                  alt="Adv. R. Gupta"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900">
                  Adv. R. Gupta
                </h4>
                <p className="text-blue-600 font-medium">
                  Corporate Counsel — Contracts & Compliance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need legal help today?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Book a consultation with our experts. We provide practical guidance
            and strategic legal solutions.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg"
          >
            Book Consultation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scale className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">
              LegalCompliance
            </span>
          </div>
          <p className="text-slate-400 mb-4">
            Providing clarity, compliance and professional legal support across
            sectors.
          </p>
          <div className="border-t border-slate-800 pt-8 text-slate-500">
            © 2025 LegalCompliance. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
