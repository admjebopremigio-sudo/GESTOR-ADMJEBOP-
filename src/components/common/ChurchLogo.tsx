import React from 'react';

interface ChurchLogoProps {
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  showEditHint?: boolean;
}

export const ChurchLogo: React.FC<ChurchLogoProps> = ({
  logoUrl,
  size = 'md',
  className = '',
  onClick,
  showEditHint = false,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-24 h-24 text-base',
    xl: 'w-32 h-32 text-lg',
  };

  const containerClasses = `relative rounded-full flex items-center justify-center transition-all duration-200 select-none ${sizeMap[size]} ${
    onClick ? 'cursor-pointer hover:ring-2 hover:ring-amber-400 group' : ''
  } ${className}`;

  if (logoUrl && logoUrl.trim() !== '') {
    return (
      <div className={containerClasses} onClick={onClick} title={onClick ? 'Clique para editar a logomarca' : undefined}>
        <img
          src={logoUrl}
          alt="Logomarca ADMJEBOP"
          className="w-full h-full object-contain rounded-full shadow-md bg-white/10 p-1"
        />
        {showEditHint && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-semibold text-center p-1">
            Trocar
          </div>
        )}
      </div>
    );
  }

  // Official Heraldic Crest Vector for ADMJEBOP (Assembleia de Deus - Ministério Jesus o Bom Pastor)
  return (
    <div className={containerClasses} onClick={onClick} title={onClick ? 'Clique para editar a logomarca' : undefined}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer concentric rings */}
        <circle cx="100" cy="100" r="96" fill="#0B132B" stroke="#D4AF37" strokeWidth="4" />
        <circle cx="100" cy="100" r="88" fill="#1C2541" stroke="#F3E5AB" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* Gold Circular Banner Path for Curving Text */}
        <defs>
          <path id="circleTextTop" d="M 30,100 A 70,70 0 0,1 170,100" />
          <path id="circleTextBottom" d="M 170,100 A 70,70 0 0,1 30,100" />
          <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA7A1E" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="60%" stopColor="#FFA600" />
            <stop offset="100%" stopColor="#FFEA00" />
          </linearGradient>
        </defs>

        {/* Central Heraldic Shield / Diamond */}
        <polygon points="100,38 152,72 152,128 100,162 48,128 48,72" fill="#0F172A" stroke="url(#goldGradient)" strokeWidth="3" />

        {/* Cross of Christ */}
        <rect x="94" y="60" width="12" height="66" rx="2" fill="url(#goldGradient)" />
        <rect x="80" y="74" width="40" height="12" rx="2" fill="url(#goldGradient)" />

        {/* Holy Spirit Flame above the Cross */}
        <path
          d="M 100,44 C 95,50 92,54 94,59 C 96,63 100,65 100,65 C 100,65 104,63 106,59 C 108,54 105,50 100,44 Z"
          fill="url(#flameGrad)"
        />

        {/* Open Holy Bible Base */}
        <path
          d="M 68,128 Q 100,122 100,136 Q 100,122 132,128 L 130,146 Q 100,140 100,150 Q 100,140 70,146 Z"
          fill="#FAF8F5"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        {/* Bible spine and pages line */}
        <line x1="100" y1="136" x2="100" y2="150" stroke="#AA7A1E" strokeWidth="2" />
        <line x1="78" y1="135" x2="94" y2="133" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="78" y1="140" x2="94" y2="138" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="106" y1="133" x2="122" y2="135" stroke="#CBD5E1" strokeWidth="1" />
        <line x1="106" y1="138" x2="122" y2="140" stroke="#CBD5E1" strokeWidth="1" />

        {/* Shepherd's Staff (O Bom Pastor) curved on side */}
        <path
          d="M 64,88 C 64,78 74,78 74,86 L 74,116"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Olive Branch / Leaves on the right */}
        <path
          d="M 134,114 Q 138,102 134,88 M 134,106 Q 140,104 142,100 M 134,96 Q 142,94 140,88"
          fill="none"
          stroke="#22C55E"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Stars */}
        <circle cx="50" cy="100" r="2.5" fill="#FACC15" />
        <circle cx="150" cy="100" r="2.5" fill="#FACC15" />

        {/* ADMJEBOP Monogram / Text */}
        <text
          x="100"
          y="180"
          textAnchor="middle"
          fill="#FDE047"
          fontSize="11"
          fontWeight="bold"
          letterSpacing="1.5"
        >
          REMÍGIO - PB
        </text>
        <text
          x="100"
          y="28"
          textAnchor="middle"
          fill="#FDE047"
          fontSize="10"
          fontWeight="bold"
          letterSpacing="1"
        >
          ADMJEBOP
        </text>
      </svg>
      {showEditHint && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[11px] font-semibold text-center p-1 backdrop-blur-xs">
          Alterar Logo
        </div>
      )}
    </div>
  );
};
