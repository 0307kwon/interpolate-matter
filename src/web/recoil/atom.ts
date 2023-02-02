import { atom } from 'recoil'

interface SimulatorState {
  latency: number
  transferInterval: number
  minDestCount: number
  maxFrameCountToNextDestState: number
}

const simulatorState: SimulatorState = {
  latency: 0,
  transferInterval: 17,
  minDestCount: 2,
  maxFrameCountToNextDestState: 1,
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

export const minDestCountState = atom({
  key: 'minDestCount',
  default: {
    value: simulatorState.minDestCount
  }
})

export const maxFrameCountToNextDestState = atom({
  key: 'maxFrameCountToNextDest',
  default: {
    value: simulatorState.maxFrameCountToNextDestState
  }
})
