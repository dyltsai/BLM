# MVP Implementation Plan

## Day 1 (Core Framework)

### GameManager Core Setup

#### Initialize core variables:
- `score: int`
- `isGameOver: boolean`
- `monkey: Monkey`
- `vines: List<Vine>`
- `obstacles: List<Obstacle>`
- `time: double`

#### Implement core methods:
- `initializeGame()`
- `startGameLoop()`
- `updateGameLoop(deltaTime: float)`
- `checkGameOver()`
- `resetGame()`
- `updateScore(int)`

## Day 2

## Vine System (Core Mechanics)

#### Implement core variables:
- `anchorPoint: Point`
- `length: int`
- `swingSpeed: double`
- `currentAngle: double`
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
- `swingSpeed: double`
- `maxJumpHeight: double`
- `jumpInProgress: boolean`

#### Essential methods:
- `jump()`
- `resetJump()`
- `landOnVine(vine: Vine, grabHeight: float)`

---

## Day 5 (Enhancement & Testing)

- Implement any P1 features if time permits.
- Thorough testing of core mechanics:
  - Vine swinging physics
  - Monkey jumping mechanics
  - Game loop stability
  - Score tracking

- Bug fixes and performance optimization.
- Final testing and refinement.
