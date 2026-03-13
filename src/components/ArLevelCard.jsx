import ResultCard from './ResultCard';

export default function ArLevelCard({ data }) {
  const { level, gradeEquivalent } = data;
  const percentage = Math.min(100, (level / 13) * 100);

  return (
    <ResultCard title="AR 등급" icon="📚">
      <div className="text-center mb-3">
        <span className="text-4xl font-bold text-indigo-600">{level}</span>
        <p className="text-sm text-gray-500 mt-1">{gradeEquivalent}</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>6.5</span>
        <span>13.0</span>
      </div>
    </ResultCard>
  );
}
