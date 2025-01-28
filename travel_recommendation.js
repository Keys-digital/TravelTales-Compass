document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-button').addEventListener('click', search);
    document.getElementById('resetButton').addEventListener('click', clearResults);

    // Define the URL to your JSON file
    const apiUrl = 'C:\Users\User\Videos\COUSERA COURSES\Javascript Programming Essentials IBM\Module 5\Project\travelRecommentation\travel_recommendation_api.json';

    // Fetch data from the JSON file
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // Store data globally for later use
        window.travelData = data;
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });

    function search() {
        console.log("Search button clicked");  // Debugging line
        // Get the user input and convert to lowercase
        const userInput = document.getElementById('searchBar').value.toLowerCase();

        let results = [];

        // Check for matching keywords in countries
        window.travelData.countries.forEach(country => {
            if (country.name.toLowerCase().includes(userInput)) {
                results.push(...country.cities.map(city => ({
                    ...city,
                    timeZone: country.timeZone
                })));
            }
        });

        // Check for matching keywords in temples
        window.travelData.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(userInput)) {
                results.push(temple);
            }
        });

        // Check for matching keywords in beaches
        window.travelData.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(userInput)) {
                results.push(beach);
            }
        });

        // Display the results
        displayResults(results);
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById('results-container');

        // Clear previous results
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.textContent = 'No matching results found.';
            return;
        }

        results.forEach(recommendation => {
            // Create elements for each recommendation
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

    function clearResults() {
        console.log("Reset button clicked");  // Debugging line
        // Clear the search field and results container
        document.getElementById('searchBar').value = '';
        document.getElementById('results-container').innerHTML = '';
    }
});
