import { Snake } from "./snake";
import { Food } from "./food";

export interface GameObject {
    position: Vector;

    update(game: Game): Vector[];

    onKeyPress?(key: string): void;
}

export class Vector {
    x: number;
    y: number;

    color: string;

    constructor(x: number, y: number, color: string = "green") {
        this.x = x;
        this.y = y;

        this.color = color;
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }

    equals(other: Vector): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

export class Game {
    ctx: CanvasRenderingContext2D;
    /** size of the canvas (x, y) */
    canvasSize: Vector;

    // How many cells wide and tall the grid should be
    gridSize: Vector = new Vector(20, 20);
    gameObjects: GameObject[] = [];

    // Grid is a 2D array of strings representing the color of each cell
    grid: (string | null)[][] = [];
    bgColor: string = "black";

    paused: boolean = true;

    constructor(canvas: HTMLCanvasElement, bgColor?: string) {
        const ctx = canvas.getContext("2d");

        if (ctx === null) throw new Error("Could not get 2d context");
        this.ctx = ctx;
        this.canvasSize = new Vector(canvas.width, canvas.height);

        if (bgColor) this.bgColor = bgColor;

        this.reset();
        this.gameLoop();
    }

    async gameLoop() {
        if (this.paused) return;

        this.tick();
        await new Promise((resolve) => setTimeout(resolve, 80));
        requestAnimationFrame(() => this.gameLoop());
    }

    reset() {
        this.grid = this.getClearGrid();
        this.gameObjects = [];

        const snake = new Snake(
            this.gridSize,
            () => this.reset(),
            (pos) => {
                const foundFoodIndex = this.gameObjects.findIndex(
                    (obj) => obj instanceof Food && obj.position.equals(pos),
                );

                if (foundFoodIndex === -1) return;

                this.gameObjects.splice(foundFoodIndex, 1);
                this.gameObjects.push(new Food(this.gridSize, this));
            },
        );

        this.gameObjects.push(snake);
        this.gameObjects.push(new Food(this.gridSize, this));

        this.draw();
    }

    getClearGrid(): (string | null)[][] {
        return Array.from({ length: this.gridSize.x }, () =>
            Array.from({ length: this.gridSize.y }, () => null),
        );
    }

    onKeyPress(key: string) {
        this.gameObjects.forEach((obj) => obj.onKeyPress?.(key));

        // Debug key for manual tick
        if (key === "t") {
            this.tick();
        } else if (key === "r") {
            this.reset();
        } else if (key === "q") {
            this.paused = !this.paused;
            this.gameLoop();
        }
    }

    tick() {
        const newGrid = this.getClearGrid();

        this.gameObjects.forEach((obj) => {
            const updatedPositions = obj.update(this);

            updatedPositions.forEach((pos) => {
                // Check if out of bounds
                if (pos.x < 0 || pos.x >= this.gridSize.x) return;
                if (pos.y < 0 || pos.y >= this.gridSize.y) return;

                newGrid[pos.x][pos.y] = pos.color;
            });
        });

        this.grid = newGrid;

        this.draw();
    }

    draw() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);

        this.ctx.fillStyle = "green";

        const cellWidth = this.canvasSize.x / this.gridSize.x;
        const cellHeight = this.canvasSize.y / this.gridSize.y;

        this.grid.forEach((row, x) => {
            row.forEach((cell, y) => {
                if (cell) {
                    this.ctx.fillStyle = cell;
                    this.ctx.fillRect(
                        x * cellWidth,
                        y * cellHeight,
                        cellWidth,
                        cellHeight,
                    );
                }
            });
        });
    }

    static isOutOfBounds(pos: Vector, gridSize: Vector): boolean {
        return (
            pos.x < 0 || pos.x >= gridSize.x || pos.y < 0 || pos.y >= gridSize.y
        );
    }
}
