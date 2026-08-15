import styles from './index.module.scss'
import Note from '../note'
import Trash from '../trash'
import Toolbar from '../toolbar'
import { useNotesState } from '../../hooks/use-notes'

export default function WorkflowCanvas() {
  const notes = useNotesState()

  return (
    <div className={styles.grid}>
      <Toolbar />
      {notes.map((note) => (
        <Note key={note.id} {...note} />
      ))}
      <Trash />
    </div>
  )
}
