export interface MSClientInfo {
  mkt: string;
  platform: string;
  skipBingVideoEntity: boolean;
  skipGraphOutput: boolean;
}

export interface MSSolveLatexPayload {
  clientInfo: MSClientInfo;
  customLatex: string;
  latexExpression: string;
  showCustomResult: boolean;
}

export interface MSSolveLatexResponse {
  results: MSSolveLatexResult[];
}

export interface MSSolveLatexResult {
  tags: MSSolveLatexTag[];
}

export interface MSSolveLatexTag {
  actions: MSSolveLatexAction[];
}

export interface MSSolveLatexAction {
  actionType: string;
  customData: string;
}

export interface MSSolveLatexActionPreviewData {
  mathSolverResult: MSMathSolverResult;
  webResults: MSWebResult[];
  entities: MSEntity[];
  videos: MSVideo[];
  isError: boolean,
  errorMessage: string,
  customBingQueries: {
    problemType: string,
    stepTypes: string[],
    market: string
  },
  bingEduAnswerUrl: null | string,
  equationId: string
}

export interface MSVideo {
  name: string;
  description: string;
  url: string;
  publisher: string;
  datePublished: string;
  embedHtml: string;
  viewCount: string;
  height: number;
  width: number;
  thumbnail?: {
    motionThumbnailUrl?: string,
    thumbnailUrl: string,
    width?: number,
    height?: number
  }[];
  mediaId: string;
  webSearchUrl: string;
  duration: string;
  favIconImgData: string;
}

export interface MSEntity {
  name: string;
  description: string;
  url: string;
  satoriID: string;
  image: {
    name: string;
    description: string;
    url: string;
    satoriID: string;
    image: {
      name: string;
      thumbnailUrl: string;
      width: number;
      height: number;
      sourceWidth: number;
      sourceHeight: number;
      contentUrl: string;
      pageUrl: string;
      pageDisplayUrl: string;
    }
  }[];
}

export interface MSWebResult {
  title: string;
  snippet: string;
  url: string;
  qnaData: MSQnAData[];
  isExactMatch: boolean;
  relatedEquations: string[];
  favIconImgData: string;
}

export interface MSQnAData {
  title: string;
  question: string;
  answer: string;
  url: string;
  qnaImage: string | null;
  relatedQuestions: any[];
  source: string;
  sourceUrl: string;
  sourceLogo: string | null;
}

export interface MSMathSolverResult {
  problem: string;
  keyboardLatexInput: string;
  transformedLatex: string;
  isError: boolean;
  errorCode: number;
  errorMessage: string;
  errorDisplayMessage: string;
  allGraphData: MSMathSolverResultGraphData[];
  actions: MSMathSolverResultAction[];
  bingWebAnswerUrl: string;
  hasBingWebAnswer: boolean;
  bingWebAnswerHeading: string;
  problemCategory: string;
  problemCategoryDisplayName: string;
  detectedLatex: string;
  z3solution: null | object;
  actionLangMapping: object;
}

export interface MSMathSolverResultGraphData {
  actionName: string;
  graphExpression: string;
  graphImageData: string;
  displayRange: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

export interface MSMathSolverResultAction {
  actionName: string;
  solution: string;
  templateSteps: [
    {
      templateName: string;
      steps: MSMathSolverResultActionStep[];
    }
  ];
  mathType: string;
}

export interface MSMathSolverResultActionStep {
  hint: string | null;
  step: string;
  expression: string;
  prevExpression: string;
}

export interface MSCustomBingAnswer {
  entities: MSEntity[],
  videos: MSVideo[],
  worksheets: MSWebResult[]
}