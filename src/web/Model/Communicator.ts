type Callback<M> = (message: M) => void

const Communicator = <M extends unknown>() => {
  let callbacks: Callback<M>[] = []

  const receive = (callback: Callback<M>) => {
    callbacks.push(callback)
  }

  const resetReceiver = () => {
    callbacks = []
  }

  const send = (message: M) => {
    callbacks.forEach((c) => c(message))
  }

  return {
    send,
    receive,
    resetReceiver
  }
}
export default Communicator
