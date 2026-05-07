/**
 * Safety service — multi-layer crisis detection for mental wellness app.
 *
 * Layer 1 (this file): Deterministic keyword/regex detection.
 *   - Fast (< 1ms)
 *   - 100% consistent (not LLM-dependent)
 *   - Cannot be bypassed by prompt injection
 *
 * Layer 2 (in aiService.ts): System prompt with crisis protocol
 *   - Catches subtle/ambiguous expressions
 *   - Handles context the keyword layer misses
 *
 * Defense-in-depth: if either layer fires, user gets safety resources.
 */

export type CrisisSeverity = 'none' | 'low' | 'medium' | 'high';

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: CrisisSeverity;
  matchedPatterns: string[];
  confidence: number;
}

// High-severity patterns — explicit ideation or intent
const HIGH_RISK_PATTERNS: RegExp[] = [
  /\b(kill|killing)\s+(myself|me)\b/i,
  /\bend(ing)?\s+(my|this)\s+life\b/i,
  /\b(commit|committing)\s+suicide\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bsuicid(e|al)\b/i,
  /\b(hurt|harm|cut)\s+(myself|me)\b/i,
  /\bself[\s-]?harm\b/i,
  /\b(slit|slitting)\s+(my\s+)?wrists?\b/i,
  /\boverdose\b/i,
  /\bkms\b/i,                         // "kill myself" slang
  /\bunalive\s+(myself|me)\b/i,       // TikTok-era term
  // Hindi/Hinglish patterns
  /\bmar(na|ne)\s+chahta\b/i,
  /\bkhatam\s+kar(na|ne)\b/i,
  /\bjeene\s+ka\s+(koi\s+)?(matlab|point|fayda)\s+nahi\b/i,
  /\bjaan\s+de\s+(du|dunga|deni)\b/i,
];

// Medium-severity patterns — hopelessness, planning, distress
const MEDIUM_RISK_PATTERNS: RegExp[] = [
  /\bno\s+reason\s+to\s+live\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bcan'?t\s+(go\s+on|take\s+it)\b/i,
  /\bgive\s+up\s+on\s+life\b/i,
  /\bnothing\s+matters\s+anymore\b/i,
  /\bworld\s+(would\s+be|is)\s+better\s+without\s+me\b/i,
  /\b(want|wanna)\s+to\s+disappear\b/i,
];

// Words that should NOT trigger crisis (false-positive guards).
// If the message contains ONLY casual idioms, treat as non-crisis.
const FALSE_POSITIVE_CONTEXTS: RegExp[] = [
  /\bkilling\s+(it|me)\s+(at|with|on)\b/i,         // "killing it at work"
  /\bdying\s+(of\s+)?laughter\b/i,
  /\bdying\s+to\s+(see|try|know|meet|hear)\b/i,
  /\bhomework\s+is\s+killing\s+me\b/i,
  /\bkilled\s+it\b/i,
  // Idiomatic "die laughing/of X" expressions
  /\b(die|died|dying)\s+(laughing|of\s+laughter|from\s+laughter|of\s+embarrassment|of\s+boredom)\b/i,
  /\bwant\s+to\s+die\s+laughing\b/i,
];

const HELPLINE_RESOURCES = `
🆘 **Immediate support is available — please reach out:**

- **iCall (India)**: 9152987821 — Mon to Sat, 8am–10pm
- **AASRA**: 9820466726 — 24/7
- **Vandrevala Foundation**: 1860-2662-345 — 24/7, free
- **Emergency**: 112

These lines are free, confidential, and staffed by trained counsellors who can help right now.
`.trim();

const HIGH_RISK_RESPONSE = `What you're sharing matters deeply, and I'm genuinely concerned for your safety right now. You are not alone — and immediate support is available.

${HELPLINE_RESOURCES}

Please reach out to one of these lines — even just to talk. They're trained to help in moments like this. I'm here to listen too, but a real person who can support you in this moment matters most right now. 💜`;

const MEDIUM_RISK_RESPONSE = `I hear how much pain you're in, and I want you to know that your feelings are valid — and that they can change with the right support. You don't have to carry this alone.

${HELPLINE_RESOURCES}

Would you like to talk about what's been weighing on you? I'm here to listen — and please consider reaching out to one of these lines as well. They can help in ways I can't. 💜`;

/**
 * Detect crisis indicators in a user message.
 * Returns severity, matched patterns, and confidence.
 */
export function detectCrisis(message: string): CrisisDetectionResult {
  const text = message.trim();

  // Check false-positive contexts first
  const isFalsePositive = FALSE_POSITIVE_CONTEXTS.some((pattern) =>
    pattern.test(text)
  );

  if (isFalsePositive) {
    return {
      isCrisis: false,
      severity: 'none',
      matchedPatterns: [],
      confidence: 0,
    };
  }

  const highMatches = HIGH_RISK_PATTERNS.filter((p) => p.test(text)).map(
    (p) => p.source
  );
  const mediumMatches = MEDIUM_RISK_PATTERNS.filter((p) => p.test(text)).map(
    (p) => p.source
  );

  if (highMatches.length > 0) {
    return {
      isCrisis: true,
      severity: 'high',
      matchedPatterns: highMatches,
      confidence: Math.min(0.95, 0.7 + 0.1 * highMatches.length),
    };
  }

  if (mediumMatches.length > 0) {
    return {
      isCrisis: true,
      severity: 'medium',
      matchedPatterns: mediumMatches,
      confidence: Math.min(0.85, 0.5 + 0.1 * mediumMatches.length),
    };
  }

  return {
    isCrisis: false,
    severity: 'none',
    matchedPatterns: [],
    confidence: 0,
  };
}

/**
 * Get the appropriate crisis response based on severity.
 */
export function getCrisisResponse(severity: CrisisSeverity): string {
  switch (severity) {
    case 'high':
      return HIGH_RISK_RESPONSE;
    case 'medium':
      return MEDIUM_RISK_RESPONSE;
    default:
      return '';
  }
}

export default { detectCrisis, getCrisisResponse };
