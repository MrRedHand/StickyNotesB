import { createContext, useContext, useReducer, type Dispatch } from 'react'
import type { INoteState } from '../components/note'
import { readLocalStorage, useLocalStorage } from './use-local-storage'

const NOTES_STORAGE_KEY = 'sticky-notes'

type NotesAction =
  | { type: 'add'; note: Omit<INoteState, 'zIndex'> }
  | { type: 'remove'; id: string }
  | {
      type: 'commit'
      id: string
      patch: Pick<INoteState, 'positionX' | 'positionY' | 'width' | 'height'>
    }
  | { type: 'updateText'; id: string; text: string }
  | { type: 'bringToFront'; id: string }
  | { type: 'deleteAll' }

export const NotesStateContext = createContext<INoteState[] | null>(null)
export const NotesDispatchContext = createContext<Dispatch<NotesAction> | null>(
  null,
)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNoteState(value: unknown): value is INoteState {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    isFiniteNumber(value.positionX) &&
    isFiniteNumber(value.positionY) &&
    isFiniteNumber(value.width) &&
    isFiniteNumber(value.height) &&
    isFiniteNumber(value.zIndex) &&
    typeof value.text === 'string'
  )
}

function isNotesState(value: unknown): value is INoteState[] {
  return Array.isArray(value) && value.every(isNoteState)
}

function nextZIndex(notes: INoteState[]) {
  return notes.reduce((max, note) => Math.max(max, note.zIndex), 0) + 1
}

function notesReducer(state: INoteState[], action: NotesAction): INoteState[] {
  switch (action.type) {
    case 'add':
      return [...state, { ...action.note, zIndex: nextZIndex(state) }]
    case 'deleteAll':
      return []
    case 'remove':
      return state.filter((note) => note.id !== action.id)
    case 'commit':
      return state.map((note) =>
        note.id === action.id
          ? { ...note, ...action.patch, zIndex: nextZIndex(state) }
          : note,
      )
    case 'updateText':
      return state.map((note) =>
        note.id === action.id ? { ...note, text: action.text } : note,
      )
    case 'bringToFront': {
      const zIndex = nextZIndex(state)
      if (
        state.some(
          (note) => note.id === action.id && note.zIndex === zIndex - 1,
        )
      ) {
        return state
      }

      return state.map((note) =>
        note.id === action.id ? { ...note, zIndex } : note,
      )
    }
  }
}

export function useNotesStore() {
  const [notes, dispatch] = useReducer(notesReducer, [], (fallback) =>
    readLocalStorage(NOTES_STORAGE_KEY, fallback, isNotesState),
  )

  useLocalStorage(NOTES_STORAGE_KEY, notes)

  return [notes, dispatch] as const
}

export function useNotesState() {
  const notes = useContext(NotesStateContext)
  if (notes === null) {
    throw new Error('useNotesState must be used within NotesProvider')
  }

  return notes
}

export function useNotesDispatch() {
  const dispatch = useContext(NotesDispatchContext)
  if (dispatch === null) {
    throw new Error('useNotesDispatch must be used within NotesProvider')
  }

  return dispatch
}
