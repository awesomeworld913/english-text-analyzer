import CefrLevelCard from './CefrLevelCard';
import LexileScoreCard from './LexileScoreCard';
import ArLevelCard from './ArLevelCard';
import PassageLengthCard from './PassageLengthCard';
import ReadabilityCard from './ReadabilityCard';
import KeywordsCard from './KeywordsCard';
import KeyExpressionsCard from './KeyExpressionsCard';

export default function AnalysisResults({ results }) {
  if (!results) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
        <div className="text-center">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg font-medium">영어 지문을 입력하고</p>
          <p className="text-lg font-medium">분석하기 버튼을 눌러주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">분석 결과</h2>

      {/* Level indicators - top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CefrLevelCard data={results.cefrLevel} />
        <LexileScoreCard data={results.lexileScore} />
        <ArLevelCard data={results.arLevel} />
      </div>

      {/* Stats and readability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PassageLengthCard data={results.passageStats} />
        <ReadabilityCard data={results.readability} />
      </div>

      {/* Keywords and expressions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeywordsCard data={results.keywords} />
        <KeyExpressionsCard data={results.expressions} />
      </div>
    </div>
  );
}
