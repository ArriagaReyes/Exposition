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

export default Cell;