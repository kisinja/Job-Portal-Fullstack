import { FaCalendarAlt, FaEnvelope, FaMapPin, FaPhoneAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {

    const today = new Date();

    const formatDate = (date) => {
        return date.split("T")[0];
    }

    return (
        <section className="max-w-screen-2xl mx-auto py-6 px-4 xl:px-24">
            <h1 className="text-2xl font-bold mb-4 text-blue">Privacy Policy</h1>
            <p className="text-gray-600 mb-4 flex items-center gap-2">
                <FaCalendarAlt className='text-lg text-primary/70' />
                Last Updated: {formatDate(today.toISOString())}
            </p>

            {/* Section 1: Information We Collect */}
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <h3 className="text-lg font-semibold mb-1">a. Personal Data</h3>
            <p className="mb-4">
                Personal Information: When you register on our site, apply for jobs, or engage in other activities, we may collect personally identifiable information such as your name, email address, phone number, postal address, and other contact or demographic information.
            </p>
            <p className="mb-4">
                Job-Related Information: Information related to your employment history, education, resume/CV, job preferences, and any other data you provide to apply for jobs on our portal.
            </p>
            <h3 className="text-lg font-semibold mb-1">b. Derivative Data</h3>
            <p className="mb-4">
                Log Data: Our servers automatically collect information when you access the Site, including your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.
            </p>
            <h3 className="text-lg font-semibold mb-1">c. Cookies and Tracking Technologies</h3>
            <p className="mb-4">
                Cookies and Web Beacons: We use cookies and similar tracking technologies to track activity on our Site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            {/* Section 2: How We Use Your Information */}
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p className="mb-4">
                We use the information we collect from you in the following ways:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>To facilitate account creation and login process.</li>
                <li>To manage job applications, communicate with potential employers on your behalf, and notify you about job opportunities.</li>
                <li>To improve our services, enhance and personalize your experience on the Site, and provide you with targeted content and advertisements.</li>
                <li>To communicate with you, including sending updates, newsletters, marketing materials, and other information that may be of interest to you.</li>
                <li>To comply with legal requirements and obligations.</li>
            </ul>

            {/* Section 3: Sharing Your Information */}
            <h2 className="text-xl font-semibold mb-2">3. Sharing Your Information</h2>
            <p className="mb-4">
                We may share your information with:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Employers: We share your job-related information with employers to facilitate the job application process.</li>
                <li>Third-Party Service Providers: We may employ third-party companies and individuals to facilitate our services (e.g., hosting, data analysis, customer support). These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
                <li>Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
            </ul>

            {/* Section 4: Data Security */}
            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p className="mb-4">
                We use administrative, technical, and physical security measures to protect your personal information. However, no security measures are completely foolproof, and we cannot guarantee the security of your data.
            </p>

            {/* Section 5: Your Rights and Choices */}
            <h2 className="text-xl font-semibold mb-2">5. Your Rights and Choices</h2>
            <p className="mb-4">
                You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li><strong>Access:</strong> You can request access to the personal data we hold about you.</li>
                <li><strong>Correction:</strong> You can request that we correct or update your personal information.</li>
                <li><strong>Deletion:</strong> You can request that we delete your personal data, subject to certain legal obligations.</li>
                <li><strong>Opt-Out:</strong> You can opt out of receiving marketing emails from us by following the unsubscribe link in those emails.</li>
            </ul>

            {/* Section 6: Children's Privacy */}
            <h2 className="text-xl font-semibold mb-2">6. Children{"'"}s Privacy</h2>
            <p className="mb-4">
                Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal data from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>

            {/* Section 7: Changes to This Privacy Policy */}
            <h2 className="text-xl font-semibold mb-2">7. Changes to This Privacy Policy</h2>
            <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Site with the updated date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            {/* Section 8: Contact Us */}
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4 flex items-center gap-2 font-bold">
                <svg width="25" height="25" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575E2" fillOpacity="0.4" />
                    <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575E2" />
                </svg>
                TechPoster
            </p>
            <p className="mb-4 flex items-center gap-5">
                <FaEnvelope
                    className='text-primary/70'
                />
                support@techposter.co.ke
            </p>
            <p
                className="mb-4 flex items-center gap-5">
                <FaPhoneAlt
                    className='text-primary/70'
                />
                +254 713782003, +254 759321026
            </p>
            <p
                className="mb-4 flex items-center gap-5">
                <FaMapPin
                    className='text-primary/70'
                />
                Nairobi, Kenya
            </p>
        </section>
    );
};

export default PrivacyPolicy;