import { Game, type GameObject, Vector } from "./game";

export class Snake implements GameObject {
    position: Vector;
    velocity: Vector = new Vector(1, 0);
    color: string = "green";
    gridSize: Vector;

    length: number = 3;
    tail: Vector[] = [];

    onDeath?: () => void;
    onEat?: (pos: Vector) => void;

    constructor(
        gridSize: Vector,
        onDeath?: () => void,
        onEat?: (pos: Vector) => void,
    ) {
        this.gridSize = gridSize;
        this.onDeath = onDeath;
        this.onEat = onEat;

        this.position = new Vector(
            Math.floor(gridSize.x / 2),
            Math.floor(gridSize.y / 2),
        );
    }

    onKeyPress(key: string) {
        switch (key) {
            case "w":
                this.velocity = new Vector(0, -1);
                break;
            case "s":
                this.velocity = new Vector(0, 1);
                break;
            case "a":
                this.velocity = new Vector(-1, 0);
                break;
            case "d":
                this.velocity = new Vector(1, 0);
                break;
        }
    }

    update(game: Game): Vector[] {
        let tailLength = this.length - 1;
        this.tail.push(this.position.clone());

        while (this.tail.length > tailLength) {
            this.tail.shift();
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Check if out of bounds
        if (
            Game.isOutOfBounds(this.position, game.gridSize) ||
            this.tail.some((t) => t.equals(this.position))
        ) {
            this.onDeath?.();
        }

        // Check if food
        if (game.grid[this.position.x]?.[this.position.y]) {
            this.length++;

            this.onEat?.(this.position);
        }

        return [this.position, ...this.tail];
    }
}
