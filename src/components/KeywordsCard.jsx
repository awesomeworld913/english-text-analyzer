import ResultCard from './ResultCard';

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-emerald-100 text-emerald-700',
  B1: 'bg-yellow-100 text-yellow-700',
  B2: 'bg-orange-100 text-orange-700',
  C1: 'bg-red-100 text-red-700',
  C2: 'bg-purple-100 text-purple-700',
  '—': 'bg-gray-100 text-gray-600',
};

export default function KeywordsCard({ data }) {
  if (!data || data.length === 0) {
    return (
      <ResultCard title="핵심 키워드" icon="🔑">
        <p className="text-sm text-gray-400">키워드를 추출할 수 없습니다.</p>
      </ResultCard>
    );
  }

  return (
    <ResultCard title="핵심 키워드" icon="🔑">
      <div className="flex flex-wrap gap-2">
        {data.map(({ word, count, cefrLevel }) => (
          <div
            key={word}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${LEVEL_COLORS[cefrLevel] || LEVEL_COLORS['—']}`}
          >
            <span className="font-medium">{word}</span>
            <span className="text-xs opacity-70">({count})</span>
            {cefrLevel !== '—' && (
              <span className="text-[10px] font-bold opacity-60">{cefrLevel}</span>
            )}
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
