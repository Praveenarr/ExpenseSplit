import { getInitials } from '../utils';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ name, color, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`avatar ${sizes[size]} ${className}`}
      style={{ background: color }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
