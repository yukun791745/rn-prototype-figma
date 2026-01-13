import { Sparkles, ChevronRight } from 'lucide-react';

interface AICoachCardProps {
  comment: string;
  onConsultClick?: () => void;
}

export function AICoachCard({ comment, onConsultClick }: AICoachCardProps) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg border-2 border-indigo-200">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#FF33CC]" />
          <h2 className="text-base font-bold text-indigo-700">AIコーチのひとこと</h2>
        </div>
        <div className="bg-white/90 rounded-lg p-4 shadow-sm border border-indigo-100">
          <p className="text-slate-700 text-sm leading-relaxed font-medium">{comment}</p>
        </div>
        {/* Link */}
        <button
          onClick={onConsultClick}
          className="flex items-center gap-1 ml-auto mt-3 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          <span>AIコーチに相談する</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}