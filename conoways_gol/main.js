class Cell {
    constructor(ctx, x, y, size) {
        this.ctx = ctx;
        this.x = x - (x%10);
        this.y = y - (y%10);
        
        this.size = size;
        this.color = '#ffffff';
        this.neighbours = 0;
        this.alive = true;
    }

    checkNeighbours() {
        this.neighbours = 0;

        const check = (x, y) => {
            const data = this.ctx.getImageData(x, y, 1, 1).data;
            const color = '#' + data[0].toString(16) + data[1].toString(16) + data[2].toString(16);
            this.neighbours += (color === this.color) ? 1 : 0;
        }

        for(let i = 1; i <= 8; i++) {
            check(this.x + (this.size * i * -1) + (this.size/2), this.y + (this.size * i * -1) + (this.size/2));
            check(this.x + (this.size * i) + (this.size/2), this.y + (this.size * i) + (this.size/2));
            
            check(this.x + (this.size * i) + (this.size/2), this.y + (this.size * i * -1) + (this.size/2));
            check(this.x + (this.size * i * -1) + (this.size/2), this.y + (this.size * i) + (this.size/2));

            check(this.x + (this.size * i) + (this.size/2), this.y + (this.size/2));
            check(this.x + (this.size * i * -1) + (this.size/2), this.y + (this.size/2));
            
            check(this.x + (this.size/2), this.y + (this.size * i) + (this.size/2));
            check(this.x + (this.size/2), this.y + (this.size * i * -1) + (this.size/2));
        }

        //Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        //Any live cell with more than three live neighbours dies, as if by overpopulation.
        // 4. Any live cell with more than three live neighbours dies, as if by overpopulation.
        // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

        if(this.neighbours < 2 || this.neighbours > 3)
            this.alive = false;
        else if(this.neighbours === 3)
            this.alive = true;
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

}

const ctx = document.querySelector('#display').getContext('2d');
const cells = [];

const cell_size = 10;

function drawGrid(ctx) {
    for(let x = 0; x < ctx.canvas.width; x += cell_size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.strokeStyle = '#808080';
        ctx.stroke();
    }

    for(let y = 0; y < ctx.canvas.height; y += cell_size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.strokeStyle = '#808080';
        ctx.stroke();
    }
}

function main() { 
    for(let x = 0; x < ctx.canvas.width; x += cell_size) {
        for(let y = 0; y < ctx.canvas.height; y += cell_size) {
            const cell = new Cell(ctx, x, y, cell_size);
            cells.push(cell);

            cell.alive = !!Math.floor(Math.random() * 2);
        }
    }
}

function loop() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawGrid(ctx);

    for(const cell of cells) {
        if(cell.alive)
            cell.render();
        
        cell.checkNeighbours();
    }
}