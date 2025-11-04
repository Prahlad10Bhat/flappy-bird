import { useEffect, useState } from "react";
import "./App.css";
import birdImg from "./assets/bird.png"; // <- put your bird image here

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 4;

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBirdPosition((pos) => pos + gravity);
    }, 30);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleJump = () => {
    if (!gameOver) setBirdPosition((pos) => pos - 60);
  };

  const handleRestart = () => {
    setBirdPosition(250);
    setGameOver(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-sky-400 overflow-hidden" onClick={handleJump}>
      <div className="text-white text-2xl absolute top-5 left-5">Score: 0</div>
      <img
        src={birdImg}
        alt="Bird"
        className="absolute w-10"
        style={{ top: birdPosition, left: "100px" }}
      />
      {gameOver && (
        <div className="absolute text-4xl text-white font-bold">Game Over!</div>
      )}
      <button
        onClick={handleRestart}
        className="absolute top-10 right-10 bg-white text-black px-4 py-1 rounded shadow"
      >
        Restart
      </button>
    </div>
  );
}

export default App;
