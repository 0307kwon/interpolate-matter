import GameMatterContext from "@/package/Renderer/GameMatterContext";
import MyGameFactory from "@/web/Model/GameFactory";
import classes from "./App.module.less";

const gameFactory = new MyGameFactory();

const App = () => {
  return (
    <div className={classes.root}>
      <div className={classes.game}>
        <GameMatterContext
          gameFactory={gameFactory}
          options={{
            canvasElementId: "canvas",
            fps: 60,
            resolution: {
              width: 1280,
              height: 720,
            },
          }}
        >
          <div></div>
        </GameMatterContext>
      </div>
    </div>
  );
};

export default App;
