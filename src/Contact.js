import React, { useState } from "react";
import { Mail, MessageSquare, Send, Github } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipients =
      "laitanawe@gmail.com,sohamshirolkar24@gmail.com,lewistem8@gmail.com";
    const subject = encodeURIComponent(`BrainRouteDB: ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    );
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions about our data or models? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              General Inquiries
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-slate-900">Olaitan I. Awe</p>
                <a
                  href="mailto:laitanawe@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  laitanawe@gmail.com
                </a>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Soham Shirolkar</p>
                <a
                  href="mailto:sohamshirolkar24@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  sohamshirolkar24@gmail.com
                </a>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Lewis Tem</p>
                <a
                  href="mailto:lewistem8@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  lewistem8@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Github className="w-5 h-5 text-blue-600" />
              Technical Issues
            </h3>
            <p className="text-slate-600 mb-4 text-sm">
              Found a bug or have a technical question? Please create an issue
              on our GitHub repository.
            </p>
            <a
              href="https://github.com/omicscodeathon/brainroutedb/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              Create Issue
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
