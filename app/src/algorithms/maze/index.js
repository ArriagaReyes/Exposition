import Cell from './cell';

const width = 1000;
const height = 450;
const size = 32;
const spacing = 8;
let cols, rows;
let stack = [];
let cells = [];

// helper functions
const findIndex = (x, y) => {
    if(x < 0 || y < 0 || x > cols - 1 || y > rows - 1) {
        return -1;
    }

    return (y * cols) + x;
}

const checkNeighbour = (cell) => {
    let neighbours = [];

    const top = findIndex(cell.x, cell.y - 1);
    const right = findIndex(cell.x + 1, cell.y);
    const bottom = findIndex(cell.x, cell.y + 1);
    const left = findIndex(cell.x - 1, cell.y);

    if(cells[top] && !cells[top].visted) {
        neighbours.push(cells[top]);
    }
    if(cells[right] && !cells[right].visted) {
        neighbours.push(cells[right]);
    }
    if(cells[bottom] && !cells[bottom].visted) {
        neighbours.push(cells[bottom]);
    }
    if(cells[left] && !cells[left].visted) {
        neighbours.push(cells[left]);
    }

    return neighbours;
}

const chooseNeighbour = (neighbours) => {
    const i = Math.floor(Math.random(0) * neighbours.length);
    return neighbours[i];
}

const removeWalls = (current, chosen) => {
    const x = current.x - chosen.x;
    if(x === -1) {
        current.walls.right = false;
        chosen.walls.left = false;
    } else if(x === 1) {
        current.walls.left = false;
        chosen.walls.right = false;
    }

    const y = current.y - chosen.y;
    if(y === -1) {
        current.walls.bottom = false;
        chosen.walls.top = false;
    } else if(y === 1) {
        current.walls.top = false;
        chosen.walls.bottom = false;
    }
}

// draw functions
const drawCell = (ctx, cell) => {
    if(cell.current) {
        console.log('current');
        ctx.fillStyle = '#f00';
    } else {
        ctx.fillStyle = '#000';
    }
    const x = cell.x * size + (cell.x + 1) * spacing;
    const y = cell.y * size + (cell.y + 1) * spacing;
    if(cell.visted) {
        ctx.fillRect(x, y, size, size);
        drawWalls(ctx, cell);
    }
}

const drawWalls = (ctx, cell) => {
    const x = cell.x * size + (cell.x + 1) * spacing;
    const y = cell.y * size + (cell.y + 1) * spacing;
    const distance = size + spacing;

    if(!cell.walls.bottom) {
        ctx.fillStyle = '#000';
        const direction = (cell.y + 1) * distance;
        ctx.fillRect(x, direction, size, size);
    }
    if(!cell.walls.right) {
        ctx.fillStyle = '#000';
        const direction = (cell.x + 1) * distance;
        ctx.fillRect(direction, y, size, size);
    }
    /*if(!cell.walls.top) {
        const direction = (cell.y - 1) * distance;
        ctx.fillRect(x, direction, size, size);
    }
    /*if(!cell.walls.left) {
        ctx.fillRect((x - 1) * (size + spacing), y, size, size);
    }*/
}

const highlightCell = (ctx, cell) => {
    console.log('highlighting cell');
    ctx.fillStyle = '#f00';
    const x = cell.x * size + (cell.x + 1) * spacing;
    const y = cell.y * size + (cell.y + 1) * spacing;
    ctx.fillRect(x, y, size, size);
}

const setup = () => {
    console.log('setting up');
    cols = Math.floor((width - spacing) / (size + spacing));
    rows = Math.floor((height - spacing) / (size + spacing));

    for (let y = 0; y < rows; y++) {
        for(let x = 0; x < cols; x++) {
            cells.push(new Cell(x, y));
        }
    }

    const start = (rows - 1) * cols;
    cells[start].visted = true;
    stack.push(cells[start]);
}

const generate = (ctx, frameCount) => {
    if(stack.length > 0 && frameCount % 30 == 0) {
        // step 1
        const current = stack.pop();
        highlightCell(ctx, current);
        const neighbours = checkNeighbour(current);
    
        // step 2
        if(neighbours.length > 0) {
            // step 2.1
            stack.push(current);
    
            // step 2.2
            const chosen = chooseNeighbour(neighbours);
    
            // step 2.3
            removeWalls(current, chosen);
    
            // step 2.4
            chosen.visted = true;
            stack.push(chosen);
        }
    }
}

const draw = (ctx, frameCount, { play }) => {
    for(let i in cells) {
        drawCell(ctx, cells[i]);
    }

    if(play) {
        generate(ctx, frameCount);
    }
}

export { draw, setup, width, height }