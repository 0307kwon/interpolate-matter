import GameStore from '@/package/Model/GameStore'
import GameMatterContext from '@/package/Renderer/GameMatterContext'
import CharacterBody from '@/web/component/CharacterBody'
import WallBody from '@/web/component/WallBody'
import { RESOLUTION } from '@/web/config'
import MyGameFactory from '@/web/Model/MyGameFactory'
import { Engine } from 'matter-js'
import classes from './App.module.less'

const gameMatterStore1 = new GameStore({
  engine: Engine.create()
})

const gameMatterStore2 = new GameStore({
  engine: Engine.create()
})

const App = () => {
  return (
    <div className={classes.root}>
      <div className={classes.game}>
        <GameMatterContext
          store={gameMatterStore1}
          options={{
            canvasElementId: 'canvas',
            fps: 60,
            resolution: RESOLUTION
          }}
        >
          <CharacterBody gameBody={MyGameFactory.createMyCharacterBody('1')} />
          <WallBody
            gameBody={MyGameFactory.createWall({
              width: RESOLUTION.width,
              thickness: 20,
              x: RESOLUTION.width / 2,
              y: RESOLUTION.height - 20
            })}
          />
          <WallBody
            gameBody={MyGameFactory.createWall({
              width: RESOLUTION.height,
              thickness: 20,
              x: 10,
              y: RESOLUTION.height / 2,
              angle: 90
            })}
            transparent={true}
          />
          <WallBody
            gameBody={MyGameFactory.createWall({
              width: RESOLUTION.height,
              thickness: 20,
              x: RESOLUTION.width - 10,
              y: RESOLUTION.height / 2,
              angle: 90
            })}
            transparent={true}
          />
        </GameMatterContext>
        <GameMatterContext
          store={gameMatterStore2}
          options={{
            canvasElementId: 'canvas2',
            fps: 60,
            resolution: RESOLUTION
          }}
        >
          <CharacterBody gameBody={MyGameFactory.createMyCharacterBody('1')} />
          <WallBody
            gameBody={MyGameFactory.createWall({
              width: RESOLUTION.width,
              thickness: 20,
              x: RESOLUTION.width / 2,
              y: RESOLUTION.height - 20
            })}
          />
          <WallBody
            gameBody={MyGameFactory.createWall({
              width: RESOLUTION.height,
              thickness: 20,
              x: 10,
              y: RESOLUTION.height / 2,
              angle: 90
            })}
            transparent={true}
          />
          <WallBody
            gameBody={MyGameFactory.createWall({
              width: RESOLUTION.height,
              thickness: 20,
              x: RESOLUTION.width - 10,
              y: RESOLUTION.height / 2,
              angle: 90
            })}
            transparent={true}
          />
        </GameMatterContext>
      </div>
    </div>
  )
}

export default App
