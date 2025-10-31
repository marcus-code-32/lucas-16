const canvas = document.getElementById("cityCanvas");
const ctx = canvas.getContext("2d");
const toolSelect = document.getElementById("toolSelect");
const clearBtn = document.getElementById("clearBtn");
const randomBtn = document.getElementById("randomBtn");
const saveBtn = document.getElementById("saveBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const nightModeBtn = document.getElementById("nightModeBtn");
const statsBtn = document.getElementById("statsBtn");
const statsPopup = document.getElementById("statsPopup");
const closeStats = document.getElementById("closeStats");

const gridSize = 20;
let tileSize = 32;
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill("empty"));
let money = 1000, energy = 100, population = 0, happiness = 50;
let night = false;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = grid[y][x];
      ctx.fillStyle =
        tile === "road" ? "#555" :
        tile === "house" ? "#f2a365" :
        tile === "factory" ? "#6c757d" :
        tile === "park" ? "#51cf66" : "#a0c4ff";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
    }
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tileSize);
  const y = Math.floor((e.clientY - rect.top) / tileSize);
  const tool = toolSelect.value;
  grid[y][x] = tool === "erase" ? "empty" : tool;
  drawGrid();
});

clearBtn.onclick = () => {
  grid = Array(gridSize).fill().map(() => Array(gridSize).fill("empty"));
  drawGrid();
};

randomBtn.onclick = () => {
  const types = ["road", "house", "factory", "park"];
  for (let y = 0; y < gridSize; y++)
    for (let x = 0; x < gridSize; x++)
      grid[y][x] = Math.random() < 0.2 ? types[Math.floor(Math.random() * 4)] : "empty";
  drawGrid();
};

saveBtn.onclick = () => {
  localStorage.setItem("cityData", JSON.stringify(grid));
  alert("City saved successfully! 💾");
};

zoomInBtn.onclick = () => {
  tileSize = Math.min(tileSize + 4, 64);
  drawGrid();
};

zoomOutBtn.onclick = () => {
  tileSize = Math.max(tileSize - 4, 16);
  drawGrid();
};

nightModeBtn.onclick = () => {
  night = !night;
  document.body.classList.toggle("night", night);
};

statsBtn.onclick = () => {
  const flat = grid.flat();
  document.getElementById("totalBuildings").textContent = flat.filter(t => t !== "empty").length;
  document.getElementById("roadCount").textContent = flat.filter(t => t === "road").length;
  document.getElementById("factoryCount").textContent = flat.filter(t => t === "factory").length;
  document.getElementById("parkCount").textContent = flat.filter(t => t === "park").length;
  statsPopup.classList.add("show");
};
closeStats.onclick = () => statsPopup.classList.remove("show");

drawGrid();
setInterval(() => {
  population = grid.flat().filter(t => t === "house").length * 5;
  happiness = 50 + grid.flat().filter(t => t === "park").length;
  energy = 100 - grid.flat().filter(t => t === "factory").length * 5;
  money += grid.flat().filter(t => t === "factory").length * 10;
  document.getElementById("population").textContent = population;
  document.getElementById("happiness").textContent = happiness;
  document.getElementById("energy").textContent = energy;
  document.getElementById("money").textContent = money;
}, 1000);
