import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { Gig } from '../../types/models';
import { X, Briefcase, Phone, Link, Send, CheckCircle2 } from 'lucide-react';

interface ApplyGigModalProps {
  gig: Gig | null;
  onClose: () => void;
}

export const ApplyGigModal: React.FC<ApplyGigModalProps> = ({ gig, onClose }) => {
  const { applyForGig, currentUser } = useSparkle();

  const [coverNote, setCoverNote] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!gig) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverNote.trim() || !phone.trim()) return;

    applyForGig(gig.id, coverNote, phone, portfolioUrl || undefined);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {gig.budgetKes ? `KES ${gig.budgetKes.toLocaleString()}` : gig.compensation}
              </span>
              <span className="text-xs text-slate-500 font-medium">By {gig.publisherName || gig.clientName}</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-1 line-clamp-1">{gig.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-lg text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-600">
              The client has received your pitch and contact info. They will reach out via WhatsApp/Phone or Messages!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Why are you the right comrade for this gig?
              </label>
              <textarea
                required
                rows={4}
                placeholder="Mention past campus projects, relevant coursework, or why you can deliver promptly..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (WhatsApp / M-Pesa)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+254 712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portfolio / GitHub / Drive Link (Optional)
              </label>
              <div className="relative">
                <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://github.com/... or Behance"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-extrabold rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white flex items-center gap-1.5 shadow-md shadow-sparkle-purple/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Proposal</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
