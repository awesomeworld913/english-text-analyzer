import ResultCard from './ResultCard';

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-800 border-green-300',
  A2: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  B1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  B2: 'bg-orange-100 text-orange-800 border-orange-300',
  C1: 'bg-red-100 text-red-800 border-red-300',
  C2: 'bg-purple-100 text-purple-800 border-purple-300',
};

const LEVEL_BG_BARS = {
  A1: 'bg-green-400',
  A2: 'bg-emerald-400',
  B1: 'bg-yellow-400',
  B2: 'bg-orange-400',
  C1: 'bg-red-400',
  C2: 'bg-purple-400',
};

export default function CefrLevelCard({ data }) {
  const { level, label, vocabularyProfile, details } = data;

  return (
    <ResultCard title="CEFR 등급" icon="🎯">
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-3xl font-bold px-4 py-2 rounded-lg border ${LEVEL_COLORS[level]}`}>
          {level}
        </span>
        <div>
          <p className="text-lg font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-500">
            어휘 {details.vocabLevel} / 문장 {details.sentenceLevel} / FK {details.fkLevel}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-gray-500 mb-2">어휘 수준 분포</p>
        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
          <div key={lvl} className="flex items-center gap-2 text-xs">
            <span className="w-6 font-medium text-gray-600">{lvl}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${LEVEL_BG_BARS[lvl]}`}
                style={{ width: `${Math.min(100, vocabularyProfile[lvl] || 0)}%` }}
              />
            </div>
            <span className="w-12 text-right text-gray-500">{vocabularyProfile[lvl] || 0}%</span>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
