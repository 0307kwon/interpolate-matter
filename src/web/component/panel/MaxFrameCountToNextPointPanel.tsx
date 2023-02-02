import NumberInput from '@/web/component/@common/NumberInput'
import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { maxFrameCountToNextDestState } from '@/web/recoil/atom'
import { useRecoilState } from 'recoil'

const MaxFrameCountToNextPointPanel = () => {
  const [maxFrameCount, setMaxFrameCount] = useRecoilState(
    maxFrameCountToNextDestState
  )
  return (
    <BasicPanel name={'Frame count to next point'}>
      <NumberInput
        value={maxFrameCount.value}
        setValue={(value) => {
          setMaxFrameCount({
            value
          })
        }}
      />
    </BasicPanel>
  )
}

export default MaxFrameCountToNextPointPanel
