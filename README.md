# Vine Simulator with Firebase

## Overview
This project is a simple game where a red square interacts with vines, and the square can move by jumping between vines. It was built using **PixiJS** for the graphical rendering and **Firebase** for backend services (e.g., hosting).

## How to Set Up Your Project

### Prerequisites
1. **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed.
2. **Firebase CLI**: Install the Firebase CLI if you haven’t already. You can do this by running:
   ```bash
   npm install -g firebase-tools
3. Firebase Project: You’ll need a Firebase account and project

4. Clone the repository by running: 
git clone <repository-url>
cd <project-folder>

5. Navigate to the project directory. Run **firebase init**
- during setup, choose hosting only
- choose public as the public directory
- Answer 'yes' about the single page app

6. deploy to firebase by running: **firebase deploy**