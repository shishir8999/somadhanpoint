import React from 'react';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  role,
  size = 'md',
  className = '',
}) => {
  // Generate deterministic gradient based on name string
  const gradients = [
    'from-indigo-600 to-cyan-500',
    'from-emerald-600 to-teal-500',
    'from-violet-600 to-fuchsia-500',
    'from-amber-600 to-rose-500',
    'from-blue-600 to-indigo-700',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradient = gradients[Math.abs(hash) % gradients.length];

  // Get first 1-2 letters
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-14 h-14 text-base font-bold',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-tr ${gradient} font-bold text-white shrink-0 shadow-sm select-none ring-1 ring-white/10 ${sizeClasses} ${className}`}
      aria-label={name}
    >
      <span>{initials}</span>
      {role === 'super_admin' && (
        <span
          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-[8px] text-slate-950 font-black rounded-full flex items-center justify-center ring-2 ring-slate-950"
          title="সুপার অ্যাডমিন"
        >
          ★
        </span>
      )}
    </div>
  );
};
