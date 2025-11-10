import { Clerk } from '@clerk/clerk-js';

// Use the value injected by webpack DefinePlugin (process.env.CLERK_PUBLISHABLE_KEY)
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || 'YOUR_PUBLISHABLE_KEY';

// Initialize Clerk with the publishable key
const clerk = new Clerk(publishableKey);

export async function initAuth() {
  // Load Clerk - this initializes the Clerk session
  await clerk.load();
  return clerk;
}

/**
 * Mount a sign-in UI into the given container id if possible.
 * Falls back to showing a sign-in button that calls `openSignIn` when mounted widget is
 * not available in the Clerk client version.
 * Returns true if the mount or fallback UI was rendered.
 */
export function mountSignIn(containerId = 'auth-container') {
  const container = typeof window !== 'undefined' && document.getElementById(containerId);
  if (!container) return false;

  // Prefer a client-side mount function when available
  if (typeof clerk.mountSignIn === 'function') {
    try {
      clerk.mountSignIn(container);
      return true;
    } catch (e) {
      // fall through to fallback
    }
  }

  // If no mount method, expose a simple button that triggers the sign-in modal/flow
  if (typeof clerk.openSignIn === 'function') {
    container.innerHTML = '';
    const btn = document.createElement('button');
    btn.id = 'clerk-signin-btn';
    btn.textContent = 'Sign in';
    btn.className = 'clerk-signin-btn';
    btn.addEventListener('click', () => {
      clerk.openSignIn();
    });
    container.appendChild(btn);
    return true;
  }

  // Last resort: instruct the user
  container.innerHTML = '<p>Sign-in is not available. Please configure Clerk publishable key.</p>';
  return false;
}

export function getUser() {
  return clerk?.user || null;
}

export function isSignedIn() {
  return !!clerk?.user;
}

export async function signOut() {
  if (typeof clerk.signOut === 'function') {
    await clerk.signOut();
  }
}

export default clerk;
