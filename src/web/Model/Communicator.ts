type Callback<M> = (message: M) => void

const Communicator = <M extends unknown>() => {
  const callbacks: Callback<M>[] = []

  const receive = (callback: Callback<M>) => {
    callbacks.push(callback)
  }

  const send = (message: M) => {
    callbacks.forEach((c) => c(message))
  }

  return {
    send,
    receive
  }
}
export default Communicator
