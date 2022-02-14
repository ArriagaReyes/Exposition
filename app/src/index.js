import '../style.css';

let canvas;
let ctx;
let maze;
let frameId;

const mouse = {
    x: 0,
    y: 0
}

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onload = () => {
    canvas = document.getElementById('root');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    maze = new Maze(ctx, canvas.width, canvas.height);
    maze.animate(0);
}

window.addEventListener('resize', () => {
    resizeCanvas();

    cancelAnimationFrame(frameId);
    maze = new Maze(ctx, canvas.width, canvas.height);
    maze.animate(0);
});

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visted = false;
        this.current = false;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        }
    }
}

class Maze {
    #ctx;
    #width;
    #height;
    #lastTime;
    #interval;
    #timer;
    #size;
    #spacing;
    #cols;
    #rows;
    #stack;
    #cells;

    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;

        this.#lastTime = 0;
        this.#interval = 1000/90;
        this.#timer = 0;

        this.#size = 16;
        this.#spacing = 8;
        this.#cols = Math.floor(
            (this.#width - this.#spacing) / (this.#size + this.#spacing));
        this.#rows = Math.floor(
            (this.#height - this.#spacing) / (this.#size + this.#spacing));

        this.#stack = [];
        this.#cells = [];

        for(let y = 0; y < this.#rows; y++) {
            for(let x = 0; x < this.#cols; x++) {
                this.#cells.push(new Cell(x, y));
            }
        }

        const start = (this.#rows - 1) * this.#cols;
        this.#cells[start].visted = true;
        this.#stack.push(this.#cells[start]);
    }

    #findIndex = (x, y) => {
        if(x < 0 || y < 0 || x > this.#cols - 1 || y > this.#rows - 1) {
            return -1;
        }

        return (y * this.#cols) + x;
    }

    #checkNeighbours = cell => {
        let neighbours = [];

        const top = this.#findIndex(cell.x, cell.y - 1);
        const right = this.#findIndex(cell.x + 1, cell.y)
        const bottom = this.#findIndex(cell.x, cell.y + 1);
        const left = this.#findIndex(cell.x - 1, cell.y);

        if(this.#cells[top] && !this.#cells[top].visted) {
            neighbours.push(this.#cells[top]);
        }
        if(this.#cells[right] && !this.#cells[right].visted) {
            neighbours.push(this.#cells[right]);
        }
        if(this.#cells[bottom] && !this.#cells[bottom].visted) {
            neighbours.push(this.#cells[bottom]);
        }
        if(this.#cells[left] && !this.#cells[left].visted) {
            neighbours.push(this.#cells[left]);
        }
    
        return neighbours;
    }

    #chooseNeighbour = neighbours => {
        const i = Math.floor(Math.random(0) * neighbours.length);

        return neighbours[i];
    }

    #removeWalls = (current, chosen) => {
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

    #draw() {
        for(let i in this.#cells) {
            this.#ctx.fillStyle =
                this.#cells[i].current ? '#f00' : '#000';

            const cell = this.#cells[i];
            const x = cell.x * this.#size + (cell.x + 1) * this.#spacing;
            const y = cell.y * this.#size + (cell.y + 1) * this.#spacing;

            const positionX = (cell.x * this.#size + (cell.x + 1) * this.#spacing) + this.#size / 2;
            const positionY = (cell.y * this.#size + (cell.y + 1) * this.#spacing) + this.#size / 2;
            const dx = mouse.x - positionX;
            const dy = mouse.y - positionY;
            const maxDistance = 1000000;
            const distance = dx * dx + dy * dy;
            const newSize = 4;
            let modifer = 0;

            //if(distance < maxDistance) modifer = newSize * (1 - (distance / maxDistance));

            if(cell.visted) {
                this.#ctx.fillRect(x - modifer, y - modifer, this.#size + modifer * 2, this.#size + modifer * 2)
                //this.#ctx.fillStyle = '#fff';
                if(!cell.walls.bottom) {
                    const direction = (cell.y + 1) * (this.#size + this.#spacing);
                    this.#ctx.fillRect(x - modifer, direction - modifer, this.#size + modifer * 2, this.#size + modifer * 2);
                }
                if(!cell.walls.right) {
                    const direction = (cell.x + 1) * (this.#size + this.#spacing);
                    this.#ctx.fillRect(direction - modifer, y - modifer, this.#size + modifer * 2, this.#size + modifer * 2);
                }
            }
        }
    }

    animate(timeStamp) {
        const deltaTime = timeStamp - this.#lastTime;
        this.#lastTime = timeStamp;

        if(this.#timer > this.#interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);

            if(this.#stack.length > 0) {
                //console.log('popping from stack');
                const current = this.#stack.pop();
                current.current = true;
                this.#draw();
                //console.log('neigbours?');
                const neighbours = this.#checkNeighbours(current);

                if(neighbours.length > 0) {
                    this.#stack.push(current);
                    //console.log('My man still got neighbours');

                    const chosen = this.#chooseNeighbour(neighbours);
                    //console.log('This mofo will do: ', chosen);

                    this.#removeWalls(current, chosen);
                    //console.log('Hello neighbour :)');

                    chosen.visted = true;
                    //console.log('Ive been to this dudes place');
                    this.#stack.push(chosen);
                    //console.log('pushing chosen cell to stack');
                    current.current = false;
                } else {
                    current.current = false;
                }
            } else {
                console.log('finished');
                this.#draw();
            }

            this.#timer = 0;
        } else {
            this.#timer += deltaTime;
        }

        frameId = requestAnimationFrame(this.animate.bind(this));
    }
}