import { useRef } from 'react'
import type { PointerEvent } from 'react'

const ACTIVE_NOTE_Z_INDEX = 99999
const MIN_NOTE_SIZE = 100

type GestureMode = 'drag' | 'resize'

type GestureState = {
  pointerId: number
  mode: GestureMode
  startPointerX: number
  startPointerY: number
  startX: number
  startY: number
  startWidth: number
  startHeight: number
  startZIndex: number
}

type NoteGeometry = {
  positionX: number
  positionY: number
  width: number
  height: number
}

type UseNoteInteractionsOptions = NoteGeometry & {
  zIndex: number
  onCommit: (patch: NoteGeometry) => void
  onRemove: () => void
}

function syncTrashOverlap(note: HTMLElement) {
  const trash = document.querySelector('[data-trash]')
  if (!(trash instanceof HTMLElement)) {
    return false
  }

  const noteRect = note.getBoundingClientRect()
  const trashRect = trash.getBoundingClientRect()
  const isOver =
    noteRect.right >= trashRect.left &&
    noteRect.left <= trashRect.right &&
    noteRect.bottom >= trashRect.top &&
    noteRect.top <= trashRect.bottom

  trash.toggleAttribute('data-hot', isOver)
  return isOver
}

function clearTrashHot() {
  const trash = document.querySelector('[data-trash]')
  if (trash instanceof HTMLElement) {
    trash.removeAttribute('data-hot')
  }
}

export function useNoteInteractions({
  positionX,
  positionY,
  width,
  height,
  zIndex,
  onCommit,
  onRemove,
}: UseNoteInteractionsOptions) {
  const gestureRef = useRef<GestureState | null>(null)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    if (event.target instanceof HTMLTextAreaElement) {
      return
    }

    const mode: GestureMode =
      event.target instanceof HTMLElement && event.target.dataset.resize !== undefined
        ? 'resize'
        : 'drag'

    gestureRef.current = {
      pointerId: event.pointerId,
      mode,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: positionX,
      startY: positionY,
      startWidth: width,
      startHeight: height,
      startZIndex: zIndex,
    }

    event.currentTarget.style.zIndex = String(ACTIVE_NOTE_Z_INDEX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - gesture.startPointerX
    const deltaY = event.clientY - gesture.startPointerY
    const note = event.currentTarget

    if (gesture.mode === 'drag') {
      note.style.left = `${gesture.startX + deltaX}px`
      note.style.top = `${gesture.startY + deltaY}px`
      syncTrashOverlap(note)
      return
    }

    note.style.width = `${Math.max(MIN_NOTE_SIZE, gesture.startWidth + deltaX)}px`
    note.style.height = `${Math.max(MIN_NOTE_SIZE, gesture.startHeight + deltaY)}px`
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - gesture.startPointerX
    const deltaY = event.clientY - gesture.startPointerY
    const note = event.currentTarget
    const shouldRemove = gesture.mode === 'drag' && syncTrashOverlap(note)

    gestureRef.current = null
    clearTrashHot()

    if (note.hasPointerCapture(event.pointerId)) {
      note.releasePointerCapture(event.pointerId)
    }

    if (shouldRemove) {
      onRemove()
      return
    }

    if (gesture.mode === 'drag') {
      onCommit({
        positionX: gesture.startX + deltaX,
        positionY: gesture.startY + deltaY,
        width: gesture.startWidth,
        height: gesture.startHeight,
      })
      return
    }

    onCommit({
      positionX: gesture.startX,
      positionY: gesture.startY,
      width: Math.max(MIN_NOTE_SIZE, gesture.startWidth + deltaX),
      height: Math.max(MIN_NOTE_SIZE, gesture.startHeight + deltaY),
    })
  }

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) {
      return
    }

    const note = event.currentTarget
    note.style.left = `${gesture.startX}px`
    note.style.top = `${gesture.startY}px`
    note.style.width = `${gesture.startWidth}px`
    note.style.height = `${gesture.startHeight}px`
    note.style.zIndex = String(gesture.startZIndex)

    gestureRef.current = null
    clearTrashHot()

    if (note.hasPointerCapture(event.pointerId)) {
      note.releasePointerCapture(event.pointerId)
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  }
}
