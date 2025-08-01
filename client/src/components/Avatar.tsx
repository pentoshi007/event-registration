import React from 'react';
import { getAvatarConfig, getAvatarUrl, generateAvatarSvg } from '../utils/avatarUtils';

interface AvatarProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
        role?: string;
    };
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
};

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
    const avatarUrl = getAvatarUrl(user);
    const pixelSize = sizeMap[size];

    if (avatarUrl) {
        // Use provided or special avatar image
        return (
            <img
                src={avatarUrl}
                alt={user.name}
                className={`rounded-full border-2 border-gray-200 object-cover ${className}`}
                style={{ width: pixelSize, height: pixelSize }}
                onError={(e) => {
                    // Fallback to generated avatar if image fails to load
                    const config = getAvatarConfig(user);
                    const fallbackSvg = generateAvatarSvg(config, pixelSize);
                    (e.target as HTMLImageElement).src = fallbackSvg;
                }}
            />
        );
    }

    // Generate CSS-based avatar with gradient
    const config = getAvatarConfig(user);

    return (
        <div
            className={`rounded-full border-2 border-gray-200 flex items-center justify-center font-bold ${className}`}
            style={{
                width: pixelSize,
                height: pixelSize,
                background: config.backgroundColor,
                color: config.textColor,
                fontSize: pixelSize * 0.45,
                fontWeight: 700,
            }}
        >
            {config.initials}
        </div>
    );
};

export default Avatar;