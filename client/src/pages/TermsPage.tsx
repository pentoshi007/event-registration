import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing and using Evently, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Event Registration</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Users are responsible for providing accurate information when registering for events. Event organizers reserve the right to cancel or modify events as needed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Conduct</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Users must conduct themselves in a respectful manner when using our platform and attending events. Inappropriate behavior may result in account suspension.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Privacy Policy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We respect your privacy and are committed to protecting your personal information. Please review our Privacy Policy for details on how we collect and use your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Evently shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Changes to Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;