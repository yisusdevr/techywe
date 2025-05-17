# Event Management Dashboard

Is technical test created for the job by Jesus Palacios


## Features

- **Event Management**
  - View a list of all events with sorting and filtering
  - Create new events with form validation
  - Edit existing events
  - Delete events with confirmation
  - View detailed information about each event
  
- **User Experience**
  - Responsive design for mobile and desktop
  - Dark/Light theme toggle with Ant Design (Is a plus)
  - Jost typography from Google Fonts(Is a plus)
  - Form validation with helpful error messages
  - Loading states and error handling
  - Search functionality to filter events

- **Developer Experience**
  - Comprehensive logging system for debugging(Is a plus)
  - Clean architecture with separation of concerns
  - React Query for efficient data fetching and caching
  - Theme context for app-wide theme management

##  Technologies Used

- **React**: v19.1.0
- **Routing**: React Router v7
- **UI Framework**: Ant Design v5
- **Data Fetching**: 
  - React Query (Tanstack Query)
  - Axios
- **State Management**: React Hooks + Context API
- **Typography**: Jost font (Google Fonts)
- **Date Management**: Moment.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v8 or higher)

## 🔧 Installation

Follow these steps to get your development environment running:

1. **Clone the repository**
   ```bash
   git clone (the link of my repo)
   cd technicaltest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   > Note: Since this project uses newer versions of React (v19) and other dependencies, you might need to use the `--force` flag if you encounter compatibility issues:
   > ```bash
   > npm install --force
   > ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   The application should now be running at [http://localhost:3000](http://localhost:3000)

##  Usage

- **View Events**: The homepage displays a list of all events with search functionality.
- **Create Event**: Click the "Add Event" button to create a new event.
- **View Details**: Click on an event title or the "View" button to see event details.
- **Edit Event**: Use the "Edit" button to modify event information.
- **Delete Event**: Use the "Delete" button and confirm to remove an event.
- **Toggle Theme**: Use the light/dark mode toggle in the header to change the application theme.

##  API Integration

This project uses JSONPlaceholder ([https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)) as a mock API service. Note the following:

- JSONPlaceholder is a fake online REST API for testing and prototyping
- Changes made (create, edit, delete) will be simulated but not persist on the server
- The application will receive successful response codes from the API, but data will reset on page refresh
- The console logger will show all API interactions for debugging purposes

## Logging System

The application includes a comprehensive logging system to aid in development and debugging:

- Open the browser console to see detailed logs of application activity
- Log levels include DEBUG, INFO, WARN, and ERROR with color coding
- API calls, user interactions, and component lifecycle events are all logged
- To configure logging in development:
  ```javascript
  import logger from './utils/logger';
  
  // Change log level
  logger.config.setLevel(logger.LEVELS.DEBUG);
  
  // Disable/Enable logging
  logger.config.disable();
  logger.config.enable();
  ```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ErrorAlert.js  # Error handling component
│   ├── EventForm.js   # Form for creating/editing events
│   └── ThemeSwitch.js # Theme toggle component
├── pages/
│   └── Events/        # Event-related pages
│       ├── AddEvent.js     # Add new event page
│       ├── EditEvent.js    # Edit event page
│       ├── EventDetail.js  # Event details page
│       └── EventsList.js   # Events listing page
├── services/
│   └── eventService.js # API services for events
├── utils/
│   ├── logger.js      # Logging utility
│   └── ThemeContext.js # Theme context provider
└── App.js             # Main application component
```

## Running Tests

```bash
npm test
```

##  Building for Production

To create a production build:

```bash
npm run build
```

This will generate a `build` folder with optimized files ready for deployment.



Made with 💙 as a technical demonstration

-Jesus Palacios
