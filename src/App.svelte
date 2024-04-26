<script lang="ts">
    import { onMount } from 'svelte';
    import {Game} from "./lib/game";
    let canvas: HTMLCanvasElement;
    let game: Game;

    function resizeCanvas() {
        canvas.width = 600;
        canvas.height = 600;
    }

    onMount(() => {
        resizeCanvas();
        game = new Game(canvas);

        window.addEventListener("keypress", (e) => {
            game.onKeyPress(e.key)
        });
    });
</script>

<main>
    <h1>jogo da 🐍</h1>
    <div class="frame">
        <canvas bind:this={canvas} />
    </div>

    <div class="tutorial frame">
        <p>
            Use as 'w' 'a' 's' 'd' para controlar a cobra.
        </p>
        <p>
            Aperte 'q' para iniciar/pausar.
        </p>
    </div>
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

    :global(body) {
        margin: 0;
        padding: 0;
    }

    .tutorial {
        position: fixed;
        left: 0;
        top: 0;

        display: flex;
        flex-direction: column;
        gap: 6px;

        margin: 20px;
    }

    .tutorial p {
        margin: 0;
    }

    h1 {
        margin-bottom: 25px;
    }

    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;

        justify-content: center;
        align-items: center;

        background-color: #121212;

        color: #fff;
        font-family: "Roboto", sans-serif;
    }

    canvas {
        width: 600px;
        height: 600px;
    }

    .frame {
        padding: 25px;
        background-color: #1f1f1f;

        border-radius: 25px;
    }
</style>