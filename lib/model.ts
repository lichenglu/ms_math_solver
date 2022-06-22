import * as MSMathSolver from "./types";

export class SolvedResult {
  private previewData: MSMathSolver.MSSolveLatexActionPreviewData;
  private equation: string;

  private advancedTopics = [
      'differentiable function'
  ]

  constructor(equation: string, previewData: MSMathSolver.MSSolveLatexActionPreviewData) {
    this.equation = equation
    this.previewData = previewData;
  }

  get beginnerUnderstandableAnswerIdx(): number {
    return this.previewData.mathSolverResult?.actions?.findIndex(
        (action) =>
          action.actionName.toLowerCase().includes("evaluate") ||
          action.actionName.toLowerCase().includes("solve")
      ) ?? 0;
  }

  get getEquation(): string {
    return this.equation
  }

  get equationId(): string {
    return this.previewData.equationId
  }

  get answer(): MSMathSolver.MSMathSolverResultAction | undefined {
    return this.previewData.mathSolverResult?.actions?.[this.beginnerUnderstandableAnswerIdx];
  }

  get solveSteps(): {
    name: string,
    steps: MSMathSolver.MSMathSolverResultActionStep[]
  } | undefined {
    const template = this.answer?.templateSteps?.[0]
    return template &&  {
      name: template.templateName,
      steps: template.steps ?? []
    }
  }

  get alternativeSolveSteps(): {
    name: string,
    steps: MSMathSolver.MSMathSolverResultActionStep[]
  }[] | undefined {
    return this.answer?.templateSteps?.slice(1).map(template => {
      return {
        name: template.templateName,
        steps: template.steps ?? []
      }
    })
  }

  get relatedProblems(): MSMathSolver.MSWebResult[] {
    return this.previewData.webResults;
  }

  get relatedVideos(): MSMathSolver.MSVideo[] {
    return this.previewData.videos;
  }

  get relatedConcepts(): MSMathSolver.MSEntity[] {
    return this.previewData.entities.filter(ent => !this.advancedTopics.includes(ent.name.toLowerCase()));
  }

  setVideos(videos: MSMathSolver.MSVideo[]) {
      this.previewData.videos = videos
  }
}
