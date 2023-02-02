import { atom } from 'recoil'

interface SimulatorState {
  latency: number
  transferInterval: number
  minPoint: number
  maxFrameCountToNextPoint: number
}

const simulatorState: SimulatorState = {
  latency: 0,
  transferInterval: 17,
  minPoint: 2,
  maxFrameCountToNextPoint: 1,
  ...JSON.parse(localStorage.getItem('simulatorState') || '{}')
}

export const latencyState = atom({
  key: 'latency',
  default: {
    value: simulatorState.latency
  }
})

export const transferIntervalState = atom({
  key: 'transferInterval',
  default: {
    value: simulatorState.transferInterval,
    sendingCount: 0
  }
})

export const minPointState = atom({
  key: 'minPoint',
  default: {
    value: simulatorState.minPoint
  }
})

export const maxFrameCountToNextPointState = atom({
  key: 'maxFrameCountToNextPoint',
  default: {
    value: simulatorState.maxFrameCountToNextPoint
  }
})
