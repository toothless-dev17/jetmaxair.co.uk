//Mobile Menu JavaScript
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

// Close menu when clicking on a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});



// Auth Modal Functionality
const userAccountBtn = document.querySelector('.user-account');
const authOverlay = document.getElementById('authOverlay');
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// Open auth modal when account icon is clicked
userAccountBtn.addEventListener('click', () => {
    authModal.classList.add('active');
    authOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close auth modal
function closeAuthModal() {
    authModal.classList.remove('active');
    authOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

closeAuthBtn.addEventListener('click', closeAuthModal);
authOverlay.addEventListener('click', closeAuthModal);

// Tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (tab.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// Password show/hide toggle
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const passwordInput = document.getElementById(targetId);
        const icon = btn.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});


// Firebase Configuration - using Firebase CDN loaded in HTML
const firebaseConfig = {
    apiKey: "AIzaSyDONLn98kJgMMGwZeEZls3Rl8r-WvsLJvo",
    authDomain: "jetmaxair-app.firebaseapp.com",
    projectId: "jetmaxair-app",
    storageBucket: "jetmaxair-app.firebasestorage.app",
    messagingSenderId: "294141270256",
    appId: "1:294141270256:web:c10c5526498481a9ad0a35",
    measurementId: "G-NN27EWG4L2"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig);
    const analytics = firebase.analytics(app);
}

// Get auth instance
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Login successful! Welcome back!');
        closeAuthModal();
        loginForm.reset();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Email/Password Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('Account created successfully! Welcome to Jetmax!');
        closeAuthModal();
        signupForm.reset();
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
});

// Google Sign In / Sign Up
async function signInWithGoogle() {
    try {
        await auth.signInWithPopup(googleProvider);
        alert('Google login successful! Welcome!');
        closeAuthModal();
    } catch (error) {
        alert('Google sign in failed: ' + error.message);
    }
}

document.getElementById('googleLoginBtn').addEventListener('click', signInWithGoogle);
document.getElementById('googleSignupBtn').addEventListener('click', signInWithGoogle);

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        // User is signed in - you can update UI here
    } else {
        console.log('No user is signed in');
        // User is signed out
    }
});