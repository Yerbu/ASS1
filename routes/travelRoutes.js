document.getElementById('cityDropdown').addEventListener('change', function () {
    document.getElementById('city').value = this.value;
});

function getTourImage(city) {
    switch (city) {
        case 'Astana':
            return '/images/astana.png';
        case 'London':
            return '/images/london.png';
        case 'New York':
            return '/images/new-york.png';
        case 'Tokyo':
            return '/images/tokyo.png';
        case 'Sydney':
            return '/images/sydney.png';
        default:
            return '/images/placeholder.png';
    }
}

async function showTour() {
    try {
        const city = document.getElementById('cityDropdown').value;

        console.log(`Selected City: ${city}`);

        // Fetch weather information for the selected city
        const response = await fetch(`/getWeather?city=${city}`);
        const weatherData = await response.json();

        console.log('Weather Data:', weatherData);

        // Display temperature
        document.getElementById('weather-temperature').innerText = weatherData.main.temp.toFixed(1);

        // Display weather conditions with icon
        const weatherConditions = weatherData.weather[0].description;
        const weatherIcon = weatherData.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIcon}.png`;

        document.getElementById('weather-conditions').innerHTML = `
            <img src="${weatherIconUrl}" alt="${weatherConditions} Icon" class="weather-icon">
            ${weatherConditions}
        `;

        document.getElementById('weather-info').style.display = 'block';

        document.querySelector('.tours-container').innerHTML = '';

        const toursContainer = document.querySelector('.tours-container');
        const tourCard = document.createElement('div');
        tourCard.className = 'tour';

        // Tour Information
        const tourDates = getTourDates(city);
        const tourDuration = getTourDuration(city);
        const tourDescription = getTourDescription(city);
        const tourDetails = getTourDetails(city);
        const tourPrice = getTourPrice(city);

        // Create a container for text content
        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';

        // Append text content to the text container
        textContainer.innerHTML = `
            <h3 class="tour-title">${city}</h3>
            <p class="tour-info tour-dates">Dates: ${tourDates}</p>
            <p class="tour-info tour-duration">Duration: ${tourDuration}</p>
            <p class="tour-info tour-description">Description: ${tourDescription}</p>
            <p class="tour-info tour-details">Details: ${tourDetails}</p>
            <p class="tour-info tour-price">Price: ${tourPrice}$</p>
            <button class="btn btn-success" onclick="bookTour('${city}')">Book Now</button>
        `;

        // Append the text container to the tour card
        tourCard.appendChild(textContainer);

        // Add an image element
        const tourImage = document.createElement('img');
        tourImage.src = getTourImage(city);
        tourImage.alt = `${city} Image`;
        tourImage.className = 'city-image';

        // Append image to the tour card
        tourCard.appendChild(tourImage);

        toursContainer.appendChild(tourCard);

    } catch (error) {
        console.error(error);
        alert('Error fetching information. Please try again.');
    }
}

// Function to filter tours based on unique descriptions
function filterTours() {
    const showUniqueDescriptionOnly = document.getElementById('uniqueDescriptionCheckbox').checked;
    const toursContainer = document.querySelector('.tours-container');

    // Filter tours based on unique descriptions
    const uniqueTours = showUniqueDescriptionOnly
        ? Array.from(toursContainer.children).filter((tour) => {
            const description = tour.querySelector('.tour-description').innerText;
            return Array.from(toursContainer.children).filter((t) => t !== tour && t.querySelector('.tour-description').innerText === description).length === 0;
        })
        : Array.from(toursContainer.children);

    // Clear existing tours and display filtered tours
    toursContainer.innerHTML = '';
    uniqueTours.forEach((tour) => toursContainer.appendChild(tour));
}

// Mock function for tour dates
function getTourDates(city) {
    switch (city) {
        case 'Astana':
            return '18.02.2024 - 28.02.2024';
        case 'London':
            return '15.03.2024 - 30.03.2024';
        case 'New York':
            return '10.04.2024 - 24.04.2024';
        case 'Tokyo':
            return '05.05.2024 - 19.05.2024';
        case 'Sydney':
            return '01.06.2024 - 15.06.2024';
        default:
            return 'Unknown dates';
    }
}

// Mock function for tour duration
function getTourDuration(city) {
    switch (city) {
        case 'Astana':
            return '10 days / 9 nights';
        case 'London':
            return '12 days / 11 nights';
        case 'New York':
            return '8 days / 7 nights';
        case 'Tokyo':
            return '14 days / 13 nights';
        case 'Sydney':
            return '15 days / 14 nights';
        default:
            return 'Unknown duration';
    }
}

// Mock function for tour description
function getTourDescription(city) {
    switch (city) {
        case 'Astana':
            return 'Experience the beauty of Kazakhstan\'s capital city.';
        case 'London':
            return 'Discover the charm of historic London.';
        case 'New York':
            return 'Explore the city that never sleeps.';
        case 'Tokyo':
            return 'Immerse yourself in the vibrant culture of Tokyo.';
        case 'Sydney':
            return 'Enjoy the stunning landscapes of Sydney and beyond.';
        default:
            return 'Unknown description';
    }
}

// Mock function for tour details
function getTourDetails(city) {
    switch (city) {
        case 'Astana':
            return 'Visit iconic landmarks and savor local cuisine.';
        case 'London':
            return 'See famous landmarks like the Big Ben and Buckingham Palace.';
        case 'New York':
            return 'Experience Broadway shows and Central Park.';
        case 'Tokyo':
            return 'Explore traditional shrines and modern districts.';
        case 'Sydney':
            return 'Discover the Sydney Opera House and Bondi Beach.';
        default:
            return 'Unknown details';
    }
}

// Mock function for tour price
function getTourPrice(city) {
    switch (city) {
        case 'Astana':
            return 1499;
        case 'London':
            return 1899;
        case 'New York':
            return 1699;
        case 'Tokyo':
            return 1999;
        case 'Sydney':
            return 2099;
        default:
            return 0; // Return a default value (you can adjust as needed)
    }
}

function bookTour(city) {
    // Additional logic for booking, e.g., opening the modal
    $('#bookingModal').modal('show');

    // Calculate and display total price in the modal
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    const totalPrice = calculateTotalPrice(city, adults, children);
    document.getElementById('totalPrice').innerText = `$${totalPrice.toFixed(2)}`;
    $('#bookingModal').modal('show');

    // Update total price when the modal is displayed
    updateTotalPrice();
}

function calculateTotalPrice(city) {
    // Mock calculation: Price * (Number of adults + Number of children * 0.5)
    const adults = parseInt(document.getElementById('adultsQuantity').value) || 0;
    const children = parseInt(document.getElementById('childrenQuantity').value) || 0;
    const price = getTourPrice(city);
    const totalPrice = price * (adults + children * 0.5);
    return totalPrice;
}

function updateTotalPrice() {
    const city = document.getElementById('cityDropdown').value;
    const adultsInput = document.getElementById('adultsQuantity');
    const childrenInput = document.getElementById('childrenQuantity');

    // Ensure valid integer values for adults and children
    const adults = parseInt(adultsInput.value, 10) || 0;
    const children = parseInt(childrenInput.value, 10) || 0;

    console.log('Adults:', adults);
    console.log('Children:', children);

    const price = getTourPrice(city);
    console.log('Price:', price);

    const totalPrice = price * (adults + children * 0.5);
    console.log('Total Price:', totalPrice);

    document.getElementById('totalPrice').innerText = `$${totalPrice.toFixed(2)}`;
}

function confirmBooking() {
    // Additional logic for confirming the booking, e.g., sending data to the server
    // ...

    // Close the modal after confirmation
    $('#bookingModal').modal('hide');
}


