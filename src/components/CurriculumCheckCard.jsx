import ResultCard from './ResultCard';

function StatusBadge({ status }) {
  const styles = {
    within: 'bg-green-100 text-green-700',
    below: 'bg-red-100 text-red-700',
    above: 'bg-yellow-100 text-yellow-700',
    unknown: 'bg-gray-100 text-gray-500',
  };
  const labels = {
    within: '적정 범위',
    below: '기준 미달',
    above: '기준 초과',
    unknown: '기준 없음',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function CoverageBar({ percentage, label }) {
  const color = percentage >= 70 ? 'bg-green-400' : percentage >= 40 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function CurriculumCheckCard({ data }) {
  if (!data) return null;

  const { unit, wordCount, vocabulary, expressions, grammar, expressionPattern, patternAnalysis } = data;

  return (
    <ResultCard title="커리큘럼 검증" icon="✅" className="md:col-span-2">
      {/* Unit info */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-blue-700">Level {unit.level} - Unit {unit.unitNum}</span>
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">{unit.cefr}</span>
          <span className="text-sm text-blue-600">{unit.title}</span>
          <span className="text-xs text-blue-500">({unit.topic})</span>
        </div>
      </div>

      {/* Word count check */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <span className="text-sm text-gray-600">단어 수: </span>
          <span className="text-lg font-bold text-gray-800">{wordCount.actual}</span>
          {wordCount.target && (
            <span className="text-xs text-gray-500 ml-2">(목표: {wordCount.target})</span>
          )}
        </div>
        <StatusBadge status={wordCount.status} />
      </div>

      {/* Vocabulary coverage */}
      <CoverageBar percentage={vocabulary.coverage} label={`어휘 커버리지 (${vocabulary.found.length}/${vocabulary.total})`} />

      {vocabulary.found.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">사용된 커리큘럼 어휘:</p>
          <div className="flex flex-wrap gap-1">
            {vocabulary.found.map(w => (
              <span key={w} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{w}</span>
            ))}
          </div>
        </div>
      )}

      {vocabulary.missing.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">미사용 커리큘럼 어휘:</p>
          <div className="flex flex-wrap gap-1">
            {vocabulary.missing.slice(0, 20).map(w => (
              <span key={w} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{w}</span>
            ))}
            {vocabulary.missing.length > 20 && (
              <span className="text-xs text-gray-400">+{vocabulary.missing.length - 20}개</span>
            )}
          </div>
        </div>
      )}

      {/* Expression coverage */}
      <CoverageBar percentage={expressions.coverage} label={`표현 커버리지 (${expressions.found.length}/${expressions.total})`} />

      {expressions.found.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">사용된 표현:</p>
          {expressions.found.map((e, i) => (
            <div key={i} className="text-xs text-green-700 bg-green-50 rounded px-2 py-1 mb-1">{e}</div>
          ))}
        </div>
      )}

      {expressions.missing.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">미사용 표현:</p>
          {expressions.missing.slice(0, 10).map((e, i) => (
            <div key={i} className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mb-1">{e}</div>
          ))}
        </div>
      )}

      {/* Grammar points */}
      {grammar.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">해당 유닛 문법 포인트:</p>
          {grammar.map((g, i) => (
            <div key={i} className="text-xs text-purple-700 bg-purple-50 rounded px-2 py-1 mb-1">{g}</div>
          ))}
        </div>
      )}

      {/* Expression pattern analysis */}
      {patternAnalysis && patternAnalysis.patterns.length > 0 && (
        <div>
          <CoverageBar
            percentage={patternAnalysis.coverage}
            label={`표현 패턴 커버리지 (${patternAnalysis.found.length}/${patternAnalysis.found.length + patternAnalysis.missing.length})`}
          />

          {patternAnalysis.found.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">✅ 사용된 표현 패턴:</p>
              {patternAnalysis.found.map((item, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs text-green-700 bg-green-50 rounded px-2 py-1 font-mono">{item.pattern}</div>
                  <div className="flex flex-wrap gap-1 mt-1 ml-2">
                    {item.matches.map((m, j) => (
                      <span key={j} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded italic">"{m}"</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {patternAnalysis.missing.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">❌ 미사용 표현 패턴:</p>
              {patternAnalysis.missing.map((item, i) => (
                <div key={i} className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mb-1 font-mono">{item.pattern}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expression pattern raw (only if no analysis) */}
      {expressionPattern && (!patternAnalysis || patternAnalysis.patterns.length === 0) && (
        <div>
          <p className="text-xs text-gray-500 mb-1">핵심 표현 패턴:</p>
          <div className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1 font-mono whitespace-pre-line">{expressionPattern}</div>
        </div>
      )}
    </ResultCard>
  );
}
