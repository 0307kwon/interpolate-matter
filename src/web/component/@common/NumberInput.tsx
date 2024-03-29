import { ChangeEventHandler, useState } from 'react'

interface Props {
  value: number
  setValue: (value: number) => void
}

const NumberInput = ({ value, setValue }: Props) => {
  const [input, setInput] = useState(String(value))

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value

    if (value === '') {
      setInput(value)
      return
    }

    const number = +value

    if (isNaN(number)) {
      return
    }

    setValue(number)
    setInput(value)
  }

  return (
    <input
      value={input}
      onChange={onChange}
      onBlur={() => {
        setInput(String(value))
      }}
    />
  )
}

export default NumberInput
