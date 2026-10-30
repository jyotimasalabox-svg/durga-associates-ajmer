'use client';

import React, { useState, useEffect } from 'react';
import { PublicInquiry } from '@/lib/types';
import { 
  Inbox, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface Props {
  onConvertToClient?: (inquiry: PublicInquiry) => void;
}

export default function AdminInquiries({ onConvertToClient }: Props) {
  const [inquiries, setInquiries] = useState<PublicInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
      }
    } catch (err) {
      alert('त्रुटि हुई');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('क्या आप वाकई इस पूछताछ को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
      }
    } catch (err) {
      alert('सर्वर त्रुटि');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">नई पूछताछ</span>;
      case 'contacted':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">संपर्क किया गया</span>;
      case 'converted':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">केस में परिवर्तित</span>;
      case 'closed':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">समाप्त (Closed)</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#0B1B3D] flex items-center gap-2">
            <Inbox className="w-7 h-7 text-amber-500" />
            वेबसाइट से प्राप्त पूछताछ व अपॉइंटमेंट (Public Inquiries)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            वेबसाइट से ग्राहकों द्वारा भेजे गए संपर्क फॉर्म, परामर्श प्रश्न एवं अपॉइंटमेंट अनुरोध
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 self-start sm:self-auto">
          कुल अनुरोध: {inquiries.length}
        </span>
      </div>

      {loading ? (
        <div className="p-10 text-center text-xs text-slate-500">पूछताछ लोड हो रही है...</div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          वर्तमान में कोई नई पूछताछ नहीं है।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    {inq.serviceType}
                  </span>
                  {getStatusBadge(inq.status)}
                </div>

                <h3 className="text-base font-extrabold text-[#0B1B3D]">
                  {inq.fullName}
                </h3>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <a href={`tel:${inq.phone}`} className="flex items-center gap-1 font-bold text-emerald-700 hover:underline">
                    <Phone className="w-3.5 h-3.5" /> {inq.phone}
                  </a>
                  {inq.email && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Mail className="w-3.5 h-3.5" /> {inq.email}
                    </span>
                  )}
                </div>

                {inq.propertyLocation && (
                  <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>स्थान: <strong>{inq.propertyLocation}</strong></span>
                  </div>
                )}

                {inq.preferredDate && (
                  <div className="mt-1 text-xs text-indigo-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>इच्छित अपॉइंटमेंट: <strong>{inq.preferredDate}</strong></span>
                  </div>
                )}

                {inq.message && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                    "{inq.message}"
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400">स्थिति:</span>
                  <select
                    value={inq.status}
                    onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                  >
                    <option value="new">नई (New)</option>
                    <option value="contacted">संपर्क किया</option>
                    <option value="converted">परिवर्तित (Client)</option>
                    <option value="closed">समाप्त (Closed)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${inq.phone}?text=नमस्ते%20${inq.fullName},%20दुर्गा%20एसोसिएट्स%20अजमेर%20से%20आपकी%20पूछताछ%20के%20संदर्भ%20में।`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1"
                    title="WhatsApp भेजें"
                  >
                    WhatsApp
                  </a>

                  {onConvertToClient && (
                    <button
                      onClick={() => onConvertToClient(inq)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0B1B3D] text-white hover:bg-[#162E66] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="नया ग्राहक केस बनाएं"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-amber-400" /> केस बनाएं
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
