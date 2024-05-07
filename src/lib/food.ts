import { Game, type GameObject, Vector } from "./game";
import { Snake } from "./snake";

export class Food implements GameObject {
    position: Vector;

    constructor(gridSize: Vector, game: Game) {
        // Create food in a position on the grid that is not occupied by something else
        let newGrid = JSON.parse(JSON.stringify(game.grid));

        game.grid.forEach((row, y) =>
            row.forEach((cell, x) => {
                if (cell == "green") {
                    newGrid[y][x] = "green";
                } else if (cell == "red") {
                    newGrid[y][x] = "red";
                }
            }),
        );

        let pos: Vector;
        do {
            pos = new Vector(
                Math.floor(Math.random() * gridSize.x),
                Math.floor(Math.random() * gridSize.y),
                "red",
            );
        } while (game.grid[pos.x][pos.y] != null);
        this.position = pos;
    }

    update(game: Game): Vector[] {
        return [this.position];
    }
}
