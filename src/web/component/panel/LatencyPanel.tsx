import NumberInput from '@/web/component/@common/NumberInput'
import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { latencyState } from '@/web/recoil/atom'
import { useRecoilState } from 'recoil'

const LatencyPanel = () => {
  const [latency, setLatency] = useRecoilState(latencyState)

  return (
    <BasicPanel name={'Latency'}>
      <NumberInput
        value={latency.value}
        setValue={(value) => {
          setLatency({ value })
        }}
      />
      <span> ms</span>
    </BasicPanel>
  )
}

export default LatencyPanel
