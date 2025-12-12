# Solina AI

Solina AI is an emotional support web application designed to provide users with a safe space to express their feelings and receive support through AI-driven chat interactions. The application features a user-friendly interface, emotional tracking, and access to resources for mental well-being.

## Project Structure

The project is divided into two main parts: the frontend and the backend.

### Frontend

The frontend is built using React and TypeScript, and it includes the following key components:

- **Chat**: A chat interface for users to interact with Solina AI.
  - `ChatWindow.tsx`: Main chat interface.
  - `MessageBubble.tsx`: Displays individual messages.
  - `InputField.tsx`: Input field for user messages.

- **Emotion Tracker**: Components for tracking and displaying emotions.
  - `EmotionDisplay.tsx`: Shows the user's current emotional state.
  - `MoodSelector.tsx`: Allows users to select and log their mood.

- **Navigation**: Navigation components for the application.
  - `Navbar.tsx`: Top navigation bar.
  - `Sidebar.tsx`: Sidebar for navigation.

- **Common Components**: Reusable components.
  - `Button.tsx`: Reusable button.
  - `Card.tsx`: Reusable card for content display.
  - `Loading.tsx`: Loading indicator.

- **Pages**: Main pages of the application.
  - `Home.tsx`: Home page.
  - `Chat.tsx`: Chat page.
  - `MoodHistory.tsx`: Displays mood history.
  - `Resources.tsx`: Links to emotional support resources.
  - `Profile.tsx`: User profile management.
  - `Auth`: Authentication pages.
    - `Login.tsx`: User login page.
    - `Register.tsx`: User registration page.

- **Hooks**: Custom hooks for managing state.
  - `useAuth.ts`: Authentication logic.
  - `useChat.ts`: Chat functionality.
  - `useEmotions.ts`: Emotional state tracking.

- **Context**: Context providers for global state management.
  - `AuthContext.tsx`: Authentication context.
  - `ChatContext.tsx`: Chat context.

- **Services**: API and emotion-related services.
  - `api.ts`: Axios instance configuration.
  - `emotionService.ts`: Functions for emotional data management.

- **Utilities**: Helper functions and types.
  - `helpers.ts`: Utility functions.
  - `index.ts`: Type definitions.

- **Styles**: Global styles for the application.
  - `globals.css`: Global CSS styles.

### Backend

The backend is built using Node.js and TypeScript, and it includes the following key components:

- **Controllers**: Handle business logic for different routes.
  - `authController.ts`: User authentication.
  - `chatController.ts`: Chat functionality.
  - `emotionController.ts`: Emotional data management.
  - `userController.ts`: User profile management.

- **Routes**: Define API endpoints.
  - `authRoutes.ts`: Authentication routes.
  - `chatRoutes.ts`: Chat-related routes.
  - `emotionRoutes.ts`: Emotional data routes.
  - `index.ts`: Consolidated routes.

- **Models**: Database models for the application.
  - `User.ts`: User model.
  - `Conversation.ts`: Conversation model.
  - `Message.ts`: Message model.
  - `EmotionLog.ts`: Emotion log model.

- **Middleware**: Middleware functions for request handling.
  - `auth.ts`: JWT verification.
  - `errorHandler.ts`: Global error handling.

- **Services**: External service integrations.
  - `aiService.ts`: AI functionality integration.
  - `emotionAnalysisService.ts`: Emotion analysis logic.

- **Config**: Configuration files.
  - `database.ts`: Database connection management.

- **Utilities**: Helper functions and types.
  - `helpers.ts`: Utility functions.
  - `index.ts`: Type definitions.

## Getting Started

To get started with the Solina AI application, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd solina-ai
   ```

3. Install dependencies for the frontend:
   ```
   cd client
   npm install
   ```

4. Install dependencies for the backend:
   ```
   cd ../server
   npm install
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

6. Start the development servers:
   - Frontend:
     ```
     cd client
     npm run dev
     ```
   - Backend:
     ```
     cd ../server
     npm run dev
     ```

7. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.