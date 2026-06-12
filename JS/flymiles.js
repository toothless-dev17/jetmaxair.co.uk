// Fly Miles Data Manager - Separate script to handle all Fly Miles related functionality
const FlyMilesManager = {
    // Firestore reference - will be initialized when Firebase is ready
    db: null,
    
    // Initialize - set up Firestore connection
    init: function() {
        // Wait for Firebase to be available
        if (typeof firebase !== 'undefined') {
            this.db = firebase.firestore();
            console.log('FlyMilesManager initialized with Firestore');
        } else {
            console.error('Firebase not loaded yet, will retry...');
            setTimeout(() => this.init(), 500);
        }
    },
    
    // Get user document reference - stores data in Firestore "users" collection
    getUserDoc: function(userEmail) {
        if (!this.db || !userEmail) return null;
        
        // Use email as document ID (normalized to lowercase)
        const normalizedEmail = userEmail.toLowerCase().replace(/\./g, ','); // Firestore doesn't allow dots in IDs
        return this.db.collection('users').doc(normalizedEmail);
    },
    
    // Get fly miles for a specific user email - fetches from Firestore
    getFlyMiles: async function(userEmail) {
        if (!userEmail) return 0;
        
        const userDoc = this.getUserDoc(userEmail);
        if (!userDoc) return 0;
        
        try {
            const docSnapshot = await userDoc.get();
            
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                console.log(`Retrieved data for ${userEmail}:`, data);
                return data.miles || 0;
            } else {
                // Create new user document with welcome miles
                await userDoc.set({
                    email: userEmail.toLowerCase(),
                    miles: 1000,
                    lifetimeMiles: 1000,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    birthday: null
                });
                console.log(`Created new user document for ${userEmail} with 1000 welcome miles`);
                return 1000;
            }
        } catch (error) {
            console.error('Error getting fly miles:', error);
            return 0;
        }
    },
    
    // Add miles to a user's account - updates Firestore
    addFlyMiles: async function(userEmail, milesToAdd) {
        if (!userEmail || milesToAdd <= 0) return 0;
        
        const userDoc = this.getUserDoc(userEmail);
        if (!userDoc) return 0;
        
        try {
            // Atomically add miles to avoid race conditions
            await userDoc.update({
                miles: firebase.firestore.FieldValue.increment(milesToAdd),
                lifetimeMiles: firebase.firestore.FieldValue.increment(milesToAdd),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const updatedDoc = await userDoc.get();
            const updatedData = updatedDoc.data();
            console.log(`Added ${milesToAdd} miles to ${userEmail}. New balance: ${updatedData.miles}`);
            return updatedData.miles;
        } catch (error) {
            // If document doesn't exist yet, create it
            if (error.code === 'not-found') {
                await userDoc.set({
                    email: userEmail.toLowerCase(),
                    miles: milesToAdd,
                    lifetimeMiles: milesToAdd,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    birthday: null
                });
                console.log(`Created new user and added ${milesToAdd} miles`);
                return milesToAdd;
            }
            console.error('Error adding fly miles:', error);
            return 0;
        }
    },
    
    // Set birthday for a user - saves to Firestore
    setBirthday: async function(userEmail, birthday) {
        if (!userEmail || !birthday) return;
        
        const userDoc = this.getUserDoc(userEmail);
        if (!userDoc) return;
        
        try {
            await userDoc.update({
                birthday: birthday,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Birthday saved for ${userEmail}: ${birthday}`);
        } catch (error) {
            // Create document if it doesn't exist
            if (error.code === 'not-found') {
                await userDoc.set({
                    email: userEmail.toLowerCase(),
                    miles: 1000,
                    lifetimeMiles: 1000,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    birthday: birthday
                });
                console.log(`Created new user and saved birthday: ${birthday}`);
            }
            console.error('Error setting birthday:', error);
        }
    },
    
    // Get birthday for a user - fetches from Firestore
    getBirthday: async function(userEmail) {
        if (!userEmail) return 'Not set';
        
        const userDoc = this.getUserDoc(userEmail);
        if (!userDoc) return 'Not set';
        
        try {
            const docSnapshot = await userDoc.get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                return data.birthday || 'Not set';
            }
            return 'Not set';
        } catch (error) {
            console.error('Error getting birthday:', error);
            return 'Not set';
        }
    },
    
    // Update profile card with user's flymiles data
    updateProfileCard: async function(user) {
        if (!user || !user.email) {
            document.getElementById('flyMiles').textContent = '0';
            document.getElementById('birthday').textContent = 'Not set';
            return;
        }
        
        const userEmail = user.email;
        
        // Get data from Firestore (async)
        const miles = await this.getFlyMiles(userEmail);
        const birthday = await this.getBirthday(userEmail);
        
        // Update the UI elements
        const flyMilesEl = document.getElementById('flyMiles');
        const birthdayEl = document.getElementById('birthday');
        const birthdayInput = document.getElementById('birthdayInput');
        const editBirthdayBtn = document.getElementById('editBirthdayBtn');
        
        if (flyMilesEl) flyMilesEl.textContent = miles.toLocaleString();
        if (birthdayEl) birthdayEl.textContent = birthday;
        
        // Set up birthday edit functionality
        if (editBirthdayBtn && birthdayInput) {
            // Remove any existing event listeners to prevent duplicates
            const newEditBtn = editBirthdayBtn.cloneNode(true);
            editBirthdayBtn.parentNode.replaceChild(newEditBtn, editBirthdayBtn);
            
            newEditBtn.addEventListener('click', function() {
                birthdayEl.style.display = 'none';
                newEditBtn.style.display = 'none';
                birthdayInput.style.display = 'inline-block';
                if (birthday !== 'Not set') {
                    birthdayInput.value = birthday;
                }
                birthdayInput.focus();
            });
            
            // Handle birthday input save
            const newInput = birthdayInput.cloneNode(true);
            birthdayInput.parentNode.replaceChild(newInput, birthdayInput);
            
            newInput.addEventListener('change', async function() {
                const selectedDate = newInput.value;
                if (selectedDate) {
                    await FlyMilesManager.setBirthday(userEmail, selectedDate);
                    birthdayEl.textContent = selectedDate;
                    newInput.style.display = 'none';
                    birthdayEl.style.display = 'inline';
                    newEditBtn.style.display = 'inline';
                    alert('Birthday saved successfully! 🎂');
                }
            });
            
            // Cancel if input loses focus without selecting a date
            newInput.addEventListener('blur', function() {
                if (!newInput.value) {
                    newInput.style.display = 'none';
                    birthdayEl.style.display = 'inline';
                    newEditBtn.style.display = 'inline';
                }
            });
        }
        
        console.log(`Profile card updated for ${userEmail}: ${miles} miles`);
    },
    
    // Add miles when user completes a flight (example function)
    addFlightMiles: function(userEmail, flightDistance) {
        // Calculate miles based on flight distance (1 mile per km flown)
        const milesEarned = Math.floor(flightDistance);
        return this.addFlyMiles(userEmail, milesEarned);
    },
    
    // Show flymiles leaderboard (for future use)
    getLeaderboard: async function() {
        if (!this.db) return [];
        
        try {
            // Get top 10 users by lifetime miles
            const snapshot = await this.db.collection('users')
                .orderBy('lifetimeMiles', 'desc')
                .limit(10)
                .get();
            
            const leaderboard = [];
            snapshot.forEach(doc => {
                leaderboard.push({
                    email: doc.data().email,
                    ...doc.data()
                });
            });
            
            return leaderboard;
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return [];
        }
    }
};

// Initialize the FlyMilesManager when the script loads
FlyMilesManager.init();