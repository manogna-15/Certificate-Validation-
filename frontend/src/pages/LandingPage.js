import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineQrcode,
  HiOutlineGlobe,
  HiOutlineCloudUpload,
  HiOutlineFingerPrint,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const LandingPage = () => {
  const features = [
    {
      icon: HiOutlineShieldCheck,
      title: 'Tamper-Proof',
      description:
        'Certificates are hashed and stored on the blockchain, making them impossible to forge or alter.',
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: HiOutlineLightningBolt,
      title: 'Instant Verification',
      description:
        'Verify any certificate in seconds using the certificate ID or cryptographic hash.',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      icon: HiOutlineQrcode,
      title: 'QR Code Support',
      description:
        'Each certificate gets a unique QR code for quick scanning and mobile verification.',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: HiOutlineGlobe,
      title: 'Decentralized',
      description:
        'Built on blockchain technology ensuring transparency, security, and immutability.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  const steps = [
    {
      icon: HiOutlineCloudUpload,
      step: '01',
      title: 'Upload Certificate',
      description:
        'Institutions upload student certificates with relevant details to the platform.',
    },
    {
      icon: HiOutlineFingerPrint,
      step: '02',
      title: 'Hash & Store on Blockchain',
      description:
        'The system generates a SHA-256 hash and records it on the blockchain for permanence.',
    },
    {
      icon: HiOutlineCheckCircle,
      step: '03',
      title: 'Verify Anytime',
      description:
        'Anyone can verify a certificate instantly using its ID, hash, or QR code.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-700/50 border border-primary-500/30 mb-6">
              <HiOutlineShieldCheck className="h-4 w-4 text-primary-300 mr-2" />
              <span className="text-sm text-primary-200 font-medium">Powered by Blockchain Technology</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Blockchain-Powered
              <span className="block mt-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Certificate Verification
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-primary-200 leading-relaxed">
              Secure, transparent, and instant verification of academic certificates
              using cutting-edge blockchain technology. Eliminate fraud and build trust.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/verify"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-900 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
              >
                Verify Certificate
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose CertifyChain?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Our platform combines the power of blockchain with an intuitive interface
              to revolutionize certificate management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Three simple steps to secure and verify academic credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-100 -translate-x-1/2" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-6 shadow-lg shadow-primary-200">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="text-xs font-bold text-primary-600 tracking-widest uppercase mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join institutions worldwide that trust CertifyChain for secure certificate management and verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-all duration-200"
            >
              Create Free Account
            </Link>
            <Link
              to="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Verify a Certificate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
