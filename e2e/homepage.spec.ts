import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page title is correct
  await expect(page).toHaveTitle(/Eventinity/);
  
  // Check if navigation is present
  await expect(page.locator('nav')).toBeVisible();
  
  // Check if hero section is present
  await expect(page.locator('h1')).toContainText('Explore Amazing Events');
});

test('user can view events', async ({ page }) => {
  await page.goto('/');
  
  // Wait for events to load
  await page.waitForSelector('[data-testid="event-card"]', { timeout: 10000 });
  
  // Check if events are displayed
  const eventCards = page.locator('[data-testid="event-card"]');
  await expect(eventCards.first()).toBeVisible();
});

test('user can navigate to login page', async ({ page }) => {
  await page.goto('/');
  
  // Click login button
  await page.click('text=Login');
  
  // Check if we're on the login page
  await expect(page).toHaveURL('/login');
  await expect(page.locator('h2')).toContainText('Login');
});

test('user can navigate to signup page', async ({ page }) => {
  await page.goto('/');
  
  // Click signup button
  await page.click('text=Sign Up');
  
  // Check if we're on the signup page
  await expect(page).toHaveURL('/signup');
  await expect(page.locator('h2')).toContainText('Sign Up');
});

test('responsive design works on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Check if mobile navigation works
  await expect(page.locator('nav')).toBeVisible();
  
  // Check if content is properly displayed on mobile
  await expect(page.locator('h1')).toBeVisible();
});
