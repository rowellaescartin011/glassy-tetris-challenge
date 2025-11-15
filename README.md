# Tetris Battle - Player vs AI

A modern, glassmorphic Tetris game featuring Player vs Computer gameplay with stunning visual effects and smooth animations.

![Tetris Battle](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## 🎮 Features

- **Dual Gameplay**: Play against an intelligent AI opponent simultaneously
- **Smart AI**: Computer player uses strategic evaluation algorithms to make optimal moves
- **Modern UI/UX**: Glassmorphism design with neon-colored pieces and smooth animations
- **Full Tetris Mechanics**: 
  - All 7 classic Tetromino pieces (I, O, T, S, Z, J, L)
  - Piece rotation and hard drop
  - Line clearing with score calculation
  - Progressive difficulty with level system
- **Real-time Statistics**: Track score, level, and lines cleared for both players
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🎯 Game Controls

| Key | Action |
|-----|--------|
| `←` | Move left |
| `→` | Move right |
| `↓` | Soft drop |
| `↑` | Rotate piece |
| `Space` | Hard drop |
| Pause button | Pause/Resume game |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 🛠️ Built With

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components

## 🎨 Design Features

- **Glassmorphism**: Frosted glass UI panels with backdrop blur effects
- **Neon Colors**: Vibrant, glowing Tetris pieces with custom shadows
- **Dark Gradients**: Deep blue to purple background gradient
- **Smooth Animations**: Fluid transitions and piece movements

## 🧠 AI Algorithm

The computer opponent uses a position evaluation algorithm that considers:
- **Hole Detection**: Penalizes creating holes in the stack
- **Height Penalty**: Prefers keeping the stack low
- **Line Clearing Bonus**: Rewards moves that clear lines
- **Strategic Placement**: Evaluates all possible rotations and positions

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎯 Scoring System

- **Single Line**: 100 points × current level
- **Multiple Lines**: Bonus multiplier for clearing 2+ lines
- **Hard Drop**: Additional points based on drop distance
- **Level Up**: Every 10 lines cleared

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Your Name - [Your GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- Classic Tetris game design by Alexey Pajitnov
- Modern UI/UX inspired by glassmorphism design trends
