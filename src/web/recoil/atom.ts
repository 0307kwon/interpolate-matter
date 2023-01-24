import { atom } from 'recoil'

export const latencyState = atom({
  key: 'latency',
  default: {
    value: 150
  }
})

export const transferIntervalState = atom({
  key: 'transferInterval',
  default: {
    value: 300,
    sendingCount: 0
  }
})
