'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

export default function ContactSection({ selectedService }: { selectedService?: string }) {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState(selectedService || 'विक्रय पत्र (बैनामा / Sale Deed)');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update if prop changes
  React.useEffect(() => {
    if (selectedService) {
      setServiceType(selectedService);
    }
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !phone.trim()) {
      setError('कृपया अपना नाम और मोबाइल नंबर अवश्य भरें।');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          serviceType,
          propertyLocation,
          preferredDate,
          message
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFullName('');
        setPhone('');
        setEmail('');
        setPropertyLocation('');
        setPreferredDate('');
        setMessage('');
      } else {
        setError(data.error || 'त्रुटि हुई। कृपया सीधे कॉल करें।');
      }
    } catch (err) {
      setError('सर्वर से संपर्क नहीं हो सका। कृपया सीधे कॉल करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-amber-200">
            <MessageSquare className="w-3.5 h-3.5" /> {t('contactTitle')}
          </div>
          <h2 className="text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            अपॉइंटमेंट बुक करें अथवा नि:शुल्क सलाह प्राप्त करें
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t('contactSubtitle')}। हमारे विशेषज्ञ आपकी रजिस्ट्री का संपूर्ण कानूनी हिसाब व कागजी औपचारिकताएं सुगम करेंगे।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Office & Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1B3D] to-[#122B5D] text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर
              </span>
              <h3 className="text-2xl font-extrabold text-white">कार्यालय संपर्क विवरण</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                अजमेर कलेक्ट्रेट, सब-रजिस्ट्रार प्रथम व द्वितीय क्षेत्राधिकार में सभी प्रकार की रजिस्ट्री व कानूनी विलेख कार्य हेतु सदैव तत्पर।
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-700/60">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">हेल्पलाइन व सीधी बात:</div>
                  <div className="text-base font-bold text-white">
                    <a href="tel:9829261354" className="hover:text-amber-300">9829261354</a> / 
                    <a href="tel:8003987152" className="hover:text-amber-300 ml-1">8003987152</a>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    WhatsApp पर भी उपलब्ध
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">कार्यालय पता:</div>
                  <div className="text-sm font-semibold text-slate-200 leading-snug">
                    दुर्गा एसोसिएट्स, कलेक्ट्री परिसर एवं सब-रजिस्ट्रार कार्यालय के निकट, अजमेर (राजस्थान) 305001
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">कार्य दिवस एवं समय:</div>
                  <div className="text-sm font-semibold text-slate-200">
                    प्रातः 09:30 से सायं 07:00 (सोमवार से शनिवार)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    सब-रजिस्ट्रार कार्यालय समय अनुसार पेशी
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/60 flex flex-col gap-2.5">
              <a
                href="https://wa.me/919829261354?text=नमस्ते%20दुर्गा%20एसोसिएट्स,%20मुझे%20प्रॉपर्टी%20रजिस्ट्री%20हेतु%20जानकारी%20चाहिए।"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center shadow transition flex items-center justify-center gap-2"
              >
                <span>WhatsApp पर तुरंत चैट करें</span>
              </a>

              <a
                href="tel:9829261354"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs text-center transition flex items-center justify-center gap-2"
              >
                <span>कॉल: 9829261354</span>
              </a>
            </div>
          </div>

          {/* Interactive Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-2">
              पूछताछ एवं अपॉइंटमेंट प्रपत्र
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              नीचे दिया गया फॉर्म भरें। हमारी टीम 24 घंटे के भीतर आपसे संपर्क कर पूरी जानकारी प्रदान करेगी।
            </p>

            {success ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold">धन्यवाद! आपका संदेश प्राप्त हो गया है।</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  दुर्गा एसोसिएट्स, अजमेर की टीम शीघ्र ही आपके दिए गए मोबाइल नंबर पर संपर्क करेगी।
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
                >
                  नया फॉर्म भरें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('name')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. रमेश कुमार"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('serviceType')}
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="विक्रय पत्र (बैनामा / Sale Deed)">विक्रय पत्र (बैनामा / Sale Deed)</option>
                      <option value="दान पत्र (पारिवारिक 1% छूट / Gift Deed)">दान पत्र (पारिवारिक 1% छूट / Gift Deed)</option>
                      <option value="हकत्याग पत्र (Release Deed)">हकत्याग पत्र (Release Deed)</option>
                      <option value="विभाजन / बंटवारा पत्र (Partition Deed)">विभाजन / बंटवारा पत्र (Partition Deed)</option>
                      <option value="पट्टा विलेख / लीज डीड (Lease Agreement)">पट्टा विलेख / लीज डीड (Lease Agreement)</option>
                      <option value="इकरारनामा बैनामा (Agreement to Sell)">इकरारनामा बैनामा (Agreement to Sell)</option>
                      <option value="डीएलसी दर एवं संपत्ति मूल्यांकन परामर्श">डीएलसी दर एवं संपत्ति मूल्यांकन परामर्श</option>
                      <option value="अन्य सामान्य पूछताछ">अन्य सामान्य पूछताछ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('location')}
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. वैशाली नगर, पंचशील, शास्त्री नगर..."
                      value={propertyLocation}
                      onChange={(e) => setPropertyLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      सुविधाजनक तारीख (Preferred Date)
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('message')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="संपत्ति का विवरण या कोई विशेष आवश्यकता लिखें..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0B1B3D] to-[#122B5D] hover:from-[#122B5D] hover:to-[#0B1B3D] text-amber-300 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{loading ? t('submitting') : t('submit')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
