export default function AnalysisHistory({ history, onClear, onRemove }) {
  const handleDownloadTSV = () => {
    const headers = ['No', '지문', '단어수', '문장수', '평균문장길이', 'Lexile', 'AR등급', '추천단어'];
    const rows = history.map((h, i) => [
      i + 1,
      h.preview,
      h.wordCount,
      h.sentenceCount,
      h.avgSentenceLength,
      h.lexile,
      h.arLevel,
      h.studyWords || '',
    ]);

    const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    const blob = new Blob(['\uFEFF' + tsv], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-results-${new Date().toISOString().slice(0, 10)}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
          <span className="text-lg">📊</span>
          분석 이력 ({history.length}건)
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            초기화
          </button>
          <button
            onClick={handleDownloadTSV}
            className="px-3 py-1.5 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-1"
          >
            TSV 다운로드
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-2 text-gray-500 font-medium">No</th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">지문</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">단어수</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">문장수</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">평균문장길이</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">Lexile</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">AR</th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">추천단어</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2 px-2 text-gray-400">{i + 1}</td>
                <td className="py-2 px-2 text-gray-700 max-w-[200px] truncate">{h.preview}</td>
                <td className="py-2 px-2 text-right text-gray-700">{h.wordCount}</td>
                <td className="py-2 px-2 text-right text-gray-700">{h.sentenceCount}</td>
                <td className="py-2 px-2 text-right text-gray-700">{h.avgSentenceLength}</td>
                <td className="py-2 px-2 text-right text-gray-700">{h.lexile}</td>
                <td className="py-2 px-2 text-right text-gray-700">{h.arLevel}</td>
                <td className="py-2 px-2 text-gray-500 max-w-[200px] truncate text-xs">{h.studyWords || '—'}</td>
                <td className="py-2 px-2">
                  <button
                    onClick={() => onRemove(h.id)}
                    className="text-gray-300 hover:text-red-400 text-xs"
                    title="삭제"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
