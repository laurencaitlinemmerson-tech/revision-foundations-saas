'use client';

import { useState } from 'react';
import EditorialLayout from '@/components/EditorialLayout';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
import { Mail, Send, Loader2, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function ContactPage() {
  useScrollAnimation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    // In production, this would send to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };
   return (
     <EditorialLayout
       kicker="Contact"
       title="Get in Touch"
       standfirst="Have a question, suggestion, or just want to say hi? We’d love to hear from you!"
       byline="Revision Foundations"
       backHref="/dashboard"
       backLabel="Back to Dashboard"
     >
       <div className="bg-white rounded-2xl shadow p-6">
         <h2 className="text-lg font-semibold mb-2">Email</h2>
         <p className="mb-4 text-[var(--plum-dark)]/70">
           For support, feedback, or business enquiries, email us at:
         </p>
         <a
           href="mailto:hello@revisionfoundations.com"
           className="text-[var(--purple)] font-medium hover:underline"
         >
           hello@revisionfoundations.com
         </a>
       </div>
     </EditorialLayout>
   );
}
