const map = (value, in_min, in_max, out_min, out_max) => ((value - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min;
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const circlesTouching = (x1, y1, r1, x2, y2, r2) => Math.abs(x1 - x2) > (r1 + r2) || Math.abs(y1 - y2) > (r1 + r2);
const checkPosition = (circles, x, y, r) => circles.every(circle => circlesTouching(x, y, r, circle.pos.x, circle.pos.y, circle.r));


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    invert() {
        this.x *= -1;
        this.y *= -1;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
}

class Circle {
    constructor(ctx, x, y, radius, color) {
        this.r = radius;
        this.color = color;
        this.ctx = ctx;
        this.attraction_strength = new Vector(randomNumber(1, 4), randomNumber(1, 4));
        this.pos = new Vector(x, y);
        this.gravity = new Vector(0, 0);
    }

    touchingCircle(circle) {
        return Math.abs(this.pos.x - circle.pos.x) < (this.r + circle.r) && Math.abs(this.pos.y - circle.pos.y) < (this.r + circle.r);
    }

    numOfNeighbours(circles, n_radius) {
        let i = 0;

        for(const circle of circles) {
            if(circle === this)
                continue;

            if(Math.abs(this.pos.x - circle.pos.x) < (this.r*2) + n_radius && Math.abs(this.pos.y - circle.pos.y) < (this.r*2) + n_radius)
                i++;
        }

        return i;
    }
    
    useGravity(circles) {
        let closest = circles[0];

        for(const circle of circles) {
            if(circle === this)
                continue;

            if((Math.abs(this.pos.x - circle.pos.x) + Math.abs(this.pos.y - circle.pos.y)) < (Math.abs(this.pos.x - closest.x) + Math.abs(this.pos.y - closest.y)))
                closest = circle;
        }

        if(this.touchingCircle(closest))
            this.gravity = new Vector(0, 0);
        else
            this.gravity.add(new Vector(Math.sign(closest.pos.x - this.pos.x), Math.sign(closest.pos.y - this.pos.y)));
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    
    update(circles) {
        this.useGravity(circles);
        this.render();

        if(this.x >= this.ctx.canvas.width - this.r || this.x < this.r)
            this.gravity.x *= -1;

        if(this.y >= this.ctx.canvas.height - this.r || this.y < this.r)
            this.gravity.y *= -1;

        this.pos.x += this.gravity.x * this.attraction_strength.x;
        this.pos.y += this.gravity.y * this.attraction_strength.y;
    }
}

function main() {
    const n = 800; //number of circles
    const r = 1; //radius of the circle
    const p = 100; //neighbourhood radius
    const c = 4; //neigbour number
    const circles = [];

    const canvas = document.querySelector('#display');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d'); //canvas context

    for(let i = 0; i < n;) {
        const x = randomNumber(r, ctx.canvas.width - r);
        const y = randomNumber(r, ctx.canvas.height - r);
    
        if(!checkPosition(circles, x, y, r)) //check if two circles are colliding
            continue;
        
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        circles.push(new Circle(ctx, x, y, r, color));
        i++;
    }

    // (() => {
    //     console.log(circles[0].numOfNeighbours(circles, p));
    //     ctx.beginPath();
    //     ctx.arc(circles[0].pos.x, circles[0].pos.y, circles[0].r + p, 0, Math.PI * 2, false);
    //     ctx.fillStyle = 'red';
    //     ctx.fill();
    // })();

    function loop() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); //clear screen

        circles.forEach(circle => {
            if(circle.numOfNeighbours(circles, p) > c)
                this.gravity = new Vector(circle.gravity.x > 0 ? circle.gravity.x*-1 : circle.gravity.x, circle.gravity.y > 0 ? circle.gravity.y*-1 : circle.gravity.y);

                circle.update(circles); //update all circles
        });
        requestAnimationFrame(loop);
    }
    
    requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', main);