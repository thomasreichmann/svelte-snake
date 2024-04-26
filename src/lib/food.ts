import { Game, type GameObject, Vector } from "./game";

export class Food implements GameObject {
    position: Vector;

    constructor(gridSize: Vector, game: Game) {
        // Create food in a position on the grid that is not occupied by something else
        let pos: Vector;
        do {
            pos = new Vector(
                Math.floor(Math.random() * gridSize.x),
                Math.floor(Math.random() * gridSize.y),
                "red",
            );
        } while (game.grid[pos.y][pos.x] !== null);

        this.position = pos;
    }

    update(game: Game): Vector[] {
        return [this.position];
    }
}
