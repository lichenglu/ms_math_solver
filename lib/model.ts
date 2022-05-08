import * as MSMathSolver from "./types";

export class SolvedResult {
  private previewData: MSMathSolver.MSSolveLatexActionPreviewData;

  private advancedTopics = [
      'differentiable function'
  ]

  constructor(previewData: MSMathSolver.MSSolveLatexActionPreviewData) {
    this.previewData = previewData;
  }

  get beginnerUnderstandableAnswerIdx(): number {
    return this.previewData.mathSolverResult.actions?.findIndex(
        (action) =>
          action.actionName.toLowerCase().includes("evaluate") ||
          action.actionName.toLowerCase().includes("solve")
      ) ?? 0;
  }

  get answer(): MSMathSolver.MSMathSolverResultAction | undefined {
    return this.previewData.mathSolverResult.actions?.[this.beginnerUnderstandableAnswerIdx];
  }

  get solveSteps(): MSMathSolver.MSMathSolverResultActionStep[] {
    return this.answer?.templateSteps[0]?.steps ?? [];
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
