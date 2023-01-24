import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { latencyState } from '@/web/recoil/atom'
import { ChangeEventHandler } from 'react'
import { useRecoilState } from 'recoil'

const LatencyPanel = () => {
  const [latency, setLatency] = useRecoilState(latencyState)

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value

    const number = +value

    if (isNaN(number)) {
      return
    }

    setLatency({
      ...latency,
      value: number
    })
  }

  return (
    <BasicPanel name={'Latency'}>
      <input
        value={latency.value === 0 ? '' : latency.value}
        onChange={onChange}
      />
    </BasicPanel>
  )
}

export default LatencyPanel
