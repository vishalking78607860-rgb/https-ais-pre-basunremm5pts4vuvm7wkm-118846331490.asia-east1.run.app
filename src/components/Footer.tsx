import React from 'react';
import { Crown, MessageCircle, ShieldAlert } from 'lucide-react';
import { ContactSettings } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface FooterProps {
  contact: ContactSettings;
  lang: 'hi' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ contact, lang }) => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, contact.whatsappCustomMessage);

  return (
    <footer className="mt-12 bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-8 px-4 pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-6 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-chakra font-black text-white text-lg tracking-wider">
              SATTA KING <span className="text-amber-400">777</span> FAST
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
              24x7 OFFICIAL LIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={contact.websiteUrl || 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-emerald-400 hover:text-white transition-colors font-mono text-xs"
            >
              <span>Live Portal Link</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 transition-colors font-bold text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {contact.whatsappNumber}</span>
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 space-y-2 text-[11px] leading-relaxed">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{lang === 'hi' ? 'महत्वपूर्ण अस्वीकरण (DISCLAIMER)' : 'DISCLAIMER NOTICE'}</span>
          </div>
          <p className="text-neutral-400 font-hind">
            {lang === 'hi'
              ? 'यह वेबसाइट केवल सूचना और मनोरंजन के उद्देश्य से बनाई गई है। हम किसी भी अवैध गतिविधि या सट्टेबाजी को बढ़ावा नहीं देते हैं। अपने राज्य या देश के नियमों का पालन करें।'
              : 'This website is strictly for informational and record tracking purposes. We do not operate or encourage illegal activities. Please follow local regulations.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-500 text-[11px] pt-2">
          <div>
            © {currentYear} Satta-King-Fast. All rights reserved.
          </div>
          <div>
            Fastest Real-Time Live Results & Control Panel
          </div>
        </div>
      </div>
    </footer>
  );
};
