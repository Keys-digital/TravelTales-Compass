document.addEventListener('DOMContentLoaded', function() {
    // Adding event listeners for the buttons
    document.getElementById('searchButton').addEventListener('click', search);
    document.getElementById('resetButton').addEventListener('click', clearResults);

    // Define the URL to your JSON file
    const apiUrl = './travel_recommendation_api.json';

    // Fetch data from the JSON file
    fetch(apiUrl, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Store data globally for later use
        window.travelData = data;
        console.log("Data loaded:", window.travelData); // Debugging line to ensure data is loaded
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

    // The search function that filters through the data
    function search() {
        const userInput = document.getElementById('searchBar').value.toLowerCase();
        console.log('User Input:', userInput); // Log user input

        let results = [];

        // Check for matching keywords in countries
        window.travelData.countries.forEach(country => {
            if (country.name.toLowerCase().includes(userInput)) {
                console.log('Matching country:', country.name); // Log matching countries
                results.push(...country.cities.map(city => ({
                    ...city,
                    timeZone: country.timeZone
                })));
            }
        });
        console.log('Results after countries:', results); // Log results after countries

        // Check for matching keywords in temples
        window.travelData.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(userInput)) {
                console.log('Matching temple:', temple.name); // Log matching temples
                results.push(temple);
            }
        });
        console.log('Results after temples:', results); // Log results after temples

        // Check for matching keywords in beaches
        window.travelData.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(userInput)) {
                console.log('Matching beach:', beach.name); // Log matching beaches
                results.push(beach);
            }
        });
        console.log('Results after beaches:', results); // Log results after beaches

        // Display the results
        displayResults(results);
    }

    // Function to display the filtered results
    function displayResults(results) {
        const resultsContainer = document.getElementById('results-container');
        console.log('Results Container:', resultsContainer); // Log the results container element

        if (!resultsContainer) {
            console.error("Error: Results container element not found.");
            return;
        }

        // Clear previous results
        resultsContainer.innerHTML = '';

        // If no results were found, display a message
        if (results.length === 0) {
            resultsContainer.textContent = 'No matching results found.';
            return;
        }

        // Loop through the results and display them
        results.forEach(recommendation => {
            const recommendationDiv = document.createElement('div');
            recommendationDiv.className = 'recommendation';

            const placeName = document.createElement('h2');
            placeName.textContent = recommendation.name;

            const image = document.createElement('img');
            image.src = recommendation.imageUrl;
            image.alt = recommendation.name;

            const description = document.createElement('p');
            description.textContent = recommendation.description;

            recommendationDiv.appendChild(placeName);
            recommendationDiv.appendChild(image);
            recommendationDiv.appendChild(description);

            // Display current time if timeZone is available
            if (recommendation.timeZone) {
                const options = { timeZone: recommendation.timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                const currentTime = new Date().toLocaleTimeString('en-US', options);

                const timeElement = document.createElement('p');
                timeElement.textContent = `Current time in ${recommendation.name}: ${currentTime}`;
                recommendationDiv.appendChild(timeElement);
            }

            // Append the recommendation div to the container
            resultsContainer.appendChild(recommendationDiv);
        });
    }

    // Function to clear the search results and search bar
    function clearResults() {
        // Clear the search field and results container
        document.getElementById('searchBar').value = '';
        document.getElementById('results-container').innerHTML = '';
    }
});
