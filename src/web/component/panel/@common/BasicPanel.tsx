import { ReactNode } from 'react'
import classes from './BasicPanel.module.less'

interface Props {
  name: string
  children: ReactNode
}

const BasicPanel = ({ name, children }: Props) => {
  return (
    <div className={classes.root}>
      <span>{name}</span>
      <div className={classes.inner}>{children}</div>
    </div>
  )
}

export default BasicPanel
