import NumberInput from '@/web/component/@common/NumberInput'
import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { transferIntervalState } from '@/web/recoil/atom'
import { useRecoilState } from 'recoil'

const TransferIntervalPanel = () => {
  const [transferInterval, setTransferInterval] = useRecoilState(
    transferIntervalState
  )

  return (
    <BasicPanel name={'Transfer interval'}>
      <NumberInput
        value={transferInterval.value}
        setValue={(value) => {
          setTransferInterval((prev) => ({
            ...prev,
            value
          }))
        }}
      />
      <span> ms</span>
      <div>
        <span> count : </span>
        {transferInterval.sendingCount}
      </div>
    </BasicPanel>
  )
}

export default TransferIntervalPanel
