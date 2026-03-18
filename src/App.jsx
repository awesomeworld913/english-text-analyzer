import { useState } from 'react';
import TextInput from './components/TextInput';
import AnalysisResults from './components/AnalysisResults';
import AnalysisHistory from './components/AnalysisHistory';
import CurriculumCheckCard from './components/CurriculumCheckCard';
import { analyze } from './analysis';
import { getCurriculumUnits, checkAgainstCurriculum } from './analysis/curriculumChecker';

const curriculumUnits = getCurriculumUnits();

function App() {
  const [results, setResults] = useState(null);
  const [curriculumResult, setCurriculumResult] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [history, setHistory] = useState([]);

  const handleAnalyze = (text) => {
    setCurrentText(text);
    if (!text || !text.trim()) {
      setResults(null);
      setCurriculumResult(null);
      return;
    }
    const analysisResults = analyze(text);
    setResults(analysisResults);

    // 이력에 추가
    if (analysisResults) {
      const preview = text.trim().slice(0, 40) + (text.trim().length > 40 ? '...' : '');
      setHistory(prev => [...prev, {
        id: Date.now(),
        preview,
        wordCount: analysisResults.passageStats.wordCount,
        sentenceCount: analysisResults.passageStats.sentenceCount,
        avgSentenceLength: analysisResults.passageStats.avgSentenceLength,
        lexile: analysisResults.lexileScore.label,
        arLevel: analysisResults.arLevel.level,
      }]);
    }

    // Also run curriculum check if unit is selected
    if (selectedUnit) {
      const [level, unit] = selectedUnit.split('-').map(Number);
      const check = checkAgainstCurriculum(text, level, unit);
      setCurriculumResult(check);
    } else {
      setCurriculumResult(null);
    }
  };

  const handleUnitChange = (e) => {
    const value = e.target.value;
    setSelectedUnit(value);
    if (value && currentText) {
      const [level, unit] = value.split('-').map(Number);
      const check = checkAgainstCurriculum(currentText, level, unit);
      setCurriculumResult(check);
    } else {
      setCurriculumResult(null);
    }
  };

  // Group units by level
  const groupedUnits = {};
  for (const u of curriculumUnits) {
    const key = `Level ${u.level} (${u.cefr})`;
    if (!groupedUnits[key]) groupedUnits[key] = [];
    groupedUnits[key].push(u);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            영어 지문 분석기
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            영어 지문의 난이도, 키워드, 핵심 표현을 분석하고 커리큘럼 기준으로 검증합니다
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Left: Text Input + Curriculum Selector */}
          <div className="lg:w-[400px] lg:flex-shrink-0 lg:sticky lg:top-6">
            <div className="space-y-4">
              {/* Curriculum unit selector */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  커리큘럼 유닛 선택 (선택사항)
                </label>
                <select
                  value={selectedUnit}
                  onChange={handleUnitChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- 유닛 선택 안 함 --</option>
                  {Object.entries(groupedUnits).map(([group, units]) => (
                    <optgroup key={group} label={group}>
                      {units.map(u => (
                        <option key={`${u.level}-${u.unit}`} value={`${u.level}-${u.unit}`}>
                          Unit {u.unit}: {u.title} ({u.topic})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <TextInput onAnalyze={handleAnalyze} />
            </div>
          </div>

          {/* Right: Results */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Curriculum check at the top if available */}
            {curriculumResult && <CurriculumCheckCard data={curriculumResult} />}

            <AnalysisResults results={results} />
          </div>
        </div>

        {/* Analysis History & Download */}
        {history.length > 0 && (
          <AnalysisHistory
            history={history}
            onClear={() => setHistory([])}
            onRemove={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
          />
        )}
      </main>

      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <p className="text-xs text-gray-400 text-center">
            Lexile, AR 점수는 추정값이며 공식 점수와 다를 수 있습니다. CEFR 등급은 어휘 수준, 문장 복잡도, 가독성 지표를 종합하여 산출됩니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
