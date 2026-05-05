import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { game_over, init_game, MOVE } from "./message.js";
export class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: init_game,
            color: "white",
        }));
        this.player2.send(JSON.stringify({
            type: init_game,
            color: "black",
        }));
    }
    ///type of move: {from: string, to: string, promotion?: string}
    makeMove(socket, move) {
        //validate the move
        if (this.board.moves().length === 0 && socket === this.player1) {
            return;
        }
        if (this.board.moves().length === 1 && socket === this.player2) {
            return;
        }
        try {
            const result = this.board.move(move);
        }
        catch (error) {
            console.error("Invalid move:", error);
        }
        //update the board and notify both players
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: game_over,
                result: this.board.isCheckmate() ? (socket === this.player1 ? "player2" : "player1") : "draw"
            }));
            this.player2.send(JSON.stringify({
                type: game_over,
                result: this.board.isCheckmate() ? (socket === this.player1 ? "player2" : "player1") : "draw"
            }));
            return;
        }
        this.player1.send(JSON.stringify({
            type: MOVE,
            move: move,
            board: this.board.fen()
        }));
        this.player2.send(JSON.stringify({
            type: MOVE,
            move: move,
            board: this.board.fen()
        }));
    }
}
//# sourceMappingURL=Game.js.map