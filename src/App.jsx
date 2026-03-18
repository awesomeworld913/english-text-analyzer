import { useState, useRef } from 'react';
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
  const [batchProcessing, setBatchProcessing] = useState(false);
  const batchFileRef = useRef(null);

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
      const studyWordsList = analysisResults.studyWords
        ? analysisResults.studyWords.map(w => w.word).join(', ')
        : '';
      setHistory(prev => [...prev, {
        id: Date.now(),
        preview,
        wordCount: analysisResults.passageStats.wordCount,
        sentenceCount: analysisResults.passageStats.sentenceCount,
        avgSentenceLength: analysisResults.passageStats.avgSentenceLength,
        lexile: analysisResults.lexileScore.label,
        arLevel: analysisResults.arLevel.level,
        studyWords: studyWordsList,
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

  const handleBatchUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBatchProcessing(true);

    try {
      let text = '';
      if (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        alert('CSV, TSV, TXT 파일만 지원됩니다.');
        setBatchProcessing(false);
        return;
      }

      const separator = file.name.endsWith('.tsv') ? '\t' : ',';
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      // 첫 줄이 헤더인지 확인 (영어 지문이 아닌 경우 헤더로 간주)
      let startIdx = 0;
      const firstLine = lines[0]?.toLowerCase() || '';
      if (firstLine.includes('passage') || firstLine.includes('text') || firstLine.includes('지문')) {
        startIdx = 1;
      }

      const newHistory = [];
      for (let i = startIdx; i < lines.length; i++) {
        // CSV에서 따옴표로 감싸진 셀 처리
        let passage = lines[i];
        // 구분자가 있으면 첫 번째 열만 또는 가장 긴 열 사용
        if (passage.includes(separator)) {
          const cells = parseCSVLine(passage, separator);
          // 가장 긴 셀을 지문으로 사용
          passage = cells.reduce((a, b) => a.length >= b.length ? a : b, '');
        }
        // 따옴표 제거
        passage = passage.replace(/^["']|["']$/g, '').trim();
        if (!passage || passage.length < 10) continue;

        const result = analyze(passage);
        if (result) {
          const preview = passage.slice(0, 40) + (passage.length > 40 ? '...' : '');
          const studyWordsList = result.studyWords
            ? result.studyWords.map(w => w.word).join(', ')
            : '';
          newHistory.push({
            id: Date.now() + i,
            preview,
            wordCount: result.passageStats.wordCount,
            sentenceCount: result.passageStats.sentenceCount,
            avgSentenceLength: result.passageStats.avgSentenceLength,
            lexile: result.lexileScore.label,
            arLevel: result.arLevel.level,
            studyWords: studyWordsList,
          });
        }
      }

      setHistory(prev => [...prev, ...newHistory]);
      alert(`${newHistory.length}개 지문 분석 완료!`);
    } catch (err) {
      console.error('Batch upload error:', err);
      alert('파일 처리 중 오류가 발생했습니다.');
    } finally {
      setBatchProcessing(false);
      if (batchFileRef.current) batchFileRef.current.value = '';
    }
  };

  // 간단한 CSV 라인 파서 (따옴표 내 구분자 처리)
  function parseCSVLine(line, sep) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === sep && !inQuotes) { cells.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    cells.push(current.trim());
    return cells;
  }

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

              {/* 일괄 업로드 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  일괄 분석 (CSV/TSV 업로드)
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  지문을 한 줄에 하나씩, 또는 CSV/TSV 파일로 업로드하면 일괄 분석합니다.
                </p>
                <label
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed rounded-xl text-sm transition-colors cursor-pointer ${
                    batchProcessing
                      ? 'border-gray-200 text-gray-400 cursor-wait'
                      : 'border-emerald-300 text-emerald-600 hover:border-emerald-400 hover:text-emerald-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {batchProcessing ? '분석 중...' : 'CSV/TSV 파일로 일괄 분석'}
                  <input
                    ref={batchFileRef}
                    type="file"
                    accept=".csv,.tsv,.txt"
                    onChange={handleBatchUpload}
                    disabled={batchProcessing}
                    className="hidden"
                  />
                </label>
              </div>
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
