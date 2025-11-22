'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import PromptBuilderForm from '@/components/prompt-builder/PromptBuilderForm';

export default function PromptBuilderClient() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent-subtle text-text-primary border border-gray-200 dark:border-gray-700">
                Prompt Builder
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Build Design Prompts for Any AI Tool
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-text-secondary mb-8">
              Make any AI tool understand your design needs.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-tertiary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>8 Pre-built Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copy & Download</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Config File Export</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <PromptBuilderForm />

      <Footer />
      <ScrollToTop />
    </main>
  );
}
