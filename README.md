
  # Mobile Dashboard Design

  This is a code bundle for Mobile Dashboard Design. The original project is available at https://www.figma.com/design/5ayn6fuplXSV73F3l9VOfR/Mobile-Dashboard-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Navigation System

  The app now uses React Router for navigation between different screens:

  - **Home** - Dashboard with AI Coach recommendations, fitness metrics, and recent activities
  - **Training** - Training dashboard with weekly schedule, sessions, and fitness charts
  - **Race** - Race overview, selection, goal setting, and nutrition planning
  - **AI Coach** - Chat interface for AI-powered coaching advice
  - **News** - News feed with triathlon-related articles and videos
  - **Settings** - App settings and preferences

  The navigation is implemented using:
  - `react-router-dom` for routing
  - Screen components in `app/screens/` that wrap existing components
  - Navigation logic in `app/navigation/index.tsx`
  - Existing `BottomNav` component for the bottom tab bar

  ### Key Files

  - `app/navigation/index.tsx` - Main navigation configuration with routes
  - `app/screens/*Screen.tsx` - Screen wrapper components for each tab
  - `app/App.tsx` - Root component that renders the Navigation
  - `app/components/navigation/BottomNav.tsx` - Bottom tab bar UI component
  