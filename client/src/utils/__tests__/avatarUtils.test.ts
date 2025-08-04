import { describe, it, expect } from 'vitest';
import { getFirstCharacter, getAvatarColor, getAvatarConfig, generateAvatarSvg } from '../avatarUtils';

describe('Avatar Utils', () => {
  describe('getFirstCharacter', () => {
    it('returns first character for name', () => {
      expect(getFirstCharacter('John Doe')).toBe('J');
    });

    it('returns uppercase first character', () => {
      expect(getFirstCharacter('john')).toBe('J');
    });

    it('handles empty string', () => {
      expect(getFirstCharacter('')).toBe('U');
    });

    it('handles whitespace', () => {
      expect(getFirstCharacter('  John  ')).toBe('J');
    });
  });

  describe('getAvatarColor', () => {
    it('returns admin colors for admin role', () => {
      const user = { email: 'admin@test.com', role: 'admin' };
      const colors = getAvatarColor(user);
      expect(colors.background).toContain('gradient');
      expect(colors.text).toBe('#FFFFFF');
    });

    it('returns admin colors for admin email', () => {
      const user = { email: 'admin@evently.com' };
      const colors = getAvatarColor(user);
      expect(colors.background).toContain('gradient');
      expect(colors.text).toBe('#FFFFFF');
    });

    it('returns user colors for regular user', () => {
      const user = { email: 'user@test.com', role: 'user' };
      const colors = getAvatarColor(user);
      expect(colors.background).toContain('gradient');
      expect(colors.text).toBe('#FFFFFF');
    });
  });

  describe('getAvatarConfig', () => {
    it('returns complete avatar configuration', () => {
      const user = { name: 'John Doe', email: 'john@test.com', role: 'user' };
      const config = getAvatarConfig(user);
      
      expect(config.initials).toBe('J');
      expect(config.backgroundColor).toContain('gradient');
      expect(config.textColor).toBe('#FFFFFF');
    });
  });

  describe('generateAvatarSvg', () => {
    it('generates valid SVG data URL', () => {
      const config = {
        backgroundColor: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        textColor: '#FFFFFF',
        initials: 'JD'
      };
      
      const svg = generateAvatarSvg(config, 40);
      expect(svg).toContain('data:image/svg+xml;base64,');
    });

    it('includes initials in SVG', () => {
      const config = {
        backgroundColor: '#8B5CF6',
        textColor: '#FFFFFF',
        initials: 'AB'
      };
      
      const svg = generateAvatarSvg(config, 40);
      const decoded = atob(svg.split(',')[1]);
      expect(decoded).toContain('AB');
    });
  });
});
