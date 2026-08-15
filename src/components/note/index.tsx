import { memo } from 'react'
import styles from './index.module.scss'
import { useNoteInteractions } from '../../hooks/use-note-interactions'
import { useDebouncedCallback } from '../../hooks/use-local-storage'
import { useNotesDispatch } from '../../hooks/use-notes'

export interface INoteState {
  id: string
  positionX: number
  positionY: number
  width: number
  height: number
  zIndex: number
  text: string
}

function Note(props: INoteState) {
  const dispatch = useNotesDispatch()
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useNoteInteractions({
    positionX: props.positionX,
    positionY: props.positionY,
    width: props.width,
    height: props.height,
    zIndex: props.zIndex,
    onCommit: (patch) => {
      dispatch({ type: 'commit', id: props.id, patch })
    },
    onRemove: () => {
      dispatch({ type: 'remove', id: props.id })
    },
  })

  const commitText = useDebouncedCallback((text: string) => {
    dispatch({ type: 'updateText', id: props.id, text })
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
        defaultValue={props.text}
        onPointerDown={(event) => {
          event.stopPropagation()
          dispatch({ type: 'bringToFront', id: props.id })
        }}
        onChange={(event) => commitText(event.target.value)}
      />
      <div className={styles.note_resize} data-resize />
    </div>
  )
}

export default memo(Note)
