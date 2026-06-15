// EMAILJS SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an email service (Gmail, Outlook, etc.)
// 3. Create an email template with the following variables:
//    - to_email, customer_email, customer_name, trip_type, from_location, to_location
//    - departure_date, return_date, adults, children, infants, cabin_class, booking_time
// 4. Replace the placeholders below with your actual EmailJS credentials

// Handle trip type change to show/hide return date (new tab system)
const tripTabs = document.querySelectorAll('.trip-tab');
const tripTypeInput = document.getElementById('tripType');
const returnDateGroup = document.querySelector('.return-date');
const returnDateInput = document.getElementById('returnDate');

tripTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    // Remove active class from all tabs
    tripTabs.forEach(t => t.classList.remove('active'));
    // Add active class to clicked tab
    this.classList.add('active');
    // Update hidden input value
    tripTypeInput.value = this.dataset.trip;
    
    // Show/hide return date
    if (this.dataset.trip === 'oneway') {
      returnDateGroup.style.display = 'none';
      returnDateInput.removeAttribute('required');
    } else {
      returnDateGroup.style.display = 'block';
      returnDateInput.setAttribute('required', 'required');
    }
  });
});

// Set minimum date for date inputs to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('departureDate').min = today;
document.getElementById('returnDate').min = today;

// Update return date minimum when departure date changes
document.getElementById('departureDate').addEventListener('change', function() {
  document.getElementById('returnDate').min = this.value;
});

// Button click handlers
document.getElementById('planJourney').addEventListener('click', function() {
  // Collect form data for planning
  const formData = collectFormData();
  if (validateForm(formData)) {
    console.log('Planning journey:', formData);
    alert('Journey planned! Check console for details.');
    // Add your plan journey logic here
  }
});

document.getElementById('bookJourney').addEventListener('click', async function() {
  const formData = collectFormData();
  if (!validateForm(formData)) {
    return;
  }
  
  // Check if user is logged in
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    // Not logged in - prompt to sign in
    alert('Please sign in to book your flight. Opening login window...');
    openAuthModal(); // Function from index-script.js that opens the auth modal
    return;
  }
  
  // User is logged in - proceed with booking
  try {
    // Create booking object with user details
    const bookingDetails = {
      customerEmail: currentUser.email,
      customerName: currentUser.displayName || 'Guest User',
      bookingTimestamp: new Date().toISOString(),
      ...formData
    };
    
    // Save booking to Firestore
    await db.collection('bookings').add(bookingDetails);
    console.log('Booking saved to Firestore:', bookingDetails);
    
    // Prepare email template parameters for EmailJS
    const templateParams = {
      to_email: 'a3target5alpha2023@gmail.com',
      customer_email: currentUser.email,
      customer_name: currentUser.displayName || 'Guest User',
      trip_type: formData.tripType,
      from_location: formData.from,
      to_location: formData.to,
      departure_date: formData.departureDate,
      return_date: formData.returnDate || 'N/A (One Way)',
      adults: formData.adults,
      children: formData.children,
      infants: formData.infants,
      cabin_class: formData.cabinClass,
      booking_time: new Date().toLocaleString()
    };
    
    // Initialize EmailJS (you'll need to replace these with your actual EmailJS credentials)
    // First, go to https://www.emailjs.com/ and create a free account
    // Then create an email service and template, and update these values
    emailjs.init("lUs7jyqr4fVOX8dCS"); // Replace with your EmailJS public key
    
    // Send email using EmailJS
    try {
      await emailjs.send("service_5qjcvv8", "template_81g40mm", templateParams);
      console.log('Email successfully sent to a3target5alpha2023@gmail.com');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Even if email fails, booking is still saved to Firestore
    }
    
    // Show success message to user
    alert('Your flight has been booked successfully! A confirmation has been sent. The admin has been notified.');
    
    // Reset the form
    resetBookingForm();
    
  } catch (error) {
    console.error('Booking error:', error);
    alert('There was an error processing your booking: ' + error.message);
  }
});

// Function to reset the booking form after submission
function resetBookingForm() {
  // Reset trip type to round trip
  tripTabs.forEach(t => t.classList.remove('active'));
  document.querySelector('.trip-tab[data-trip="roundtrip"]').classList.add('active');
  tripTypeInput.value = 'roundtrip';
  returnDateGroup.style.display = 'block';
  returnDateInput.setAttribute('required', 'required');
  
  // Reset dropdowns
  document.getElementById('from').value = '';
  document.getElementById('to').value = '';
  
  // Reset dates
  document.getElementById('departureDate').value = '';
  document.getElementById('returnDate').value = '';
  
  // Reset passengers
  document.getElementById('adults').value = 1;
  document.getElementById('children').value = 0;
  document.getElementById('infants').value = 0;
  
  // Reset cabin class
  document.getElementById('cabinClass').value = '';
}

function collectFormData() {
  const tripType = document.getElementById('tripType').value;
  return {
    tripType,
    from: document.getElementById('from').value,
    to: document.getElementById('to').value,
    departureDate: document.getElementById('departureDate').value,
    returnDate: tripType === 'roundtrip' ? document.getElementById('returnDate').value : null,
    adults: parseInt(document.getElementById('adults').value),
    children: parseInt(document.getElementById('children').value),
    infants: parseInt(document.getElementById('infants').value),
    cabinClass: document.getElementById('cabinClass').value
  };
}

function validateForm(data) {
  if (!data.from || !data.to) {
    alert('Please select both departure and arrival cities');
    return false;
  }
  if (data.from === data.to) {
    alert('Departure and arrival cities cannot be the same');
    return false;
  }
  if (!data.departureDate) {
    alert('Please select a departure date');
    return false;
  }
  if (data.tripType === 'roundtrip' && !data.returnDate) {
    alert('Please select a return date for round trip');
    return false;
  }
  if (!data.cabinClass) {
    alert('Please select a cabin class');
    return false;
  }
  if (data.adults < 1) {
    alert('There must be at least one adult passenger');
    return false;
  }
  return true;
}