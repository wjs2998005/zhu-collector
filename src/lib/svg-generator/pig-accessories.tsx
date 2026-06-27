import type { Accessory } from './types';

interface PigAccessoryProps {
  type: Accessory;
}

export function PigAccessory({ type }: PigAccessoryProps) {
  switch (type) {
    case 'none':
      return null;
    case 'chef_hat':
      return <ChefHat />;
    case 'scarf':
      return <Scarf />;
    case 'sunglasses':
      return <Sunglasses />;
    case 'flower_crown':
      return <FlowerCrown />;
    case 'party_hat':
      return <PartyHat />;
    case 'headphones':
      return <Headphones />;
    case 'bow_tie':
      return <BowTie />;
    case 'crown':
      return <Crown />;
    case 'witch_hat':
      return <WitchHat />;
    case 'santa_hat':
      return <SantaHat />;
    case 'thermometer':
      return <Thermometer />;
    case 'umbrella':
      return <Umbrella />;
    case 'coffee_cup':
      return <CoffeeCup />;
    case 'bandage':
      return <Bandage />;
    case 'guitar':
      return <Guitar />;
    case 'pillow':
      return <Pillow />;
    case 'hard_hat':
      return <HardHat />;
    case 'laptop':
      return <Laptop />;
    case 'mud_splat':
      return <MudSplat />;
    default:
      return null;
  }
}

/* ---------- Individual Accessories ---------- */

function ChefHat() {
  return (
    <g transform="translate(100, 28)">
      {/* Hat base band */}
      <rect x="-22" y="-4" width="44" height="10" rx="3" fill="white" stroke="#DDD" strokeWidth="1" />
      {/* Hat puff */}
      <ellipse cx="-8" cy="-15" rx="16" ry="12" fill="white" stroke="#DDD" strokeWidth="1" />
      <ellipse cx="8" cy="-16" rx="14" ry="11" fill="white" stroke="#DDD" strokeWidth="1" />
    </g>
  );
}

function Scarf() {
  return (
    <g>
      {/* Wrap around neck */}
      <rect x="72" y="108" width="56" height="14" rx="5" fill="#FF6347" />
      {/* Dangling end */}
      <path d="M 108 115 C 115 115 118 130 115 140 L 105 140 C 108 132 107 122 102 118 Z"
        fill="#FF6347" />
      {/* Stripes */}
      <line x1="80" y1="110" x2="80" y2="120" stroke="#FFD700" strokeWidth="2" />
      <line x1="90" y1="110" x2="90" y2="120" stroke="#FFD700" strokeWidth="2" />
      <line x1="100" y1="110" x2="100" y2="120" stroke="#FFD700" strokeWidth="2" />
    </g>
  );
}

function Sunglasses() {
  return (
    <g>
      {/* Frame */}
      <rect x="75" y="71" width="20" height="12" rx="4" fill="#222" />
      <rect x="105" y="71" width="20" height="12" rx="4" fill="#222" />
      {/* Bridge */}
      <line x1="95" y1="77" x2="105" y2="77" stroke="#222" strokeWidth="2" />
      {/* Lenses */}
      <rect x="76" y="72" width="18" height="10" rx="3" fill="#444" opacity="0.6" />
      <rect x="106" y="72" width="18" height="10" rx="3" fill="#444" opacity="0.6" />
      {/* Shine */}
      <line x1="78" y1="73" x2="82" y2="79" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="108" y1="73" x2="112" y2="79" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function FlowerCrown() {
  return (
    <g>
      {/* Crown base */}
      <path d="M 65 42 Q 100 30 135 42" fill="none" stroke="#90EE90" strokeWidth="2" />
      {/* Flowers */}
      {[75, 95, 115].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${36 - (i % 2) * 3})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx={4 * Math.cos((angle * Math.PI) / 180)}
              cy={4 * Math.sin((angle * Math.PI) / 180)}
              rx="4" ry="3"
              fill={['#FF69B4', '#FFD700', '#FF6347'][i]}
              opacity="0.8"
            />
          ))}
          <circle cx="0" cy="0" r="2.5" fill="#FFD700" />
        </g>
      ))}
    </g>
  );
}

function PartyHat() {
  return (
    <g transform="translate(100, 25)">
      {/* Triangle cone */}
      <polygon points="-16,14 0,-20 16,14" fill="#FF69B4" />
      {/* Stripes */}
      <line x1="-10" y1="8" x2="10" y2="8" stroke="#FFD700" strokeWidth="2" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke="#FFD700" strokeWidth="2" />
      <line x1="-2" y1="-8" x2="2" y2="-8" stroke="#FFD700" strokeWidth="2" />
      {/* Pom-pom */}
      <circle cx="0" cy="-20" r="5" fill="#FFD700" />
      {/* Elastic band */}
      <line x1="-16" y1="14" x2="-20" y2="14" stroke="#FF69B4" strokeWidth="1.5" />
      <line x1="16" y1="14" x2="20" y2="14" stroke="#FF69B4" strokeWidth="1.5" />
    </g>
  );
}

function Headphones() {
  return (
    <g>
      {/* Band */}
      <path d="M 75 38 Q 100 25 125 38" fill="none" stroke="#555" strokeWidth="5" strokeLinecap="round" />
      {/* Earcups */}
      <rect x="68" y="42" width="10" height="18" rx="5" fill="#444" />
      <rect x="122" y="42" width="10" height="18" rx="5" fill="#444" />
      {/* Cushions */}
      <rect x="69" y="43" width="8" height="16" rx="4" fill="#666" />
      <rect x="123" y="43" width="8" height="16" rx="4" fill="#666" />
    </g>
  );
}

function BowTie() {
  return (
    <g transform="translate(100, 112)">
      <path d="M -14 -6 L 0 0 L -14 6 Z" fill="#4169E1" />
      <path d="M 14 -6 L 0 0 L 14 6 Z" fill="#4169E1" />
      <circle cx="0" cy="0" r="3" fill="#3158C8" />
    </g>
  );
}

function Crown() {
  return (
    <g transform="translate(100, 28)">
      {/* Crown base */}
      <rect x="-18" y="4" width="36" height="12" rx="2" fill="#FFD700" />
      {/* Points */}
      <polygon points="-18,4 -14,-8 -8,4" fill="#FFD700" />
      <polygon points="-6,4 0,-12 6,4" fill="#FFD700" />
      <polygon points="8,4 14,-8 18,4" fill="#FFD700" />
      {/* Jewels */}
      <circle cx="-11" cy="-2" r="2" fill="#FF0000" />
      <circle cx="0" cy="-5" r="2.5" fill="#4169E1" />
      <circle cx="11" cy="-2" r="2" fill="#FF0000" />
      {/* Base jewels */}
      <circle cx="-8" cy="8" r="1.5" fill="#00FF00" />
      <circle cx="0" cy="9" r="1.5" fill="#FF0000" />
      <circle cx="8" cy="8" r="1.5" fill="#00FF00" />
    </g>
  );
}

function WitchHat() {
  return (
    <g transform="translate(100, 25)">
      {/* Brim */}
      <ellipse cx="0" cy="10" rx="26" ry="6" fill="#4B0082" />
      {/* Cone */}
      <polygon points="-14,10 0,-24 14,10" fill="#4B0082" />
      {/* Crease */}
      <path d="M -6 3 Q 0 -2 6 3" fill="none" stroke="#3A0068" strokeWidth="1" />
      {/* Buckle */}
      <rect x="-4" y="6" width="8" height="8" rx="1" fill="none" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  );
}

function SantaHat() {
  return (
    <g transform="translate(100, 25)">
      <polygon points="-18,10 0,-30 18,10" fill="#FF0000" />
      <ellipse cx="0" cy="10" rx="19" ry="5" fill="white" />
      <circle cx="0" cy="-30" r="5" fill="white" />
      <path d="M 2 -20 Q 10 -18 16 -10 Q 12 -14 2 -16 Z" fill="#CC0000" />
    </g>
  );
}

/* ---------- New Real-Life Accessories ---------- */

function Thermometer() {
  return (
    <g transform="translate(120, 95)">
      {/* Stick */}
      <rect x="-3" y="-22" width="6" height="28" rx="3" fill="white" stroke="#DDD" strokeWidth="1" />
      {/* Bulb end */}
      <circle cx="0" cy="8" r="6" fill="#FF4444" stroke="#DDD" strokeWidth="1" />
      {/* Mercury line */}
      <rect x="-1.5" y="-2" width="3" height="14" rx="1.5" fill="#FF4444" />
      {/* Tick marks */}
      <line x1="4" y1="-15" x2="8" y2="-15" stroke="#999" strokeWidth="0.8" />
      <line x1="4" y1="-8" x2="8" y2="-8" stroke="#999" strokeWidth="0.8" />
      <line x1="4" y1="-1" x2="8" y2="-1" stroke="#999" strokeWidth="0.8" />
    </g>
  );
}

function Umbrella() {
  return (
    <g transform="translate(130, 30)">
      {/* Handle */}
      <path d="M -5 50 Q -10 40 0 35" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
      {/* Canopy */}
      <path d="M -30 35 Q -15 0 0 35 Q 15 0 30 35 Z" fill="#4488FF" />
      {/* Ribs */}
      <line x1="0" y1="5" x2="-15" y2="35" stroke="#3366CC" strokeWidth="1" />
      <line x1="0" y1="5" x2="0" y2="35" stroke="#3366CC" strokeWidth="1" />
      <line x1="0" y1="5" x2="15" y2="35" stroke="#3366CC" strokeWidth="1" />
      {/* Top point */}
      <circle cx="0" cy="5" r="3" fill="#3366CC" />
    </g>
  );
}

function CoffeeCup() {
  return (
    <g transform="translate(120, 120)">
      {/* Cup body */}
      <rect x="-14" y="-10" width="28" height="18" rx="3" fill="#FFF" stroke="#DDD" strokeWidth="1.5" />
      {/* Handle */}
      <path d="M 14 -4 Q 22 -4 22 4 Q 22 10 14 8" fill="none" stroke="#DDD" strokeWidth="3" strokeLinecap="round" />
      {/* Coffee */}
      <rect x="-11" y="-4" width="22" height="8" rx="2" fill="#6B3A2E" />
      {/* Steam */}
      <path d="M -4 -12 Q -2 -16 -4 -20" fill="none" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 4 -14 Q 6 -18 4 -22" fill="none" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function Bandage() {
  return (
    <g>
      {/* Head bandage cross */}
      <g transform="translate(75, 65)">
        <rect x="-3" y="-10" width="6" height="20" rx="2" fill="#F5DEB3" />
        <rect x="-10" y="-3" width="20" height="6" rx="2" fill="#F5DEB3" />
        <rect x="-1" y="-1" width="2" height="2" fill="#FFF" />
      </g>
    </g>
  );
}

function Guitar() {
  return (
    <g transform="translate(125, 85)">
      {/* Neck */}
      <rect x="4" y="-40" width="6" height="35" rx="2" fill="#8B4513" />
      {/* Headstock */}
      <rect x="2" y="-50" width="10" height="12" rx="2" fill="#6B3410" />
      {/* Tuning pegs */}
      <circle cx="0" cy="-48" r="1.5" fill="#DDD" />
      <circle cx="14" cy="-48" r="1.5" fill="#DDD" />
      <circle cx="0" cy="-42" r="1.5" fill="#DDD" />
      <circle cx="14" cy="-42" r="1.5" fill="#DDD" />
      {/* Body */}
      <ellipse cx="7" cy="10" rx="16" ry="12" fill="#DEB887" stroke="#8B4513" strokeWidth="1.5" />
      <ellipse cx="7" cy="15" rx="13" ry="8" fill="#DEB887" stroke="#8B4513" strokeWidth="1.5" />
      {/* Sound hole */}
      <circle cx="7" cy="10" r="6" fill="#6B3410" />
      {/* Strings */}
      <line x1="5" y1="-40" x2="5" y2="12" stroke="#DDD" strokeWidth="0.5" />
      <line x1="7" y1="-40" x2="7" y2="12" stroke="#DDD" strokeWidth="0.5" />
      <line x1="9" y1="-40" x2="9" y2="12" stroke="#DDD" strokeWidth="0.5" />
    </g>
  );
}

function Pillow() {
  return (
    <g transform="translate(100, 155)">
      <rect x="-40" y="-12" width="80" height="22" rx="8" fill="white" stroke="#DDD" strokeWidth="1" />
      {/* Pillow lines */}
      <line x1="-30" y1="-6" x2="30" y2="-6" stroke="#EEE" strokeWidth="1" />
      <line x1="-30" y1="0" x2="30" y2="0" stroke="#EEE" strokeWidth="1" />
      <line x1="-30" y1="6" x2="30" y2="6" stroke="#EEE" strokeWidth="1" />
    </g>
  );
}

function HardHat() {
  return (
    <g transform="translate(100, 28)">
      {/* Hat brim */}
      <ellipse cx="0" cy="12" rx="24" ry="5" fill="#FFA500" />
      {/* Hat dome */}
      <path d="M -22 12 Q -20 -8 0 -12 Q 20 -8 22 12 Z" fill="#FFA500" stroke="#E89600" strokeWidth="1" />
      {/* Ridge */}
      <rect x="-1.5" y="-10" width="3" height="22" rx="1" fill="#E89600" />
    </g>
  );
}

function Laptop() {
  return (
    <g transform="translate(100, 130)">
      {/* Base/keyboard */}
      <rect x="-30" y="8" width="60" height="6" rx="1" fill="#CCC" stroke="#AAA" strokeWidth="1" />
      {/* Screen */}
      <rect x="-22" y="-22" width="44" height="30" rx="2" fill="#333" stroke="#555" strokeWidth="1" />
      {/* Screen content */}
      <rect x="-20" y="-20" width="40" height="20" rx="1" fill="#4488FF" opacity="0.6" />
      {/* Code lines */}
      <line x1="-16" y1="-16" x2="-4" y2="-16" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
      <line x1="-16" y1="-12" x2="2" y2="-12" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
      <line x1="-16" y1="-8" x2="-8" y2="-8" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
      {/* Hinge */}
      <line x1="-22" y1="8" x2="22" y2="8" stroke="#999" strokeWidth="1.5" />
    </g>
  );
}

function MudSplat() {
  return (
    <g>
      <ellipse cx="80" cy="145" rx="12" ry="6" fill="#8B6914" opacity="0.7" />
      <ellipse cx="125" cy="150" rx="8" ry="4" fill="#8B6914" opacity="0.5" />
      <ellipse cx="110" cy="140" rx="6" ry="3" fill="#8B6914" opacity="0.6" />
      <ellipse cx="90" cy="38" rx="5" ry="3" fill="#8B6914" opacity="0.4" />
    </g>
  );
}