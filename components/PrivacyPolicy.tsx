
import React from 'react';
import { Shield } from 'lucide-react';
import SEOHead from './SEOHead';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <SEOHead 
        title="Privacy Policy & Terms of Service | Reduce My Insurance"
        description="Read our privacy policy and terms of service. Learn how we protect your data and your rights when using our insurance services."
        canonicalUrl="https://www.reducemyinsurance.net/privacy"
        keywords={['privacy policy', 'terms of service', 'data protection', 'insurance agency privacy']}
      />
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Privacy Policy & Terms</h1>
        <p className="text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="glass-card p-8 md:p-12 rounded-[2rem] border-white/10 space-y-8 text-slate-300 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" /> Introduction
          </h2>
          <p>
            This Privacy Policy and Communication Consent Form outlines the practices of ReduceMyInsurance.Net ("we", "us", or "our"), an independent insurance agency, regarding the collection, use, and disclosure of your information. We represent multiple insurance companies and offer various insurance products, including but not limited to home, auto, business, general liability, workers compensation, life, and health insurance. This policy is designed to help you understand how we handle your personal information and your rights in relation to that information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Information Collection</h2>
          <p>
            We collect personal information that you provide to us directly, such as your name, address, phone number, email address, social security number, driver's license number, employment history, and financial information. We may also obtain information from third parties, including credit bureaus, motor vehicle reports, business credit profiles, and C.L.U.E. (Comprehensive Loss Underwriting Exchange) reports, to assess eligibility and pricing for insurance products.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Use of Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Determine your eligibility for insurance products.</li>
            <li>Provide accurate insurance quotes and offers.</li>
            <li>Facilitate the application process with insurance companies we represent.</li>
            <li>Communicate with you regarding your insurance needs and policy updates.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Disclosure of Information</h2>
          <p>
            We may share your personal information with insurance companies we represent and third-party service providers as necessary to offer you insurance products and services. These companies may use your information to run credit checks, review motor vehicle reports, verify employment history, assess business credit profiles, and conduct other evaluations needed for eligibility and pricing determinations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Consent for Data Processing & Sharing</h2>
          <p>
            By engaging with ReduceMyInsurance.Net, you consent to the processing and sharing of your personal data as necessary for the provision of insurance services. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Insurance Carrier Partners, MGAs, and Brokerage Markets:</strong> To obtain insurance quotes, verify coverage, and manage policies.</li>
            <li><strong>Third-Party Software Providers:</strong> For the administration of insurance services and customer support.</li>
            <li><strong>Consumer Reports & Third-Party Data:</strong> We may obtain consumer reports, credit checks, motor vehicle reports, employment histories, and other relevant data to assess eligibility and pricing.</li>
          </ul>
          <p className="text-sm italic mt-2">
            Purpose of Data Sharing: The sharing of your data is strictly for the purpose of providing you with tailored insurance solutions, including determining eligibility, pricing, and offering the best possible insurance options.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Communication Consent</h2>
          <p>
            By providing your phone number, email address and other contact details, you consent to receive communications from us, including but not limited to, sms/text messages, emails, and phone calls regarding insurance products and services, policy updates, and renewal reminders. We comply with 10DLC (10 Digit Long Code) standards for SMS messaging, ensuring responsible communication practices.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Email Communications:</strong> For detailed insights, policy documents, and service notifications.</li>
            <li><strong>SMS Messaging & Automated Texts:</strong> For timely updates, responses to your inbound communications sending policy information, and exclusive offers. Standard message and data rates may apply. Reply STOP to opt out.</li>
            <li><strong>Phone Calls:</strong> You also consent to receive phone calls from us, which may be automated or pre-recorded, for the purposes described above.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Protection of Information</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy and Communication Consent Form, please contact us at: <a href="mailto:service@ReduceMyInsurance.Net" className="text-blue-400 hover:text-blue-300">service@ReduceMyInsurance.Net</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
