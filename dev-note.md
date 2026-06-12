// Add 5000 miles to a user
FlyMilesManager.adminAddMiles("customer.email@gmail.com", 5000);

// Set a user's miles to exactly 15000
FlyMilesManager.adminUpdateUserMiles("customer.email@gmail.com", 15000);

// Get any user's miles to verify
await FlyMilesManager.getFlyMiles("customer.email@gmail.com");

// Force create your user document
await FlyMilesManager.getFlyMiles("YOUR.EMAIL@gmail.com");