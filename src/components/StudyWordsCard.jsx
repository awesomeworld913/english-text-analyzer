import ResultCard from './ResultCard';

export default function StudyWordsCard({ data }) {
  if (!data || data.length === 0) {
    return (
      <ResultCard title="추천 학습단어" icon="📖">
        <p className="text-sm text-gray-400">추천 학습단어가 없습니다.</p>
      </ResultCard>
    );
  }

  return (
    <ResultCard title="추천 학습단어" icon="📖">
      <p className="text-xs text-gray-400 mb-3">
        단어 리스트에 없는 단어 중 학습이 필요한 단어
      </p>
      <div className="flex flex-wrap gap-2">
        {data.map(({ word, count }) => (
          <div
            key={word}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
          >
            <span className="font-medium">{word}</span>
            <span className="text-xs opacity-60">({count})</span>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
