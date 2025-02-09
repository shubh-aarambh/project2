# Emergency Flight Finder

## Overview

The **Emergency Flight Finder** is a web application designed to help users find emergency flights, nearby hotels and hospitals, and weather information for any city. This application integrates multiple APIs to provide real-time flight data, weather updates, and location-based services.

## Features

- **Search for emergency flights** based on IATA airport codes.
- **View nearby hotels and hospitals** for medical emergencies.
- **Check live weather information** for a searched city.
- **Interactive Google Maps integration** to display location-based services.

## APIs Used

### 1. **AviationStack API**

- Delivers real-time flight tracking and status information.
- Ensures users get live updates on flight schedules, delays, and cancellations.
- Helps users make informed travel decisions in emergency situations.

### 2. **OpenWeatherMap API**

- Retrieves real-time weather data for any city.
- Displays current temperature, humidity, wind speed, and general weather conditions.
- Enhances the user’s travel planning experience by providing necessary weather insights.

### 3. **Google Maps & Places API**

- Provides an interactive map to locate hospitals and hotels near an airport or city.
- Uses **Google Places API** to fetch highly-rated hospitals and hotels in the searched city.
- Helps emergency travelers find accommodation and medical assistance quickly.

## Installation & Setup

### Prerequisites:

- Node.js installed on your system
- API keys for:
  - Google Maps API
  - AviationStack API
  - OpenWeatherMap API

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/emergency-flight-finder.git
   cd emergency-flight-finder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API keys:
   - Replace placeholder API keys in the `config` object inside `app.js`.
4. Start the project:
   ```bash
   npm start
   ```

## Usage

- Enter a **city name** to fetch nearby hospitals, hotels, and weather details.
- Use **IATA airport codes** (e.g., DEL for Delhi, JFK for New York) to search for emergency flights.
- Click on **Google Map markers** to view detailed information about hospitals and hotels.
- Click the **"Book Flight"** link to be redirected to airline ticketing pages.

## Future Enhancements

- **User authentication** to save search history and preferences.
- **Integration with ambulance services** for emergency medical assistance.
- **Multi-language support** for a better user experience globally.

## Contact

For any queries or contributions, please contact:

- **Developer:** Shubh Shukla
- **Email:** [shubhshukla1006@gmail.com](mailto\:your-email@example.com)