import { taskModal, closeModal } from "./ui-tasks.js";
import { signOut } from "../auth.js";

// Dom cache
const menuBtn = document.getElementsByClassName("resp-menu_btn")[0];
const sidebar = document.getElementsByClassName("sidebar")[0];
const darkOverlay = document.getElementsByClassName("dark-overlay")[0];

// Event Listeners
menuBtn.addEventListener("click", closeMenu);
darkOverlay.addEventListener("click", () => {
    if (taskModal.classList.contains("active")) {
        return closeModal();
    }

    closeMenu();
});


const observer = new ResizeObserver(entries => {
    if (entries[0].contentRect.width > 992 && sidebar.classList.contains("active")) {
        closeMenu();
    }
});
observer.observe(document.body);


function closeMenu() {
    sidebar.classList.toggle("active");
    darkOverlay.classList.toggle("menu-active");
}


export {
    sidebar,
    darkOverlay
}

export function createSignOutButton() {
    const button = document.createElement('button');
    button.textContent = 'Sign Out';
    button.className = 'sign-out-btn';

    button.addEventListener('click', async () => {
        await signOut();
        window.location.reload();
    });

    return button;
}