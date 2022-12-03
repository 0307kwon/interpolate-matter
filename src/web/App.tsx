import GameMatterContext from "@/package/Renderer/GameMatterContext";
import CharacterBody from "@/web/component/CharacterBody";
import MyGameFactory from "@/web/Model/MyGameFactory";
import { MATTER_TYPE } from "@/web/type";
import classes from "./App.module.less";

const App = () => {
  return (
    <div className={classes.root}>
      <div className={classes.game}>
        <GameMatterContext
          options={{
            canvasElementId: "canvas",
            fps: 60,
            resolution: {
              width: 1280,
              height: 720,
            },
          }}
        >
          <CharacterBody
            gameBody={MyGameFactory.createBasicCharacterBody({
              matterType: MATTER_TYPE.myCharacter,
              gameId: "1",
            })}
          />
        </GameMatterContext>
      </div>
    </div>
  );
};

export default App;
