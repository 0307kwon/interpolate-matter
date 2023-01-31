import NumberInput from '@/web/component/@common/NumberInput'
import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { minPointState } from '@/web/recoil/atom'
import { useRecoilState } from 'recoil'

const MinPointPanel = () => {
  const [minPoint, setMinPoint] = useRecoilState(minPointState)

  return (
    <BasicPanel name={'Minimum point'}>
      <NumberInput
        value={minPoint.value}
        setValue={(value) => {
          setMinPoint({ value })
        }}
      />
    </BasicPanel>
  )
}

export default MinPointPanel
