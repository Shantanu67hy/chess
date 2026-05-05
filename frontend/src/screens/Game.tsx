import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

export const init_game = "init_game";
export const game_over = "game_over";
export const MOVE = "move";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);

  

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      switch (message.type) {
        case init_game:
          //setChess(new Chess());

          setBoard(chess.board());
          setStarted(true);
          break;

        case MOVE:
          const newChess = new Chess(message.board); // ✅ fresh instance
          setChess(newChess);
          setBoard(newChess.board());
          break;

        case game_over:
          console.log("Game over:", message.result);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    };
  }, [socket]);

  if (!socket) {
    return <div className="text-white">Connecting to server...</div>;
  }

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-5xl w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-4 bg-green-400 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
            />
          </div>
          <div className="col-span-2 bg-green-200 w-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-4 pt-2 pb-2">
              {!started && (
                <Button
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        type: init_game,
                      }),
                    );
                  }}
                >
                  Play
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
