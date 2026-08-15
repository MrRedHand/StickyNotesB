import { useState } from 'react'
import styles from './index.module.scss'
import { useNotesDispatch, useNotesState } from '../../hooks/use-notes'

const DEFAULT_NOTE_SIZE = 200

export default function Toolbar() {
  const dispatch = useNotesDispatch()
  const notes = useNotesState()
  const [width, setWidth] = useState(DEFAULT_NOTE_SIZE)
  const [height, setHeight] = useState(DEFAULT_NOTE_SIZE)

  const handleAddNote = () => {
    const nextWidth = width > 0 ? width : DEFAULT_NOTE_SIZE
    const nextHeight = height > 0 ? height : DEFAULT_NOTE_SIZE

    dispatch({
      type: 'add',
      note: {
        id: crypto.randomUUID(),
        width: nextWidth,
        height: nextHeight,
        positionX:
          Math.round(window.innerWidth / 2 - nextWidth / 2) +
          Math.random() * 100,
        positionY:
          Math.round(window.innerHeight / 2 - nextHeight / 2) +
          Math.random() * 100,
        text: '',
      },
    })
  }

  const handleDeleteAll = () => {
    dispatch({ type: 'deleteAll' })
  }

  return (
    <div className={styles.toolbar}>
      <input
        className={styles.toolbar_field}
        type="number"
        min={1}
        aria-label="Width"
        placeholder="Width"
        value={width}
        onChange={(event) => setWidth(Number(event.target.value))}
      />
      <input
        className={styles.toolbar_field}
        type="number"
        min={1}
        aria-label="Height"
        placeholder="Height"
        value={height}
        onChange={(event) => setHeight(Number(event.target.value))}
      />
      <button className="button" type="button" onClick={handleAddNote}>
        Add Note
      </button>
      <button className="button" type="button" onClick={handleDeleteAll}>
        Delete All
      </button>
      <span>{notes.length} Total notes</span>
    </div>
  )
}
