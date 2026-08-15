import { memo } from 'react'
import styles from './index.module.scss'
import { useNoteInteractions } from '../../hooks/use-note-interactions'

export interface INoteState {
  positionX: number
  positionY: number
  width: number
  height: number
  zIndex: number
  text: string
}

function Note(props: INoteState) {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useNoteInteractions({
    x: props.positionX,
    y: props.positionY,
    onMove: (x: number, y: number) => {
      props.positionX = x
      props.positionY = y
    },
  })
  return (
    <div
      className={styles.note}
      style={{
        width: props.width,
        height: props.height,
        left: props.positionX,
        top: props.positionY,
        zIndex: props.zIndex,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <textarea
        className={styles.note_textarea}
        placeholder="Enter your note here"
        value={props.text}
      />
    </div>
  )
}

export default memo(Note)
