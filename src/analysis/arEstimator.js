function arToKorean(level) {
  if (level < 1.0) return '유치원 수준';
  if (level < 2.0) return '초등 1학년';
  if (level < 3.0) return '초등 2학년';
  if (level < 4.0) return '초등 3학년';
  if (level < 5.0) return '초등 4학년';
  if (level < 6.0) return '초등 5학년';
  if (level < 7.0) return '초등 6학년';
  if (level < 8.0) return '중학교 1학년';
  if (level < 9.0) return '중학교 2학년';
  if (level < 10.0) return '중학교 3학년';
  if (level < 11.0) return '고등학교 1학년';
  if (level < 12.0) return '고등학교 2학년';
  if (level < 13.0) return '고등학교 3학년';
  return '대학교 이상';
}

export function estimateArLevel(fleschKincaidGrade, wordCount) {
  // ATOS approximation based on FK Grade with word count adjustment
  let arLevel = 0.78 * fleschKincaidGrade + 0.5;

  // Slight adjustment for very short or very long passages
  if (wordCount < 100) arLevel -= 0.3;
  else if (wordCount > 1000) arLevel += 0.2;

  // Clamp and round
  arLevel = Math.max(0.1, Math.min(13.0, arLevel));
  arLevel = Math.round(arLevel * 10) / 10;

  return {
    level: arLevel,
    gradeEquivalent: arToKorean(arLevel),
  };
}
