import ResultCard from './ResultCard';

export default function LexileScoreCard({ data }) {
  const { score, label, gradeEquivalent } = data;
  const percentage = Math.min(100, (score / 2000) * 100);

  return (
    <ResultCard title="Lexile 점수" icon="📊">
      <div className="text-center mb-3">
        <span className="text-4xl font-bold text-blue-600">{label}</span>
        <p className="text-sm text-gray-500 mt-1">{gradeEquivalent}</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0L</span>
        <span>1000L</span>
        <span>2000L</span>
      </div>
    </ResultCard>
  );
}
