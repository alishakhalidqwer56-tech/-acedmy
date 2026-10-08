import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useSite } from '../../context/SiteContext';
import { fetchSocialMedia, saveChatInquiry } from '../../lib/dataService';
import { SocialMedia } from '../../types';

export const ContactPage: React.FC = () => {
  const { settings } = useSite();
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadSocials() {
      try {
        const data = await fetchSocialMedia(true);
        if (mounted && data) setSocials(data);
      } catch (e) {
        console.warn('Social media load fallback:', e);
      }
    }
    loadSocials();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setIsSubmitting(true);
    try {
      await saveChatInquiry({
        name: formData.name.trim(),
        contact: formData.email.trim(),
        message: `[Subject: ${formData.subject || 'Website Inquiry'}] ${formData.message}`
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (e) {
      console.warn('Inquiry save fallback:', e);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlatformIcon = (platform: string, iconName: string) => {
    const key = (platform + ' ' + iconName).toLowerCase();
    if (key.includes('facebook')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    }
    if (key.includes('instagram')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    }
    if (key.includes('youtube')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    return <MessageCircle className="w-4 h-4" />;
  };

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* 1. Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#171426] via-[#151522] to-[#201328] border border-[#2a2a3e] p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Contact <span className="text-gradient">{settings.school_name || 'Girls Academy'}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              For inquiries regarding admissions, fee schedules, transport routes, or campus visits, please feel free to get in touch with our admissions office and administration.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Three Info Cards: Address, Phone, Email */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Address */}
          <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Campus Location</h3>
            <p className="text-xs text-purple-300 font-medium mb-3">Main Campus</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {settings.campus_address || settings.academy_address || 'Street 5, Sector G-11/2'}<br />
              {settings.academy_city || 'Islamabad'}, Pakistan
            </p>
          </Card>

          {/* Card 2: Phone */}
          <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Phone & WhatsApp</h3>
            <p className="text-xs text-pink-300 font-medium mb-3">Office Hours: Mon - Sat</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Phone: {settings.phone_number || settings.academy_phone || '051-4861234'}<br />
              WhatsApp: {settings.academy_whatsapp || '0300-4861234'}
            </p>
          </Card>

          {/* Card 3: Email */}
          <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Email Inquiries</h3>
            <p className="text-xs text-cyan-300 font-medium mb-3">Response Within 24 Hours</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {settings.admissions_email || settings.contact_email || 'info@girlsacademy.edu.pk'}<br />
              admissions@girlsacademy.edu.pk
            </p>
          </Card>

        </div>
      </section>

      {/* 3. Contact Form & Office Hours / Social Media */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-10 bg-[#161625] border-[#2a2a3e]">
              <div className="mb-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">Direct Message</span>
                <h2 className="text-2xl font-bold text-white mt-1">Send Us an Inquiry</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Have a question about applications, tuition grants, or tours? Leave us a note.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Thank You for Reaching Out!</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Your inquiry has been received. An admissions officer will contact you shortly via email.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name *"
                      required
                      placeholder="e.g. Fatima Zahra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      required
                      placeholder="fatima@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Subject *"
                    required
                    placeholder="Inquiry regarding Matric / FSc Admissions"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />

                  <Textarea
                    label="Message *"
                    required
                    rows={5}
                    placeholder="Please let us know how we can assist you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Right Column: Office Hours & Dynamic Social Media */}
          <div className="lg:col-span-5 space-y-6">
            {/* Campus Visit Box */}
            <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Admissions Office Hours</h3>
                  <p className="text-xs text-slate-400">Campus visits by appointment</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-[#2a2a3e] pt-3 text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Monday – Thursday</span>
                  <span className="font-semibold text-white">08:00 AM – 02:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Friday (Jummah Break)</span>
                  <span className="font-semibold text-white">08:00 AM – 12:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Saturday (Admissions Desk)</span>
                  <span className="font-semibold text-purple-300">08:30 AM – 01:30 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Sunday</span>
                  <span className="font-semibold text-rose-400">Closed</span>
                </div>
              </div>
            </Card>

            {/* Dynamic Social Media Channels */}
            <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Connect On Social Channels</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Follow campus updates, student project launches, and event broadcasts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {socials.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[#131320] border border-[#2a2a3e] hover:border-purple-500 hover:bg-purple-600/10 flex flex-col items-center text-center transition-all group"
                  >
                    <div className="text-purple-400 group-hover:text-white mb-1">
                      {renderPlatformIcon(item.platform, item.icon)}
                    </div>
                    <span className="text-xs font-semibold text-white group-hover:text-purple-300">{item.platform}</span>
                    {item.followers_count && (
                      <span className="text-[10px] text-slate-500 mt-0.5">{item.followers_count}</span>
                    )}
                  </a>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* 4. Campus Location Map Embed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-[#2a2a3e] bg-[#161625] shadow-2xl">
          <div className="p-6 border-b border-[#2a2a3e] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Campus Map & Direction</h3>
              <p className="text-xs text-slate-400">{settings.campus_address || settings.academy_address || 'Street 5, Sector G-11/2, Islamabad, Pakistan'}</p>
            </div>
            <a
              href="https://maps.google.com/?q=Sector+G-11+Islamabad"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
            </a>
          </div>
          <div className="aspect-[21/9] min-h-[300px] w-full bg-[#11111c] relative">
            <iframe
              title="Campus Location Map"
              src={settings.map_embed_url || "https://maps.google.com/maps?q=Sector%20G-11%2C%20Islamabad%2C%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"}
              className="w-full h-full border-0 filter invert-[90%] hue-rotate-180"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
