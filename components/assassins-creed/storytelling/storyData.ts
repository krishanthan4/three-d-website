export interface StoryArc {
  id: string
  title: string
  period: string
  description: string
  image: string
  key_events: KeyEvent[]
}

export interface KeyEvent {
  year: string
  title: string
  description: string
}

export interface CharacterConnection {
  from: string
  to: string
  relationship: string
}

// Story timeline data
export const storyArcs: StoryArc[] = [
  {
    id: 'ancient',
    title: 'Ancient Origins',
    period: '75,000 BCE - 47 BCE',
    description: 'The origins of the conflict between freedom and control, starting with the Isu civilization and their human rebellion, through to the formation of the Hidden Ones in Ancient Egypt.',
    image: '/images/assassins-creed/story-ancient.jpg',
    key_events: [
      { year: '75,000 BCE', title: 'Isu-Human War', description: 'Adam and Eve steal an Apple of Eden, starting a rebellion against the Isu.' },
      { year: '~75,000 BCE', title: 'Toba Catastrophe', description: 'A solar flare decimates the Isu civilization, leading to their eventual extinction.' },
      { year: '47 BCE', title: 'Birth of the Hidden Ones', description: 'Bayek of Siwa and Aya establish the Hidden Ones, the precursor to the Assassin Brotherhood.' }
    ]
  },
  {
    id: 'medieval',
    title: 'Medieval Brotherhood',
    period: '1090 CE - 1257 CE',
    description: 'The formal establishment of the Assassin Brotherhood in Alamut and its subsequent spread throughout the Middle East, culminating in the Mongol assault on Masyaf.',
    image: '/images/assassins-creed/story-medieval.jpg',
    key_events: [
      { year: '1090', title: 'Assassins at Alamut', description: 'Hassan-i Sabbāh establishes the historical Assassins at Alamut.' },
      { year: '1191', title: 'Third Crusade', description: 'Altaïr Ibn-La\'Ahad confronts his master Al Mualim and recovers an Apple of Eden.' },
      { year: '1257', title: 'Fall of Masyaf', description: 'Mongols assault the Assassin fortress at Masyaf, forcing the Brotherhood to disperse.' }
    ]
  },
  {
    id: 'renaissance',
    title: 'Renaissance Rebirth',
    period: '1476 CE - 1524 CE',
    description: 'The Brotherhood\'s revival in Italy under the leadership of Ezio Auditore da Firenze, who reformed the Assassins and expanded their influence throughout the Mediterranean.',
    image: '/images/assassins-creed/story-renaissance.jpg',
    key_events: [
      { year: '1476', title: 'Auditore Execution', description: 'Giovanni Auditore and his sons are betrayed and executed, beginning Ezio\'s journey.' },
      { year: '1499', title: 'Vatican Infiltration', description: 'Ezio confronts Pope Alexander VI (Rodrigo Borgia) and discovers a First Civilization vault.' },
      { year: '1511', title: 'Constantinople', description: 'Ezio travels to the Ottoman Empire to find Altaïr\'s library and secure its secrets.' }
    ]
  },
  {
    id: 'colonial',
    title: 'Colonial Expansion',
    period: '1713 CE - 1783 CE',
    description: 'The conflict between Assassins and Templars spreads to the New World, playing a crucial role in events like the Seven Years\' War and the American Revolution.',
    image: '/images/assassins-creed/story-colonial.jpg',
    key_events: [
      { year: '1715', title: 'Golden Age of Piracy', description: 'Edward Kenway enters the Assassin-Templar conflict while searching for the Observatory.' },
      { year: '1755', title: 'Seven Years\' War', description: 'Shay Patrick Cormac defects from the Assassins to the Templars after a devastating earthquake.' },
      { year: '1776', title: 'American Revolution', description: 'Connor (Ratonhnhaké:ton) aids the Patriots while hunting the Colonial Templars.' }
    ]
  },
  {
    id: 'modern',
    title: 'Modern Era',
    period: '2012 CE - Present',
    description: 'The conflict enters the digital age with Abstergo Industries (a Templar front) using the Animus technology to explore genetic memories and locate Pieces of Eden.',
    image: '/images/assassins-creed/story-modern.jpg',
    key_events: [
      { year: '2012', title: 'Desmond Miles', description: 'Captured by Abstergo, Desmond accesses his genetic memories and learns of an impending catastrophe.' },
      { year: '2012', title: 'The Second Disaster', description: 'Desmond sacrifices himself to protect Earth from a solar flare using Isu technology.' },
      { year: '2013+', title: 'Helix & Layla', description: 'Abstergo commercializes the Animus while the Assassins continue their resistance through new agents.' }
    ]
  }
]

// Character connections for the relationship diagram
export const connections: CharacterConnection[] = [
  { from: "Altaïr Ibn-La'Ahad", to: "Al Mualim", relationship: "Student-Mentor (later enemies)" },
  { from: "Altaïr Ibn-La'Ahad", to: "Ezio Auditore", relationship: "Legacy through Codex" },
  { from: "Ezio Auditore", to: "Leonardo da Vinci", relationship: "Ally" },
  { from: "Ezio Auditore", to: "Rodrigo Borgia", relationship: "Enemy" },
  { from: "Edward Kenway", to: "Haytham Kenway", relationship: "Father-Son" },
  { from: "Haytham Kenway", to: "Connor Kenway", relationship: "Father-Son (enemies)" },
  { from: "Bayek of Siwa", to: "Aya", relationship: "Husband-Wife" },
  { from: "Alexios/Kassandra", to: "Pythagoras", relationship: "Father-Child" },
  { from: "Desmond Miles", to: "William Miles", relationship: "Son-Father" },
  { from: "Desmond Miles", to: "Altaïr/Ezio/Connor", relationship: "Ancestor" }
]
