// Team utility functions for logo mapping

export const TEAM_LOGOS: Record<string, string> = {
  'ASSAULT ARUMUGAM AVENGERS': '/Teams/ASSAULT ARUMUGAM AVENGERS.png',
  'CHILD CHINNA CHAMPIONS': '/Teams/CHILD CHINNA CHAMPIONS.png',
  'ERIMALAI WARRIORS': '/Teams/ERIMALAI WARRIORS.png',
  'KAIPULLA KINGS': '/Teams/KAIPULLA KINGS.png',
  'NESAMANI XI': '/Teams/NESAMANI XI.png',
  'SNAKE BABU SUPER STRIKERS': '/Teams/SNAKE BABU SUPER STRIKERS.png',
  // Title case variations
  'Assault Arumugam Avengers': '/Teams/ASSAULT ARUMUGAM AVENGERS.png',
  'Child Chinna Champions': '/Teams/CHILD CHINNA CHAMPIONS.png',
  'Erimalai Warriors': '/Teams/ERIMALAI WARRIORS.png',
  'Kaipulla Kings': '/Teams/KAIPULLA KINGS.png',
  'Nesamani XI': '/Teams/NESAMANI XI.png',
  'Snake Babu Super Strikers': '/Teams/SNAKE BABU SUPER STRIKERS.png',
};

export const getTeamLogo = (teamName: string | null | undefined): string => {
  if (!teamName || typeof teamName !== 'string') {
    return '/placeholder.svg';
  }
  const logo = TEAM_LOGOS[teamName] || TEAM_LOGOS[teamName.toUpperCase()] || '/placeholder.svg';
  // Ensure we never return an empty string
  return logo || '/placeholder.svg';
};
