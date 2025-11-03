# 🏇 Horse Racing Game - Frontend Case Study

An interactive horse racing game built with React and TypeScript. This project demonstrates modern frontend development practices including state management, animations, and testing.

## 🎯 Project Overview

A complete horse racing simulation game with:
- 20 randomly generated horses
- 6-round racing system (1200m to 2200m)
- Real-time animated horse racing
- Interactive race controls
- Race results tracking

## ✨ Features

- Generate horse list with unique names and colors
- Create 6-round race schedule
- Start, pause, resume races
- Animated horse movements
- View race results and standings
- Responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 🎮 How to Play

1. **Generate Program**: Click "Generate Program" to create a 6-round race schedule
2. **Start Racing**: Click "Start Race" to begin the first round
3. **Watch Races**: Observe animated horses racing across the track
4. **Control Races**: Use pause/resume controls during races
5. **Advance Rounds**: Click "Next Round" to proceed to subsequent races
6. **View Results**: Check detailed results for each completed race

## 🏗️ Architecture

### 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Custom button component
│   ├── Game/           # Main game area with race track
│   ├── Header/         # Navigation and controls
│   ├── HorseList/      # Horse roster display
│   ├── ResultList/     # Race results display
│   ├── ScheduleList/   # Race program display
│   ├── Table/          # Generic table component
│   └── Title/          # Styled heading component
├── constants/          # Application constants
├── services/           # Business logic and data processing
├── stores/             # Zustand state management
├── styles/             # Global styles and variables
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── views/              # Page-level components
```

### 🎯 Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **SCSS** - Styling
- **Vitest** - Testing

## 🧪 Testing

- **259 tests** with **86% coverage**
- Unit tests for utilities and services
- Component tests with React Testing Library
- **All tests written with AI assistance** for comprehensive coverage

```bash
npm run test          # Run tests
npm run test:coverage # Coverage report
```

### Color Palette
- **Primary**: Dynamic horse colors (randomly generated)
- **Secondary**: Race track green (#4CAF50)
- **Accent**: Gold for winners, Silver/Bronze for podium
- **Neutral**: Grays for UI elements

### Typography
- **Headers**: Bold, clear hierarchy
- **Body**: Readable sans-serif font
- **Data**: Monospace for numbers and results

### Animations
- **Horse Movement**: CSS keyframe animations for realistic galloping
- **UI Transitions**: Smooth state changes and hover effects
- **Performance**: GPU-accelerated transforms for 60fps animation

## 📊 Performance

- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Animation Performance**: CSS transforms for hardware acceleration
- **Memory Management**: Efficient state updates and cleanup
- **Loading Speed**: Fast initial load with Vite optimization

## 🔧 Development

### Code Quality
- **ESLint**: Strict linting rules for code consistency
- **TypeScript**: Full type coverage with strict mode
- **Path Aliases**: Clean imports with @ syntax

### Component Development
- **Modular Design**: Single responsibility components
- **Props Interface**: Strict TypeScript prop definitions
- **CSS Modules**: Scoped styling to prevent conflicts

## 🚀 Deployment

### Live Demo
🎮 **[Play the Game](https://mfakyol.github.io/insider-horse-race-case/)**

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deploy to GitHub Pages

This project is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the master branch.

## 🎯 Case Study Highlights

This project demonstrates:

1. **Advanced React Patterns**: Hooks and modern React features
2. **State Management**: Complex state with Zustand
3. **Animation Techniques**: High-performance CSS animations
4. **Testing Strategy**: Comprehensive test coverage
5. **TypeScript Mastery**: Full type safety and interfaces
6. **Performance Optimization**: Bundle size and runtime performance
7. **Code Organization**: Scalable architecture and clean code

## 📝 License

This project is created as a frontend case study and is available for educational purposes.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
