import { create } from 'apisauce'

import * as MSMathSolver from './types'

// define the api
const api = create({
  baseURL: 'https://mathsolver.microsoft.com/cameraexp/api',
  headers: { Accept: 'application/json' },
})

export const solveLatex = (payload: MSMathSolver.MSSolveLatexPayload) => {
    return api.post<MSMathSolver.MSSolveLatexResponse>('/v1/solvelatex', payload)
}

export const generateCustomBingAnswers = (payload: {
  queryInfo: {
    problemType?: string;
    stepTypes: string[]
    market?: string
  }
}) => {
  return api.post<MSMathSolver.MSCustomBingAnswer>('/v1/generateCustomBingAnswers', payload, {
    baseURL: 'https://mathsolver.microsoft.com/cameraexp/api'
  })
}