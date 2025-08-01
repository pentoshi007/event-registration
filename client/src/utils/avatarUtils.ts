// Avatar utility functions for generating dynamic user avatars

export interface AvatarConfig {
    backgroundColor: string;
    textColor: string;
    initials: string;
}

// Avatar color schemes
const AVATAR_COLORS = {
    admin: {
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Green gradient
        text: '#FFFFFF'
    },
    user: {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', // Purple gradient
        text: '#FFFFFF'
    }
};

/**
 * Get first character from a name
 */
export function getFirstCharacter(name: string): string {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
}

/**
 * Get avatar color scheme based on user role
 */
export function getAvatarColor(user: { email: string; role?: string }): { background: string; text: string } {
    // Check if user is admin
    if (user.role === 'admin' || user.email === 'admin@evently.com') {
        return AVATAR_COLORS.admin;
    }

    // All other users get purple gradient
    return AVATAR_COLORS.user;
}

/**
 * Get avatar configuration for a user
 */
export function getAvatarConfig(user: { name: string; email: string; role?: string }): AvatarConfig {
    const firstChar = getFirstCharacter(user.name);
    const colors = getAvatarColor(user);

    return {
        backgroundColor: colors.background,
        textColor: colors.text,
        initials: firstChar,
    };
}

/**
 * Always return null to force generated avatars
 */
export function getAvatarUrl(_user: { email: string; avatar?: string }): string | null {
    // Always return null to use generated avatars only
    return null;
}

/**
 * Generate SVG avatar as data URL with gradient background
 */
export function generateAvatarSvg(config: AvatarConfig, size: number = 40): string {
    // Create a unique gradient ID
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    // Extract gradient colors from the background string
    const isGradient = config.backgroundColor.includes('linear-gradient');
    let gradientDef = '';
    let fillValue = config.backgroundColor;

    if (isGradient) {
        // Parse gradient colors from the CSS gradient string
        const colorMatches = config.backgroundColor.match(/#[0-9A-Fa-f]{6}/g);
        if (colorMatches && colorMatches.length >= 2) {
            gradientDef = `
                <defs>
                    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colorMatches[0]};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colorMatches[1]};stop-opacity:1" />
                    </linearGradient>
                </defs>
            `;
            fillValue = `url(#${gradientId})`;
        }
    }

    const svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            ${gradientDef}
            <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${fillValue}"/>
            <text x="${size / 2}" y="${size / 2}" text-anchor="middle" dy="0.35em" 
                  font-family="system-ui, -apple-system, sans-serif" 
                  font-size="${size * 0.45}" font-weight="700" fill="${config.textColor}">
                ${config.initials}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}