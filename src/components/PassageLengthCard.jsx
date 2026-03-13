import ResultCard from './ResultCard';

export default function PassageLengthCard({ data }) {
  const { wordCount, sentenceCount, paragraphCount, characterCount, avgSentenceLength, avgWordLength } = data;

  const stats = [
    { label: '단어 수', value: wordCount.toLocaleString(), color: 'text-blue-600' },
    { label: '문장 수', value: sentenceCount, color: 'text-green-600' },
    { label: '문단 수', value: paragraphCount, color: 'text-purple-600' },
    { label: '글자 수', value: characterCount.toLocaleString(), color: 'text-orange-600' },
  ];

  return (
    <ResultCard title="지문 길이" icon="📏">
      <div className="grid grid-cols-2 gap-3 mb-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>평균 문장 길이: <b>{avgSentenceLength}</b> 단어</span>
        <span>평균 단어 길이: <b>{avgWordLength}</b> 글자</span>
      </div>
    </ResultCard>
  );
}
