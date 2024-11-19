// Import Firebase (if using modules)
import firebase from 'firebase/app';
import 'firebase/firestore'; // For Firestore
import 'firebase/auth'; // For Authentication
// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAdjUwk8JpRKae8p3cxk70g4zLkTJqGGJ8",
    authDomain: "badlittlemonkey-6e0f4.firebaseapp.com",
    projectId: "badlittlemonkey-6e0f4",
    storageBucket: "badlittlemonkey-6e0f4.firebasestorage.app",
    messagingSenderId: "159530360843",
    appId: "1:159530360843:web:dbe70743a3db9b8a41e70e"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get references to Firestore and Auth
const db = firebase.firestore();
const auth = firebase.auth();
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.getAnalytics(app);

// Create the PixiJS application
const appPixi = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x87CEEB // Sky blue background
});

// Add the PixiJS view (canvas) to the document body
document.body.appendChild(appPixi.view);

// Load the monkey sprite (use your own image here)
PIXI.Loader.shared.add('monkey', './images/monkey.png').load(setup);

let monkey;
let isJumping = false;
let gravity = 0.5;
let jumpSpeed = -12;
let monkeySpeed = 0;

// Function to set up the scene
function setup() {
  // Create the monkey sprite and set its initial position
  monkey = new PIXI.Sprite(PIXI.Loader.shared.resources['monkey'].texture);
  monkey.anchor.set(0.5);
  monkey.x = appPixi.screen.width / 2;
  monkey.y = appPixi.screen.height - monkey.height / 2;
  appPixi.stage.addChild(monkey);

  // Listen for the spacebar to make the monkey jump
  window.addEventListener('keydown', onKeyDown);

  // Start the game loop
  appPixi.ticker.add(gameLoop);
}

// Function to handle key presses
function onKeyDown(e) {
  if (e.code === 'Space' && !isJumping) {
      isJumping = true;
      monkeySpeed = jumpSpeed; // Set the initial speed for the jump
  }
}

// Main game loop
function gameLoop() {
  if (isJumping) {
      monkey.y += monkeySpeed;
      monkeySpeed += gravity; // Apply gravity

      // Check if the monkey has landed
      if (monkey.y >= appPixi.screen.height - monkey.height / 2) {
          monkey.y = appPixi.screen.height - monkey.height / 2;
          isJumping = false;
          monkeySpeed = 0; // Stop the jump when landing
      }
  }
}
  class Point {
    constructor(x, y) {
      this.x = x;  // X coordinate
      this.y = y;  // Y coordinate
    }
  
    // Method to get the distance from this point to another point
    distanceTo(otherPoint) {
      const dx = this.x - otherPoint.x;
      const dy = this.y - otherPoint.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    // Method to display the point as a string
    toString() {
      return `(${this.x}, ${this.y})`;
    }
  
    // Optional: Method to move the point by a given amount
    move(dx, dy) {
      this.x += dx;
      this.y += dy;
    }
  }

  
  
