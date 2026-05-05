import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ board,socket,setBoard,chess 
}: {
    setBoard: any;
    chess: any;

  board: ({
    color: Color;
    type: PieceSymbol;
    square: Square;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom ] = useState<Square | null>(null);
  const [to, setTo ] = useState<Square | null>(null);



  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = String.fromCharCode(97 + (j % 8)) + ""+ (8 - Math.floor(i  + j / 8)) as Square;

              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } 
                    else {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            from: from,
                            to: squareRepresentation
                          }
                        })
                      )
                      setFrom(null)
                      
                      chess.move({
                        from: from, to: squareRepresentation
                      }); 
                      setBoard(chess.board());  

                      console.log({
                        from: from,
                        to: squareRepresentation
                      })
                    }
                  }}
                >
                  <div
                    key={j}
                    className={`w-16 h-16 flex items-center justify-center ${(i + j) % 2 === 0 ? "bg-white" : "bg-green-500"}`}
                  >
                    <div className=" justify-center flex items-center">
                      <div className=" text-2xl font-bold w-8 h-8 flex items-center justify-center">
                        {square ? (
                          <span>
                            {square.type === "p" && "♟"}
                            {square.type === "r" && "♜"}
                            {square.type === "n" && "♞"}
                            {square.type === "b" && "♝"}
                            {square.type === "q" && "♛"}
                            {square.type === "k" && "♚"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
