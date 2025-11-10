import "./style.css";
import "./images/GitHub-Mark.png";
import * as storage from "./modules/storage.js";
import { initAuth, isSignedIn, getUser, mountSignIn } from './modules/auth.js';
import { createSignOutButton } from './modules/ui/ui-menu.js';

async function initApp() {
	// Initialize Clerk
	const clerk = await initAuth();

	const appContainer = document.getElementById('app');
	const authContainer = document.getElementById('auth-container');

	// Function to show the app after successful sign-in
	const showApp = () => {
		if (authContainer) authContainer.style.display = 'none';
		if (appContainer) appContainer.style.display = 'block';

		const user = getUser();
		console.log('Logged in as:', user?.firstName || user?.id || 'unknown');

		// Add a sign out button to the UI (if available)
		try {
			const signOutBtn = createSignOutButton();
			const sidebarBottom = document.getElementsByClassName('sidebar_bottom')[0];
			if (sidebarBottom) sidebarBottom.appendChild(signOutBtn);
		} catch (e) {
			// ignore if ui module not present
		}

		// Initialize storage and the rest of the app
		storage.initStorage();
	};

	if (!isSignedIn()) {
		// Show sign-in UI container and mount Clerk sign-in widget
		if (authContainer) authContainer.style.display = 'block';
		if (appContainer) appContainer.style.display = 'none';

		// Mount the Clerk sign-in component
		try {
			mountSignIn('auth-container');
		} catch (e) {
			console.error('Failed to mount sign-in:', e);
		}

		// Listen for authentication state changes
		clerk.addListener((emission) => {
			if (emission.user) {
				// User has signed in
				showApp();
			}
		});
	} else {
		// User is already signed in
		showApp();
	}
}

initApp();