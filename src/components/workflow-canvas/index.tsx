import styles from './index.module.scss'
import Note from '../note'
import Trash from '../trash'
import Toolbar from '../toolbar'

export default function WorkflowCanvas() {
  return <div className={styles.grid}>
    <Toolbar />
    <Note positionX={100} positionY={100} width={300} height={300} zIndex={1} text="Hello, world!" />
    <Trash />
  </div>
}