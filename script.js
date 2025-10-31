const canvas = document.getElementById('cityCanvas');
const ctx = canvas.getContext('2d');
const size = 16;
const cellPx = canvas.width / size;

// Tile types
const TILE = { empty: 0, road: 1, house: 2, factory: 3, park: 4 };

// Grid & stats
const grid = Array(size).fill(0).map(() => Array(size).fill(TILE.empty));
let money = 1000, energy = 100, population = 0, happiness = 50;

// Elements
const moneyEl = document.getElementById('money');
const energyEl = document.getElementById('energy');
const popEl = document.getElementById('population');
const happyEl = document.getElementById('happiness');
const toolSelect = document.getElementById('toolSelect');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');

// Draw grid
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = grid[y][x];
      switch (t) {
        case TILE.empty: ctx.fillStyle = '#071827'; break;
        case TILE.road: ctx.fillStyle = '#6b6b6b'; break;
        case TILE.house: ctx.fillStyle = '#ffdb9a'; break;
        case TILE.factory: ctx.fillStyle = '#bfecc5'; break;
        case TILE.park: ctx.fillStyle = '#86e08a'; break;
      }
      ctx.fillRect(x * cellPx + 1, y * cellPx + 1, cellPx - 2, cellPx - 2);
    }
  }
}

// Place tile
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellPx);
  const y = Math.floor((e.clientY - rect.top) / cellPx);
  const tool = toolSelect.value;

  if (tool === 'erase') grid[y][x] = TILE.empty;
  else grid[y][x] = TILE[tool];

  draw();
});

// Clear
clearBtn.addEventListener('click', () => {
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      grid[y][x] = TILE.empty;
  draw();
});

// Random city
randomBtn.addEventListener('click', () => {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.random();
      if (r < 0.05) grid[y][x] = TILE.factory;
      else if (r < 0.2) grid[y][x] = TILE.house;
      else if (r < 0.25) grid[y][x] = TILE.park;
      else if (r < 0.35) grid[y][x] = TILE.road;
      else grid[y][x] = TILE.empty;
    }
  }
  draw();
});

// Simulation loop
setInterval(() => {
  const houses = grid.flat().filter(t => t === TILE.house).length;
  const factories = grid.flat().filter(t => t === TILE.factory).length;
  const parks = grid.flat().filter(t => t === TILE.park).length;

  population = houses * 5;
  money += factories * 2 - parks;
  energy -= factories * 0.5;
  happiness = 50 + (parks - factories) * 2;

  moneyEl.textContent = Math.floor(money);
  energyEl.textContent = Math.floor(energy);
  popEl.textContent = population;
  happyEl.textContent = Math.max(0, Math.min(100, Math.floor(happiness)));
}, 1000);

draw();
