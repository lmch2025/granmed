import { FR_ANSWERS, FR_EXTRA, EN_ANSWERS, EN_EXTRA, normalizeWord, wordForDate, puzzleNumber, evaluateGuess } from '/home/z/my-project/src/components/games/data/daily-word-data.ts'

function check(name: string, arr: string[], others: string[] = []) {
  const problems: string[] = []
  const seen = new Set<string>()
  const otherSet = new Set(others)
  for (const w of arr) {
    if (w.length !== 5) problems.push(`${w}(${w.length})`)
    if (seen.has(w)) problems.push(`${w} DUP`)
    if (otherSet.has(w)) problems.push(`${w} CROSS`)
    if (normalizeWord(w) !== w) problems.push(`${w} NORM`)
    seen.add(w)
  }
  console.log(`${name}: count=${arr.length} problems=[${problems.join(', ')}]`)
}

check('FR_ANSWERS', FR_ANSWERS, FR_EXTRA)
check('FR_EXTRA', FR_EXTRA, FR_ANSWERS)
check('EN_ANSWERS', EN_ANSWERS, EN_EXTRA)
check('EN_EXTRA', EN_EXTRA, EN_ANSWERS)

console.log('wordForDate fr 2025-01-01:', wordForDate('fr', '2025-01-01'), 'puzzle#', puzzleNumber('2025-01-01'))
console.log('wordForDate fr 2026-06-15:', wordForDate('fr', '2026-06-15'))
console.log('wordForDate en 2026-06-15:', wordForDate('en', '2026-06-15'))
console.log('eval MELLE vs MOTEL:', evaluateGuess('MELLE', 'MOTEL').join(','))
console.log('eval SPEED vs SUPER:', evaluateGuess('SPEED', 'SUPER').join(','))
console.log('eval AROMA vs KOALA:', evaluateGuess('AROMA', 'KOALA').join(','))
console.log('eval ESSAI vs SESSE:', evaluateGuess('ESSAI', 'SESSE').join(','))
console.log('eval KAYAK vs KOALA:', evaluateGuess('KAYAK', 'KOALA').join(','))
