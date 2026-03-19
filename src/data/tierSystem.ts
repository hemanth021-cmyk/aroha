// ═══════════ TIER SYSTEM ═══════════

export interface Tier {
  name: string
  minXP: number
  color: string
  bgColor: string
  borderColor: string
  icon: string
  glow: string
}

export const tiers: Tier[] = [
  { name: 'Bronze',     minXP: 0,     color: '#CD7F32', bgColor: 'rgba(205,127,50,0.12)',  borderColor: 'rgba(205,127,50,0.3)',  icon: '🥉', glow: 'rgba(205,127,50,0.2)' },
  { name: 'Silver',     minXP: 200,   color: '#C0C0C0', bgColor: 'rgba(192,192,192,0.12)', borderColor: 'rgba(192,192,192,0.3)', icon: '🥈', glow: 'rgba(192,192,192,0.2)' },
  { name: 'Gold',       minXP: 500,   color: '#FFD700', bgColor: 'rgba(255,215,0,0.12)',   borderColor: 'rgba(255,215,0,0.3)',   icon: '🥇', glow: 'rgba(255,215,0,0.2)' },
  { name: 'Platinum',   minXP: 1000,  color: '#6CE5E8', bgColor: 'rgba(108,229,232,0.12)', borderColor: 'rgba(108,229,232,0.3)', icon: '💎', glow: 'rgba(108,229,232,0.2)' },
  { name: 'Diamond',    minXP: 2000,  color: '#B9F2FF', bgColor: 'rgba(185,242,255,0.12)', borderColor: 'rgba(185,242,255,0.3)', icon: '💠', glow: 'rgba(185,242,255,0.25)' },
  { name: 'Crown',      minXP: 3500,  color: '#FF69B4', bgColor: 'rgba(255,105,180,0.12)', borderColor: 'rgba(255,105,180,0.3)', icon: '👑', glow: 'rgba(255,105,180,0.2)' },
  { name: 'Ace',        minXP: 5000,  color: '#FF4500', bgColor: 'rgba(255,69,0,0.12)',    borderColor: 'rgba(255,69,0,0.3)',    icon: '🔥', glow: 'rgba(255,69,0,0.25)' },
  { name: 'Conqueror',  minXP: 8000,  color: '#FFD700', bgColor: 'rgba(255,215,0,0.15)',   borderColor: 'rgba(255,215,0,0.4)',   icon: '⚔️', glow: 'rgba(255,215,0,0.3)' },
]

export function getTier(xp: number): Tier {
  let current = tiers[0]
  for (const tier of tiers) {
    if (xp >= tier.minXP) current = tier
  }
  return current
}

export function getNextTier(xp: number): { tier: Tier; xpNeeded: number; progress: number } | null {
  for (let i = 0; i < tiers.length; i++) {
    if (xp < tiers[i].minXP) {
      const prev = i > 0 ? tiers[i - 1].minXP : 0
      const range = tiers[i].minXP - prev
      const progress = ((xp - prev) / range) * 100
      return { tier: tiers[i], xpNeeded: tiers[i].minXP - xp, progress }
    }
  }
  return null // Already at max tier
}

// ═══════════ MOCK LEADERBOARD ═══════════

export interface LeaderboardUser {
  id: string
  name: string
  xp: number
  streak: number
  track: string
  avatar: string
}

const firstNames = ['Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Kavya', 'Rahul', 'Ishita', 'Dev', 'Meera', 'Aditya', 'Pooja', 'Karan', 'Riya', 'Siddharth', 'Neha', 'Harsh', 'Divya', 'Manish', 'Sakshi', 'Varun', 'Tanvi', 'Nikhil']
const tracks = ['Engineering', 'CAT 2026', 'GATE', 'JEE Mains', 'NEET']
const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']

function generateMockUser(rank: number): LeaderboardUser {
  const name = firstNames[rank % firstNames.length]
  const baseXP = Math.max(0, 8500 - rank * (300 + Math.floor(Math.random() * 200)))
  const xp = Math.max(25, baseXP + Math.floor(Math.random() * 150))

  return {
    id: `user-${rank}`,
    name,
    xp,
    streak: Math.max(0, Math.floor(Math.random() * 45) - rank),
    track: tracks[rank % tracks.length],
    avatar: avatarColors[rank % avatarColors.length],
  }
}

export function getMockLeaderboard(currentUserName: string, currentUserXP: number, currentUserTrack: string): LeaderboardUser[] {
  const users: LeaderboardUser[] = []

  // Generate 24 mock users
  for (let i = 0; i < 24; i++) {
    users.push(generateMockUser(i))
  }

  // Add current user
  users.push({
    id: 'current-user',
    name: currentUserName,
    xp: currentUserXP,
    streak: 0,
    track: currentUserTrack || 'Engineering',
    avatar: '#E8B84B',
  })

  // Sort by XP descending
  users.sort((a, b) => b.xp - a.xp)

  return users
}
