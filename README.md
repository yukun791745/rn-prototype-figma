
  # Mobile Dashboard Design

  This is a code bundle for Mobile Dashboard Design. The original project is available at https://www.figma.com/design/5ayn6fuplXSV73F3l9VOfR/Mobile-Dashboard-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Navigation Structure

  This application uses React Router for navigation between screens. The app includes a bottom tab navigation bar that allows users to navigate between the following main screens:

  - **Home** (`/`) - Dashboard with fitness metrics, recent activities, upcoming races, and news
  - **Training** (`/training`) - Training dashboard, schedules, sessions, and training plans
  - **Activities** (`/activities`) - View all activities and activity details
  - **Race** (`/race`) - Race overview, selection, goal setting, and nutrition planning
  - **AI Coach** (`/ai-coach`) - Chat interface with AI coaching assistant
  - **News** (`/news`) - Latest triathlon news and articles
  - **Settings** (`/settings`) - App settings and preferences

  ### Project Structure

  - `app/navigation/index.tsx` - Main navigation router configuration
  - `app/screens/` - Screen wrapper components for each main section
  - `app/components/` - Reusable UI components organized by feature
  - `app/components/navigation/` - Bottom navigation bar and header components

  ### Adding New Routes

  To add a new route:
  1. Create a screen component in `app/screens/`
  2. Add the route to `app/navigation/index.tsx`
  3. Update the `navTabs` array if adding a new bottom tab

  