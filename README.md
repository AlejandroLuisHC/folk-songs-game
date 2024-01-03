# Song Guessing Game

This project is a web-based song guessing game where users can listen to song previews and guess the name of the song and the band.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- Dynamic song selection from a Spotify playlist.
- Progressive difficulty levels.
- Real-time feedback on correct and incorrect guesses.
- Play/pause functionality for song previews.
- Interactive user interface.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v. 18)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AlejandroLuisHC/folk-songs-game.git
```

2. Change into the project directory:

3. Install dependencies:

```bash
pnpm install
```

## Usage

1. Obtain Spotify API credentials (client ID and client secret) and update the .env file.

2. Run the development server:
```bash
pnpm dev
```

3. Open your browser and navigate to `http://localhost:5173` to play the game.

## Technologies Used

- [React](https://react.dev/)
- [React Query](https://tanstack.com/query/v3/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Vite](https://vitejs.dev/)

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## License

This project is licensed under the MIT License.
