import { useState, useRef } from 'react';
import mammoth from 'mammoth';

export default function TextInput({ onAnalyze, onTextChange }) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  const handleClear = () => {
    setText('');
    setFileName('');
    onAnalyze('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateText = (newText, name = '') => {
    setText(newText);
    setFileName(name);
    if (onTextChange) onTextChange(newText);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        updateText(result.value, file.name);
      } else if (file.name.endsWith('.txt')) {
        const content = await file.text();
        updateText(content, file.name);
      }
    } catch (err) {
      console.error('File read error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 lg:overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">영어 지문 입력</h2>
        <span className="text-sm text-gray-400">{text.length}자</span>
      </div>

      {/* File upload */}
      <div className="mb-3">
        <label
          className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {loading ? '파일 읽는 중...' : fileName || '.docx 또는 .txt 파일 업로드'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <textarea
        className="flex-1 min-h-[300px] lg:min-h-0 lg:max-h-[50vh] w-full p-4 border border-gray-200 rounded-xl resize-none text-gray-800 text-[15px] leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-400 transition-shadow overflow-y-auto"
        placeholder="분석할 영어 지문을 여기에 붙여넣기 하세요...&#10;&#10;또는 위에서 .docx 파일을 업로드하세요."
        value={text}
        onChange={(e) => { setText(e.target.value); setFileName(''); }}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAnalyze}
          disabled={!text.trim() || loading}
          className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          분석하기
        </button>
        {text && (
          <button
            onClick={handleClear}
            className="py-3 px-4 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
          >
            초기화
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400 text-center">
        Ctrl+Enter (Cmd+Enter) 로 바로 분석
      </p>
    </div>
  );
}
