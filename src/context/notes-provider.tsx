import type { ReactNode } from 'react'
import {
  NotesDispatchContext,
  NotesStateContext,
  useNotesStore,
} from '../hooks/use-notes'

interface INotesProviderProps {
  children: ReactNode
}

export function NotesProvider({ children }: INotesProviderProps) {
  const [notes, dispatch] = useNotesStore()

  return (
    <NotesDispatchContext.Provider value={dispatch}>
      <NotesStateContext.Provider value={notes}>{children}</NotesStateContext.Provider>
    </NotesDispatchContext.Provider>
  )
}
