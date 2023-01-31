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
    value: 17,
    sendingCount: 0
  }
})
