# MVP Implementation Plan

## Day 1 (Core Framework)

### GameManager Core Setup

#### Initialize core variables:
- `score: int`
- `isGameOver: boolean`
- `monkey: Monkey` Done
- `vines: List<Vine>` Done
- `obstacles: List<Obstacle>`
- `time: double`

#### Implement core methods:
- `initializeGame()`
- `startGameLoop()`
- `updateGameLoop(deltaTime: float)`
- `checkGameOver()`
- `resetGame()`
- `updateScore(int)` - done 

## Day 2

## Vine System (Core Mechanics)

#### Implement core variables:
- `anchorPoint: Point`
- `length: int`
- `swingSpeed: double` Done
- `currentAngle: double` Done
- `grabHeight: double`

#### Implement essential methods:
- `swing(timeStep: number)`
- `getMonkeyPosition()`
- `resetSwing()`

---

## Day 3-4 (Essential Features)

### Monkey Implementation

#### Core variables:
- `position: Point`
- `grabHeight: double`
- `swingSpeed: double` Done
- `maxJumpHeight: double`
- `jumpInProgress: boolean` Done

#### Essential methods:
- `jump()` Done
- `resetJump()`
- `landOnVine(vine: Vine, grabHeight: float)` Done

---

## Day 5 (Enhancement & Testing)

- Implement any P1 features if time permits.
- Thorough testing of core mechanics:
  - Vine swinging physics 
  - Monkey jumping mechanics <!-- fixed-->
  - Game loop stability
  - Score tracking <!-- works -->

- Bug fixes and performance optimization.
- Final testing and refinement.
