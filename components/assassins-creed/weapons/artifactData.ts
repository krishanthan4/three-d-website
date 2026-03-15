export interface Artifact {
  id: string
  name: string
  category: string
  era: string
  description: string
  history: string
  image: string
  modelPath: string
  stats: Record<string, number>
}

export const artifacts: Artifact[] = [
  {
    id: 'hidden-blade',
    name: 'Hidden Blade',
    category: 'Assassin Weapon',
    era: 'Ancient Egypt to Modern Era',
    description: 'The iconic concealed weapon of the Assassins, designed for stealth assassinations. It consists of a blade that extends and retracts from a bracer worn on the forearm, allowing for quick, deadly strikes.',
    history: 'First created by Bayek of Siwa in Ancient Egypt as a modified version of an earlier design. The weapon has been continually improved throughout history, with Leonardo da Vinci adding significant modifications for Ezio Auditore.',
    image: '/images/assassins-creed/hidden-blade.jpg',
    modelPath: '/models/assassins-creed/hidden-blade.glb',
    stats: {
      damage: 80,
      stealth: 95,
      range: 10,
      versatility: 60
    }
  },
  {
    id: 'apple-of-eden',
    name: 'Apple of Eden',
    category: 'Piece of Eden',
    era: 'Isu Era to Modern Era',
    description: 'A powerful artifact created by the Isu civilization, the Apple of Eden can control human minds, create illusions, and grant its wielder access to vast knowledge and technology far beyond its time period.',
    history: 'Many Apples have been discovered throughout history, wielded by influential figures such as Altaïr Ibn-La\'Ahad, Ezio Auditore, and even historical figures like Genghis Khan and Napoleon Bonaparte.',
    image: '/images/assassins-creed/apple-of-eden.jpg',
    modelPath: '/models/assassins-creed/apple-of-eden.glb',
    stats: {
      power: 95,
      control: 90,
      knowledge: 100,
      stability: 30
    }
  },
  {
    id: 'sword-of-altair',
    name: 'Sword of Altaïr',
    category: 'Assassin Weapon',
    era: '12th Century, Holy Land',
    description: 'A masterfully crafted sword used by the legendary Master Assassin Altaïr Ibn-La\'Ahad during the Third Crusade. Its quality was unmatched for its time, with perfect balance and razor-sharp edge.',
    history: 'Created by the blacksmiths of Masyaf as a reward for Altaïr\'s service to the Brotherhood. After his death, the sword was passed down through generations of Assassins, eventually finding its way to Ezio Auditore.',
    image: '/images/assassins-creed/sword-of-altair.jpg',
    modelPath: '/models/assassins-creed/sword-of-altair.glb',
    stats: {
      damage: 85,
      speed: 75,
      defense: 70,
      durability: 90
    }
  },
  {
    id: 'staff-of-hermes',
    name: 'Staff of Hermes Trismegistus',
    category: 'Piece of Eden',
    era: 'Isu Era to Modern Era',
    description: 'A powerful Piece of Eden that grants its holder immortality as long as they maintain physical contact with it. It can store memories and knowledge, and can transform into various forms to disguise itself.',
    history: 'Created by the Isu as a tool to manipulate the electromagnetic field that surrounds Earth. After the Isu civilization fell, the Staff passed through many hands, eventually coming to Pythagoras and later his child, Kassandra.',
    image: '/images/assassins-creed/staff-of-hermes.jpg',
    modelPath: '/models/assassins-creed/staff-of-hermes.glb',
    stats: {
      power: 90,
      longevity: 100,
      transformation: 85,
      stability: 60
    }
  },
  {
    id: 'spear-of-leonidas',
    name: 'Spear of Leonidas',
    category: 'Piece of Eden Fragment',
    era: 'Ancient Greece',
    description: 'A fragment of a Piece of Eden that was fashioned into a spear, wielded by King Leonidas of Sparta and later passed down to his grandchild, Kassandra/Alexios. The spear grants enhanced abilities and connects to its user\'s DNA.',
    history: 'Originally belonging to the Spartan king Leonidas, who used it at the Battle of Thermopylae. After his death, the spear was recovered and passed down to his daughter, eventually reaching his grandchild.',
    image: '/images/assassins-creed/spear-of-leonidas.jpg',
    modelPath: '/models/assassins-creed/spear-of-leonidas.glb',
    stats: {
      damage: 80,
      enhancement: 90,
      range: 60,
      connectivity: 95
    }
  },
  {
    id: 'hookblade',
    name: 'Hookblade',
    category: 'Assassin Tool',
    era: '16th Century, Ottoman Empire',
    description: 'A modification of the Hidden Blade used by Turkish Assassins, featuring a hook extension that aids in climbing, sliding on ziplines, and grabbing enemies during combat.',
    history: 'Developed by the Turkish Assassins, the Hookblade was introduced to Ezio Auditore by Yusuf Tazim when Ezio arrived in Constantinople. It quickly became an essential tool for navigating the city.',
    image: '/images/assassins-creed/hookblade.jpg',
    modelPath: '/models/assassins-creed/hookblade.glb',
    stats: {
      damage: 60,
      mobility: 95,
      utility: 90,
      stealth: 80
    }
  }
]
