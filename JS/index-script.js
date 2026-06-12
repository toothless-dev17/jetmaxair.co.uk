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

// Profile Modal Functionality
const profileOverlay = document.getElementById('profileOverlay');
const profileModal = document.getElementById('profileModal');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileImg = document.getElementById('profileImg');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const flyMilesEl = document.getElementById('flyMiles');
const birthdayEl = document.getElementById('birthday');

// Open auth modal when account icon is clicked - add touch support
function openAuthModal() {
    authModal.classList.add('active');
    authOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open profile modal when user is logged in
function openProfileModal(user) {
    // Update profile information
    profileEmail.textContent = user.email || 'guest@example.com';
    profileName.textContent = user.displayName || 'Guest User';
    
    // Set profile picture if available
    if (user.photoURL) {
        profileImg.src = user.photoURL;
    } else {
        profileImg.src = ''; // Reset to default if no photo
    }
    
    // Get additional user data from Firestore (if we had it, currently using defaults)
    // For now, use some sample data - in production you'd fetch from Firebase Firestore
    flyMilesEl.textContent = user.metadata.creationTime ? Math.floor(Math.random() * 5000) + 1000 : 0; // Random miles for demo
    
    // Check if user has a birthday set (Google provides this if available, otherwise 'Not set')
    birthdayEl.textContent = 'Not set';
    
    // Show the profile modal
    profileModal.classList.add('active');
    profileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close profile modal
function closeProfileModal() {
    profileModal.classList.remove('active');
    profileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Desktop account button click handler
userAccountBtn.addEventListener('click', function() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        openAuthModal();
    } else {
        openProfileModal(currentUser);
    }
});
userAccountBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        openAuthModal();
    } else {
        openProfileModal(currentUser);
    }
}, { passive: false });

// Mobile account button - add the same functionality as desktop
const mobileUserAccountBtn = document.getElementById('mobileUserAccount');
mobileUserAccountBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        openAuthModal();
    } else {
        // Close mobile menu first
        closeMobileMenu();
        openProfileModal(currentUser);
    }
});
mobileUserAccountBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        openAuthModal();
    } else {
        // Close mobile menu first
        closeMobileMenu();
        openProfileModal(currentUser);
    }
}, { passive: false });

// Close profile modal event listeners
closeProfileBtn.addEventListener('click', closeProfileModal);
profileOverlay.addEventListener('click', closeProfileModal);

// Logout functionality
logoutBtn.addEventListener('click', function() {
    auth.signOut().then(() => {
        closeProfileModal();
        alert('You have been logged out successfully.');
    }).catch((error) => {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    });
});

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

// Auth state listener - UI updates
auth.onAuthStateChanged((user) => {
    const userAccountBtn = document.querySelector('.user-account');
    const mobileUserAccountBtn = document.getElementById('mobileUserAccount');
    
    console.log('Auth state changed. User:', user ? user.email : 'null');
    if (user) console.log('User photoURL:', user.photoURL);
    
    if (user) {
        // Get user's profile photo if available
        const photoURL = user.photoURL;
        
        // Update desktop account icon
        if (userAccountBtn) {
            // First clear any existing content
            userAccountBtn.innerHTML = '';
            if (photoURL) {
                const img = document.createElement('img');
                img.src = photoURL;
                img.alt = 'Profile';
                img.className = 'user-profile-img';
                userAccountBtn.appendChild(img);
                console.log('Desktop profile image set');
            } else {
                const icon = document.createElement('i');
                icon.className = 'fas fa-user-check';
                userAccountBtn.appendChild(icon);
            }
            userAccountBtn.title = user.email;
        }
        
        // Update mobile account icon to show profile picture if available
        if (mobileUserAccountBtn) {
            mobileUserAccountBtn.innerHTML = '';
            if (photoURL) {
                const img = document.createElement('img');
                img.src = photoURL;
                img.alt = 'Profile';
                img.style.width = '24px';
                img.style.height = '24px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                img.style.marginRight = '8px';
                mobileUserAccountBtn.appendChild(img);
                const span = document.createElement('span');
                span.textContent = user.displayName || 'Account';
                mobileUserAccountBtn.appendChild(span);
            } else {
                mobileUserAccountBtn.innerHTML = '<i class="fas fa-user-check"></i> ' + (user.displayName || 'Account');
            }
        }
    } else {
        console.log('No user is signed in');
        // Reset to logged out state - desktop
        if (userAccountBtn) {
            userAccountBtn.innerHTML = '';
            const icon = document.createElement('i');
            icon.className = 'fas fa-user-circle';
            userAccountBtn.appendChild(icon);
            userAccountBtn.title = 'Login / Register';
        }
        
        // Reset mobile account to default state
        if (mobileUserAccountBtn) {
            mobileUserAccountBtn.innerHTML = '<i class="fas fa-user-circle"></i> Account';
        }
    }
});