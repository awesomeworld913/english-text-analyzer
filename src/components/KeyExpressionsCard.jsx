import ResultCard from './ResultCard';

export default function KeyExpressionsCard({ data }) {
  if (!data || data.length === 0) {
    return (
      <ResultCard title="주요 표현" icon="💬">
        <p className="text-sm text-gray-400">반복되는 주요 표현이 없습니다.</p>
      </ResultCard>
    );
  }

  return (
    <ResultCard title="주요 표현" icon="💬">
      <div className="space-y-2">
        {data.map(({ phrase, count }, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-800">"{phrase}"</span>
            <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
              {count}회
            </span>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
