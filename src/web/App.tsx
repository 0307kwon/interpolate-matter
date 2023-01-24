import GameStore from '@/package/Model/GameStore'
import GameMatterContext from '@/package/Renderer/GameMatterContext'
import MyCharacterBody from '@/web/component/MyCharacterBody'
import { OtherCharacterBody } from '@/web/component/OtherCharacterBody'
import LatencyPanel from '@/web/component/panel/LatencyPanel'
import TransferIntervalPanel from '@/web/component/panel/TransferIntervalPanel'
import { SynchronizedCharacterBody } from '@/web/component/SynchronizedCharacterBody'
import WallBody from '@/web/component/WallBody'
import { RESOLUTION } from '@/web/config'
import Communicator from '@/web/Model/Communicator'
import MyGameFactory from '@/web/Model/MyGameFactory'
import { Engine } from 'matter-js'
import classes from './App.module.less'

interface SyncUpMsg {
  position: {
    x: number
    y: number
  }
  angle?: number
}

export const communicators = {
  '1': Communicator<SyncUpMsg>()
}

const gameMatterStore1 = new GameStore({
  engine: Engine.create()
})

const gameMatterStore2 = new GameStore({
  engine: Engine.create()
})

const App = () => {
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1>Interpolation simulator</h1>
      </div>
      <div className={classes.game}>
        <div className={classes.gameMatterContext}>
          <p>origin</p>
          <GameMatterContext
            store={gameMatterStore1}
            options={{
              canvasElementId: 'canvas',
              fps: 60,
              resolution: RESOLUTION
            }}
          >
            <MyCharacterBody
              gameBody={MyGameFactory.createMyCharacterBody('1')}
            />
            <OtherCharacterBody gameBody={MyGameFactory.createOtherBody('2')} />
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
        <div className={classes.gameMatterContext}>
          <p>synchronized</p>
          <GameMatterContext
            store={gameMatterStore2}
            options={{
              canvasElementId: 'canvas2',
              fps: 60,
              resolution: RESOLUTION
            }}
          >
            <SynchronizedCharacterBody
              gameBody={MyGameFactory.createSynchronizedBody('1')}
            />
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
      <div className={classes.panel}>
        <h2>Panel</h2>
        <div>
          <LatencyPanel />
          <TransferIntervalPanel />
        </div>
      </div>
    </div>
  )
}

export default App
