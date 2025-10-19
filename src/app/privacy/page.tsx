import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | aiux - AI Design Patterns',
  description: 'Privacy Policy for aiux - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  const lastUpdated = 'October 19, 2025';

  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-secondary">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Introduction</h2>
              <p className="text-text-secondary leading-relaxed">
                This Privacy Policy describes how aiux (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your
                personal information when you use our website and services. We are committed to protecting your privacy and
                being transparent about our data practices.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 text-text-primary">Information You Provide</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                We collect information that you voluntarily provide to us:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li><strong className="text-text-primary">Email Address:</strong> When you subscribe to our newsletter to receive updates about new AI design patterns</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6 text-text-primary">Automatically Collected Information</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                We may automatically collect certain information when you visit our website:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li><strong className="text-text-primary">Usage Data:</strong> Information about how you interact with our website, including pages visited and time spent</li>
                <li><strong className="text-text-primary">Device Information:</strong> Browser type, operating system, and device type</li>
                <li><strong className="text-text-primary">Analytics:</strong> We use Vercel Analytics to understand website performance and user behavior (anonymized)</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">How We Use Your Information</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li>To send you newsletter updates about new AI design patterns and project updates</li>
                <li>To improve our website and user experience</li>
                <li>To respond to your inquiries and feedback</li>
                <li>To analyze website usage and performance</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            {/* Data Storage and Security */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Data Storage and Security</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We take the security of your data seriously:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li><strong className="text-text-primary">Storage:</strong> Email addresses are stored in a secure SQLite database managed through Prisma ORM</li>
                <li><strong className="text-text-primary">Email Service:</strong> We use Resend, a trusted email service provider, to send newsletter emails</li>
                <li><strong className="text-text-primary">Access Control:</strong> Only authorized personnel have access to subscriber data</li>
                <li><strong className="text-text-primary">Encryption:</strong> Data transmission is encrypted using HTTPS</li>
                <li><strong className="text-text-primary">Retention:</strong> We retain your email address until you unsubscribe or request deletion</li>
              </ul>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Third-Party Services</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use the following third-party services that may collect information:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li><strong className="text-text-primary">Vercel:</strong> Hosting and analytics (privacy policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover">vercel.com/legal/privacy-policy</a>)</li>
                <li><strong className="text-text-primary">Resend:</strong> Email delivery service (privacy policy: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-hover">resend.com/legal/privacy-policy</a>)</li>
              </ul>
            </div>

            {/* Cookies and Tracking */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Cookies and Tracking Technologies</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Our website uses minimal cookies and tracking technologies:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li><strong className="text-text-primary">Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong className="text-text-primary">Analytics Cookies:</strong> Used to understand website usage (Vercel Analytics)</li>
                <li><strong className="text-text-primary">Local Storage:</strong> We may use browser local storage for user preferences (e.g., theme, favorites)</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Your Rights and Choices</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-text-secondary ml-6 list-disc">
                <li><strong className="text-text-primary">Unsubscribe:</strong> You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email</li>
                <li><strong className="text-text-primary">Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong className="text-text-primary">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-text-primary">Deletion:</strong> Request deletion of your personal information</li>
                <li><strong className="text-text-primary">Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
                <li><strong className="text-text-primary">Object:</strong> Object to our processing of your personal information</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:imranrizom@gmail.com" className="text-accent-primary hover:text-accent-hover">
                  imranrizom@gmail.com
                </a>
              </p>
            </div>

            {/* International Users */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">International Users</h2>
              <p className="text-text-secondary leading-relaxed">
                If you are accessing our website from outside the United States, please be aware that your information may be
                transferred to, stored, and processed in the United States or other countries where our service providers operate.
                By using our website, you consent to such transfer.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Children&apos;s Privacy</h2>
              <p className="text-text-secondary leading-relaxed">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information
                from children under 13. If you believe we have collected information from a child under 13, please contact us
                immediately.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Changes to This Privacy Policy</h2>
              <p className="text-text-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by updating the
                &quot;Last updated&quot; date at the top of this page. We encourage you to review this Privacy Policy periodically
                for any changes. Your continued use of our website after any modifications indicates your acceptance of the
                updated Privacy Policy.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">Contact Us</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-6 bg-surface-primary border border-border-primary rounded-lg">
                <p className="text-text-secondary mb-2">
                  <strong className="text-text-primary">Email:</strong>{' '}
                  <a href="mailto:imranrizom@gmail.com" className="text-accent-primary hover:text-accent-hover">
                    imranrizom@gmail.com
                  </a>
                </p>
                <p className="text-text-secondary">
                  <strong className="text-text-primary">Project:</strong> aiux - AI Design Patterns
                </p>
              </div>
            </div>

            {/* GDPR Compliance */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-text-primary">GDPR Compliance</h2>
              <p className="text-text-secondary leading-relaxed">
                For users in the European Union, we comply with the General Data Protection Regulation (GDPR). We process your
                personal data based on your consent (newsletter subscription) and our legitimate interests (website analytics and
                improvement). You have the right to withdraw your consent at any time by unsubscribing from our newsletter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
