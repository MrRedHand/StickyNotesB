import WorkflowCanvas from './components/workflow-canvas'
import { NotesProvider } from './context/notes-provider'

function App() {
  return (
    <NotesProvider>
      <WorkflowCanvas />
    </NotesProvider>
  )
}

export default App
