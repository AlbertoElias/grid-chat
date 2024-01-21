import { createContext } from 'react'

interface ClickedCellContext {
  clickedCell: string | null
  setClickedCell: (clickedCell: string | null) => void
}

export const ClickedCellContext = createContext<ClickedCellContext>({
  clickedCell: null,
  setClickedCell: () => {}
})
