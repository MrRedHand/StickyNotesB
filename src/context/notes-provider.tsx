import { createContext } from 'react'
import type { INoteState } from '../components/note'

const NotesStateContext = createContext<INoteState[] | null>([])

interface INotesProviderProps {
  children: React.ReactNode
}

export function NotesProvider({ children }: INotesProviderProps) {
  return (
    <NotesStateContext.Provider value={[]}>
      {children}
    </NotesStateContext.Provider>
  )
}
