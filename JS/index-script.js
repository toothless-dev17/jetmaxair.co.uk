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

// Close menu when clicking on a link (except Account link which opens auth modal)
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    const icon = link.querySelector('i');
    if (!icon || !icon.classList.contains('fa-user-circle')) {
        link.addEventListener('click', closeMobileMenu);
    }
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

// Open auth modal when account icon is clicked - add touch support
function openAuthModal() {
    authModal.classList.add('active');
    authOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

userAccountBtn.addEventListener('click', function() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        openAuthModal();
    }
    // If user is logged in, you could add logic here to open a profile menu instead
});
userAccountBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        openAuthModal();
    }
}, { passive: false });

// Add click/touch support for mobile menu Account link
const mobileAccountLink = document.getElementById('mobileAccountLink');
if (mobileAccountLink) {
    mobileAccountLink.addEventListener('click', function(e) {
        e.preventDefault();
        const currentUser = auth.currentUser;
        // Only close menu and open auth modal if user is not logged in
        if (!currentUser) {
            closeMobileMenu(); // Close mobile menu first
            setTimeout(openAuthModal, 300); // Open auth modal after menu closes
        }
    });
    mobileAccountLink.addEventListener('touchend', function(e) {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            closeMobileMenu();
            setTimeout(openAuthModal, 300);
        }
    }, { passive: false });
}

// Close auth modal
function closeAuthModal() {
    authModal.classList.remove('active');
    authOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

closeAuthBtn.addEventListener('click', closeAuthModal);
closeAuthBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    closeAuthModal();
}, { passive: false });

authOverlay.addEventListener('click', closeAuthModal);
authOverlay.addEventListener('touchend', function(e) {
    if (e.target === authOverlay) {
        closeAuthModal();
    }
});

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

// Password show/hide toggle - Add mobile touch support
togglePasswordBtns.forEach(btn => {
    function togglePassword() {
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
    }
    
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        togglePassword();
    });
    
    btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        togglePassword();
    }, { passive: false });
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

// Email/Password Login - Enhanced mobile support
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Login successful! Welcome back ' + userCredential.user.email + '!');
            closeAuthModal();
            loginForm.reset();
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        });
}

loginForm.addEventListener('submit', handleLogin);
loginForm.addEventListener('touchend', function(e) {
    if (e.target.type === 'submit') {
        handleLogin(e);
    }
}, { passive: false });

// Email/Password Sign Up - Enhanced mobile support
function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Account created successfully! Welcome to Jetmax!');
            closeAuthModal();
            signupForm.reset();
        })
        .catch((error) => {
            console.error('Signup error:', error);
            alert('Sign up failed: ' + error.message);
        });
}

signupForm.addEventListener('submit', handleSignup);
signupForm.addEventListener('touchend', function(e) {
    if (e.target.type === 'submit') {
        handleSignup(e);
    }
}, { passive: false });

// Mobile-Friendly Google Authentication - FIX for popup blocking
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

async function signInWithGoogle() {
    try {
        if (isMobileDevice()) {
            // Use redirect method for mobile - avoids popup blockers
            await auth.signInWithRedirect(googleProvider);
        } else {
            // Use popup for desktop users
            const result = await auth.signInWithPopup(googleProvider);
            if (result.user) {
                alert('Google login successful! Welcome!');
                closeAuthModal();
            }
        }
    } catch (error) {
        console.error('Google sign in error:', error);
        alert('Google sign in failed: ' + error.message);
    }
}

// Handle redirect result when user returns from Google
auth.getRedirectResult().then((result) => {
    if (result && result.user) {
        console.log('Redirect sign-in successful:', result.user.email);
        alert('Google login successful! Welcome ' + result.user.email + '!');
        closeAuthModal();
    }
}).catch((error) => {
    if (error.code !== 'auth/null-update' && error.code !== 'auth/operation-not-supported-in-this-environment') {
        console.error('Redirect result error:', error);
    }
});

// Add both click AND touch events for Google buttons (critical for mobile)
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', signInWithGoogle);
    googleLoginBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        signInWithGoogle();
    }, { passive: false });
}

if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', signInWithGoogle);
    googleSignupBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        signInWithGoogle();
    }, { passive: false });
}

// Auth state listener - UI updates for all devices
auth.onAuthStateChanged((user) => {
    const userAccountBtn = document.querySelector('.user-account');
    const mobileAccountIcon = document.getElementById('mobileAccountIcon');
    
    if (user) {
        console.log('User is signed in:', user.email);
        
        // Get user's profile photo if available
        const photoURL = user.photoURL;
        
        // Update desktop account icon
        if (userAccountBtn) {
            if (photoURL) {
                userAccountBtn.innerHTML = `<img src="${photoURL}" alt="Profile" class="user-profile-img">`;
            } else {
                userAccountBtn.innerHTML = '<i class="fas fa-user-check"></i>';
            }
            userAccountBtn.title = user.email;
        }
        
        // Update mobile account icon
        if (mobileAccountIcon) {
            const mobileAccountLink = document.getElementById('mobileAccountLink');
            if (photoURL) {
                // Replace the icon with the profile image in mobile menu
                mobileAccountLink.innerHTML = `<img src="${photoURL}" alt="Profile" class="mobile-user-profile-img"> Account`;
            } else {
                mobileAccountLink.innerHTML = '<i class="fas fa-user-check"></i> Account';
            }
        }
    } else {
        console.log('No user is signed in');
        // Reset to logged out state - desktop
        if (userAccountBtn) {
            userAccountBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
            userAccountBtn.title = 'Login / Register';
        }
        // Reset to logged out state - mobile
        if (mobileAccountIcon) {
            const mobileAccountLink = document.getElementById('mobileAccountLink');
            mobileAccountLink.innerHTML = '<i class="fas fa-user-circle" id="mobileAccountIcon"></i> Account';
        }
    }
});