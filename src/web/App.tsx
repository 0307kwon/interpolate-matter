import GameStore from '@/package/Model/GameStore'
import GameMatterContext from '@/package/Renderer/GameMatterContext'
import MyCharacterBody from '@/web/component/MyCharacterBody'
import { OtherCharacterBody } from '@/web/component/OtherCharacterBody'
import LatencyPanel from '@/web/component/panel/LatencyPanel'
import MaxFrameCountToNextPointPanel from '@/web/component/panel/MaxFrameCountToNextPointPanel'
import MinDestCountPanel from '@/web/component/panel/MinDestCountPanel'
import TransferIntervalPanel from '@/web/component/panel/TransferIntervalPanel'
import { SynchronizedCharacterBody } from '@/web/component/SynchronizedCharacterBody'
import WallBody from '@/web/component/WallBody'
import { RESOLUTION } from '@/web/config'
import Communicator from '@/web/Model/Communicator'
import MyGameFactory from '@/web/Model/MyGameFactory'
import {
  latencyState,
  maxFrameCountToNextDestState,
  minDestCountState,
  transferIntervalState
} from '@/web/recoil/atom'
import { Engine } from 'matter-js'
import { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
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
  const bodies = useRef({
    controlledBody: MyGameFactory.createMyCharacterBody('1'),
    synchronizedBody: MyGameFactory.createSynchronizedBody('1')
  })
  const latency = useRecoilValue(latencyState)
  const transferInterval = useRecoilValue(transferIntervalState)
  const minDestCount = useRecoilValue(minDestCountState)
  const maxFrameCountToNextPoint = useRecoilValue(maxFrameCountToNextDestState)

  useEffect(() => {
    const unloadEventCallback = () => {
      const simulatorState = {
        latency: latency.value,
        transferInterval: transferInterval.value,
        minDestCount: minDestCount.value,
        maxFrameCountToNextPoint: maxFrameCountToNextPoint.value
      }

      localStorage.setItem('simulatorState', JSON.stringify(simulatorState))
    }

    window.addEventListener('beforeunload', unloadEventCallback)

    return () => {
      window.removeEventListener('beforeunload', unloadEventCallback)
    }
  }, [latency, transferInterval, minDestCount, maxFrameCountToNextPoint])

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
            <MyCharacterBody gameBody={bodies.current.controlledBody} />
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
              gameBody={bodies.current.synchronizedBody}
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
          <MinDestCountPanel />
          <MaxFrameCountToNextPointPanel />
        </div>
      </div>
    </div>
  )
}

export default App
