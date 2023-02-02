import NumberInput from '@/web/component/@common/NumberInput'
import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { minDestCountState } from '@/web/recoil/atom'
import { useRecoilState } from 'recoil'

const MinDestCountPanel = () => {
  const [minDestCount, setMinDestCount] = useRecoilState(minDestCountState)

  return (
    <BasicPanel name={'Minimum destination count'}>
      <NumberInput
        value={minDestCount.value}
        setValue={(value) => {
          setMinDestCount({ value })
        }}
      />
    </BasicPanel>
  )
}

export default MinDestCountPanel
