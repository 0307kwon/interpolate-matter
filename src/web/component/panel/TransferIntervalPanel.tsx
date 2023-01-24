import BasicPanel from '@/web/component/panel/@common/BasicPanel'
import { transferIntervalState } from '@/web/recoil/atom'
import { ChangeEventHandler } from 'react'
import { useRecoilState } from 'recoil'

const TransferIntervalPanel = () => {
  const [transferInterval, setTransferInterval] = useRecoilState(
    transferIntervalState
  )

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value

    const number = +value

    if (isNaN(number)) {
      return
    }

    setTransferInterval({
      ...transferInterval,
      value: number
    })
  }

  return (
    <BasicPanel name={'Transfer interval'}>
      <input
        value={transferInterval.value === 0 ? '' : transferInterval.value}
        onChange={onChange}
      />
      <div>
        <span>count : </span>
        {transferInterval.sendingCount}
      </div>
    </BasicPanel>
  )
}

export default TransferIntervalPanel
