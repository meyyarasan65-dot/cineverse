import React from "react";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="w-12 h-12 text-primary" />
        <h1 className="text-4xl font-bold text-text-primary">Privacy Policy</h1>
      </div>
      
      <div className="prose prose-invert max-w-none text-text-muted space-y-6">
        <p><strong>Effective Date:</strong> January 1, 2024</p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">1. Information We Collect</h2>
        <p>
          This is a dummy privacy policy for demonstration purposes. We collect the information you provide when creating an account, such as your email address and username. We also track your interactions on the platform, such as movies you add to your watchlist or favorites.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">2. How We Use Information</h2>
        <p>
          We use the information we collect to operate, maintain, and provide the features and functionality of the Service. 
          Your email is solely used for authentication via Supabase and will not be shared with third parties or used for marketing purposes.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">3. Data Security</h2>
        <p>
          We care about the security of your information and use commercially reasonable safeguards to preserve the integrity and security of all information we collect and that we share with our service providers. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">4. Changes to Our Privacy Policy</h2>
        <p>
          We may modify or update this Privacy Policy from time to time, so please review it periodically. We may provide you additional forms of notice of modifications or updates as appropriate under the circumstances.
        </p>
      </div>
    </div>
  );
}
