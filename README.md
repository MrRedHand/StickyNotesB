# React + TypeScript + Vite

# Preview https://mrredhand.github.io/StickyNotesB/

Basic notes workflow implementation

- Context is to communicate between notes
- useReducer for notes operations
- useLocalStorage hook to store data
- Store only on actions end - like drag end = store state
- Textarea input has debounce 500ms before store trigger

# To run - basic `npm i` => `npm run dev`

## Structure

```mermaid
flowchart LR
  pointer[Pointer on note] --> interact[useNoteInteractions]
  interact -->|move: DOM only| noteEl[Note styles]
  interact -->|pointerup + trash overlap| remove[remove]
  interact -->|pointerup| commit[commit position / size / zIndex]
  type[Type in textarea] --> debounceText[useDebouncedCallback 500ms]
  debounceText --> updateText[updateText]

  remove --> reducer[notesReducer]
  commit --> reducer
  updateText --> reducer
  reducer --> persist[useLocalStorage]
  persist --> ls[(localStorage)]
  ls -->|read on start| useNotesStore
```

`Note` is `memo`'d and reads only `dispatch`, not the notes array. During drag or resize the DOM updates immediately; React state and localStorage update after the gesture ends.
