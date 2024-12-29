# Zeke Chess Agent

An interactive chess game with an AI opponent that can communicate and provide insights during gameplay.

## Features

- Interactive chess board with move validation
- AI opponent with multiple difficulty levels
- Real-time chat interface with the AI
- Move suggestions and game analysis
- Sound effects for moves, captures, and game events
- Responsive design with dark/light mode support

## Technologies Used

- React 18
- TypeScript
- Chakra UI
- Chess.js
- Zustand for state management
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mfarsx/zeke-chess-agent.git
cd zeke-chess-agent
```

2. Switch to development branch:

```bash
git checkout dev
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Game Features

- **Multiple Difficulty Levels**: Choose between beginner, intermediate, and advanced AI opponents
- **Interactive Chat**: Ask for move suggestions, game analysis, and strategic advice
- **Visual Move Hints**: See possible moves for selected pieces
- **Game Analysis**: Get real-time evaluation of the position
- **Sound Effects**: Auditory feedback for moves, captures, and special events

## Development

### Branch Structure

- `main` - Production branch, contains stable releases
- `dev` - Development branch, contains latest features and fixes
- `feature/*` - Feature branches for new functionality
- `bugfix/*` - Bug fix branches
- `release/*` - Release preparation branches

### Development Workflow

1. Create a new branch from `dev` for your feature or fix:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git add .
git commit -m "Description of your changes"
```

3. Push your branch and create a Pull Request:

```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub from your branch to `dev`

### Code Style

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update tests when modifying features

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch from `dev`
3. Make your changes
4. Submit a Pull Request to the `dev` branch

Please make sure to:

- Update tests as needed
- Update documentation
- Follow the existing code style
- Add descriptive commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
