import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    // Go to signup page
    await page.goto('/signup');
    
    // Fill out registration form
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Should redirect to home page after successful registration
    await expect(page).toHaveURL('/');
    
    // Check if user is logged in (look for user menu or logout button)
    await expect(page.locator('nav')).toContainText('Test User');
  });

  test('user cannot register with invalid email', async ({ page }) => {
    await page.goto('/signup');
    
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('.error')).toBeVisible();
  });

  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Use demo credentials that should exist
    await page.fill('input[type="email"]', 'user@eventinity.com');
    await page.fill('input[type="password"]', 'user123');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Check if user is logged in
    await expect(page.locator('nav')).toContainText('Demo User');
  });

  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.error')).toBeVisible();
    
    // Should still be on login page
    await expect(page).toHaveURL('/login');
  });

  test('admin can access admin dashboard', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@eventinity.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Navigate to admin dashboard
    await page.goto('/admin');
    
    // Should be able to access admin page
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('regular user cannot access admin dashboard', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@eventinity.com');
    await page.fill('input[type="password"]', 'user123');
    await page.click('button[type="submit"]');
    
    // Try to access admin dashboard
    await page.goto('/admin');
    
    // Should be redirected or show error
    await expect(page).not.toHaveURL('/admin');
  });
});
