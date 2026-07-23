import React from "react";
import { Scale } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Scale className="w-12 h-12 text-primary" />
        <h1 className="text-4xl font-bold text-text-primary">Terms of Service</h1>
      </div>
      
      <div className="prose prose-invert max-w-none text-text-muted space-y-6">
        <p><strong>Effective Date:</strong> January 1, 2024</p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">1. Acceptance of Terms</h2>
        <p>
          By accessing and using this dummy application, you accept and agree to be bound by the terms and provision of this agreement. 
          This is a demonstration project, and no real legal agreement is taking place.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">2. Use of Service</h2>
        <p>
          You agree to use the service for its intended purpose of browsing and tracking movies. You must not use the platform for any illegal or unauthorized purpose.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">3. User Accounts</h2>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
        </p>

        <h2 className="text-2xl font-semibold text-text-primary mt-8">4. Data and Content</h2>
        <p>
          Movie data is provided by TMDB. We do not claim ownership of any movie posters, backdrops, or descriptions. All movie metadata belongs to their respective owners.
        </p>
      </div>
    </div>
  );
}
