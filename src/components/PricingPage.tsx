import React from 'react';
import { Check, Star } from 'lucide-react';
import { pricingTiers } from '../data/pricing';
import { useNavigate } from 'react-router-dom';


export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select the perfect plan to showcase your talent and connect with industry professionals.
            Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
        <div
          key={tier.name}
          className={`relative bg-gray-800 rounded-2xl p-8 flex flex-col ${
            tier.featured
              ? 'ring-2 ring-yellow-400 transform scale-105'
              : 'hover:bg-gray-750'
          } transition-all`}
        >
          {tier.featured && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 capitalize">
              {tier.name}
            </h3>
            <div className="mb-4">
              <span className="text-5xl font-bold text-yellow-400">
                ₹{tier.price}
              </span>
              {tier.price > 0 && (
                <span className="text-gray-400 text-lg">/month</span>
              )}
            </div>
            <p className="text-gray-400">
              {tier.portfolioLimit === Infinity
                ? 'Unlimited portfolio items'
                : `Up to ${tier.portfolioLimit} portfolio items`}
            </p>
          </div>

          {/* Features → flex-grow makes cards equal height */}
          <ul className="space-y-4 mb-8 flex-grow">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Button → always stays at bottom */}
          <div className="mt-auto">
            <button
              onClick={() => {
                if (tier.price === 0) {
                  navigate('register'); // Free Plan
                } else {
                  navigate('trial-steps'); // Silver & Gold
                }
              }}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                tier.featured
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {tier.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
            </button>
          </div>
        </div>

        ))}
      </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-400">
                All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. Your account will remain active until the end of the billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};