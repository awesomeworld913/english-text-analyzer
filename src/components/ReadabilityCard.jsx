import ResultCard from './ResultCard';

function getColorClass(score) {
  if (score >= 70) return 'from-green-400 to-green-500';
  if (score >= 50) return 'from-yellow-400 to-yellow-500';
  if (score >= 30) return 'from-orange-400 to-orange-500';
  return 'from-red-400 to-red-500';
}

export default function ReadabilityCard({ data }) {
  const { fleschReadingEase, fleschReadingEaseLabel, fleschKincaidGrade } = data;
  const percentage = Math.max(0, Math.min(100, fleschReadingEase));

  return (
    <ResultCard title="가독성 지표" icon="📖">
      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-sm text-gray-500">Flesch Reading Ease</p>
            <p className="text-3xl font-bold text-gray-800">{fleschReadingEase}</p>
          </div>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {fleschReadingEaseLabel}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getColorClass(fleschReadingEase)} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>어려움 (0)</span>
          <span>보통 (50)</span>
          <span>쉬움 (100)</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Flesch-Kincaid Grade Level</span>
        <span className="text-lg font-bold text-gray-800">{fleschKincaidGrade}</span>
      </div>
    </ResultCard>
  );
}
