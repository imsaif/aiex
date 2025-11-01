import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | aiux - AI Design Patterns',
  description: 'Terms of Service for aiux - Read the terms and conditions for using our AI design patterns resource.',
};

export default function TermsPage() {
  const lastUpdated = 'October 19, 2025';

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-text-secondary">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">1. Agreement to Terms</h2>
              <p className="text-text-secondary leading-relaxed">
                By accessing and using aiux (&quot;the Website&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you accept and agree to be bound by
                these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Website.
              </p>
            </div>

            {/* Description of Service */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">2. Description of Service</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                aiux is an educational and informational resource that provides:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>A curated collection of 24 AI design patterns</li>
                <li>Design guidelines and best practices for AI user experiences</li>
                <li>Code examples and interactive demonstrations</li>
                <li>Educational content about AI design principles</li>
                <li>Newsletter updates about new patterns and resources</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                The Website is provided free of charge for educational and informational purposes only.
              </p>
            </div>

            {/* Open Source */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">3. Open Source License</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                This project is open source and available on{' '}
                <a
                  href="https://github.com/imsaif/aiex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:text-accent-hover"
                >
                  GitHub
                </a>
                . The source code and content are subject to the terms of the open source license included in the repository.
                You are free to:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>View, fork, and modify the source code</li>
                <li>Use the design patterns and examples in your projects</li>
                <li>Contribute improvements and suggestions</li>
                <li>Share and distribute the content with proper attribution</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">4. Intellectual Property Rights</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Unless otherwise stated:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>The Website content, design patterns, code examples, and documentation are owned by aiux and its contributors</li>
                <li>The aiux name and logo are trademarks of the project creator</li>
                <li>Third-party trademarks and logos used in examples remain the property of their respective owners</li>
                <li>User-contributed content may be subject to separate license terms</li>
              </ul>
            </div>

            {/* Acceptable Use */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">5. Acceptable Use Policy</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                When using the Website, you agree NOT to:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>Use the Website for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Website or its systems</li>
                <li>Interfere with or disrupt the Website or servers</li>
                <li>Use automated systems (bots, scrapers) without permission</li>
                <li>Reproduce, distribute, or create derivative works without proper attribution</li>
                <li>Remove or modify any copyright, trademark, or other proprietary notices</li>
                <li>Impersonate any person or entity</li>
                <li>Transmit any viruses, malware, or harmful code</li>
              </ul>
            </div>

            {/* User Content and Contributions */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">6. User Content and Contributions</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                If you submit feedback, suggestions, or contributions to the project:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>You grant us a non-exclusive, worldwide, royalty-free license to use, modify, and incorporate your contributions</li>
                <li>You represent that you have the right to submit the contribution</li>
                <li>You agree that your contribution does not violate any third-party rights</li>
                <li>We may use your contribution without attribution, though we typically acknowledge contributors</li>
              </ul>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">7. Third-Party Links and Resources</h2>
              <p className="text-text-secondary leading-relaxed">
                The Website may contain links to third-party websites, services, or resources. We do not endorse, control, or
                assume responsibility for any third-party content. Your use of third-party websites is at your own risk and
                subject to their terms and conditions.
              </p>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">8. Disclaimer of Warranties</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                THE WEBSITE AND ITS CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties that the Website will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                We do not guarantee that the design patterns, code examples, or recommendations will meet your specific needs or
                produce specific results.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">9. Limitation of Liability</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL AIUX, ITS CREATOR, CONTRIBUTORS, OR SERVICE PROVIDERS
                BE LIABLE FOR ANY:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Damages resulting from your use or inability to use the Website</li>
                <li>Damages resulting from any unauthorized access to or use of our servers</li>
                <li>Damages resulting from any errors or omissions in the content</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability,
                or any other basis, even if we have been advised of the possibility of such damage.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">10. Indemnification</h2>
              <p className="text-text-secondary leading-relaxed">
                You agree to indemnify, defend, and hold harmless aiux, its creator, contributors, and service providers from
                any claims, liabilities, damages, losses, and expenses (including legal fees) arising from your use of the
                Website, your violation of these Terms, or your violation of any rights of another person or entity.
              </p>
            </div>

            {/* Modifications to Service */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">11. Modifications to the Website</h2>
              <p className="text-text-secondary leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Website (or any part thereof) at any time without
                notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of
                the Website.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">12. Changes to These Terms</h2>
              <p className="text-text-secondary leading-relaxed">
                We may update these Terms from time to time. We will notify users of any material changes by updating the
                &quot;Last updated&quot; date at the top of this page. Your continued use of the Website after any changes indicates
                your acceptance of the new Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">13. Governing Law and Jurisdiction</h2>
              <p className="text-text-secondary leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where the project
                creator resides, without regard to its conflict of law provisions. Any disputes arising from these Terms or your
                use of the Website shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">14. Severability</h2>
              <p className="text-text-secondary leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain
                in full force and effect. The invalid or unenforceable provision shall be replaced with a valid provision that
                most closely matches the intent of the original provision.
              </p>
            </div>

            {/* Entire Agreement */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">15. Entire Agreement</h2>
              <p className="text-text-secondary leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and aiux regarding
                your use of the Website and supersede all prior agreements and understandings.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">16. Contact Information</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="p-6 bg-surface-primary border border-primary rounded-lg">
                <p className="text-text-secondary mb-2">
                  <strong className="text-text-primary">Email:</strong>{' '}
                  <a href="mailto:imranrizom@gmail.com" className="text-accent-primary hover:text-accent-hover">
                    imranrizom@gmail.com
                  </a>
                </p>
                <p className="text-text-secondary mb-2">
                  <strong className="text-text-primary">Project:</strong> aiux - AI Design Patterns
                </p>
                <p className="text-text-secondary">
                  <strong className="text-text-primary">GitHub:</strong>{' '}
                  <a
                    href="https://github.com/imsaif/aiex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:text-accent-hover"
                  >
                    github.com/imsaif/aiex
                  </a>
                </p>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-text-primary">Acknowledgment</h3>
              <p className="text-text-secondary leading-relaxed">
                By using aiux, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
