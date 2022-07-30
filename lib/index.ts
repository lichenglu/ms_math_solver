import { google } from "googleapis";
// import { writeFileSync } from 'fs'

import { solveLatex, generateCustomBingAnswers } from "./endpoints";
import * as MSMathSolver from "./types";
import { parseYoutubeToMS } from "./utils";

import { SolvedResult } from "./model";

export { SolvedResult }

export interface InitServiceParams {
  fallbackToYoutubeVideos: boolean;
  youtubeAPIKey?: string;
}

export interface FetchYoutubeVideosParams {
  youtubeAPIKey?: string;
  searchTerm?: string;
}

export const initService = ({
  fallbackToYoutubeVideos,
  youtubeAPIKey,
}: Partial<InitServiceParams>) => {
  const generateDefaultConfit = (
    latex: string
  ): MSMathSolver.MSSolveLatexPayload => {
    return {
      clientInfo: {
        platform: "web",
        mkt: "en",
        skipGraphOutput: true,
        skipBingVideoEntity: true,
      },
      latexExpression: latex,
      customLatex: latex,
      showCustomResult: true,
    };
  };

  const fetchYoutubeVideos = async ({
    youtubeAPIKey,
    searchTerm,
  }: FetchYoutubeVideosParams) => {
    if (!youtubeAPIKey) {
      throw new Error("[fetchYoutubeVideos] missing api key");
    }
    const youtube = google.youtube({
      version: "v3",
      auth: youtubeAPIKey,
    });

    const res = await youtube.search.list({
      // available part: https://developers.google.com/youtube/v3/docs/videos/list
      // well...some of it do not work and will throw errors
      part: ['snippet', 'id'],
      q: searchTerm + '&introduction|math|khan academy|learning|education$k-12',
      type: ["video"],
      videoDuration: "medium",
      safeSearch: "strict",
    })

    return parseYoutubeToMS(res.data?.items ?? []);
  };

  const solveFor = async (
    latex: string
  ): Promise<{
    ok: boolean;
    error?: Error | null;
    data?: SolvedResult
  }> => {
    const res = await solveLatex(generateDefaultConfit(latex));

    if (!res.data) {
      return {
        ok: false,
        error: res.originalError,
      };
    }

    const result = res.data.results[0];
    const tag = result?.tags[0];
    const action = tag.actions[0];
    const data = JSON.parse(action?.customData);
    const previewData = JSON.parse(
      data.previewText
    ) as MSMathSolver.MSSolveLatexActionPreviewData;
    const solvedResult = new SolvedResult(latex, previewData)

    // writeFileSync('/Users/chengluli/developer/ms_math_solver_api/examples.json', data.previewText)

    if (solvedResult.relatedConcepts.length < 3 && solvedResult.solveSteps?.name) {
      try {
        const bingRes = await generateCustomBingAnswers({
          queryInfo: {
            market: 'en',
            stepTypes: [solvedResult.solveSteps.name],
            problemType: previewData.mathSolverResult.problemCategoryDisplayName
          }
        })
        const newEntities = (bingRes.data!.entites ?? bingRes.data!.entities)
        if (solvedResult.relatedConcepts.length === 0) {
          console.log('hello')
          solvedResult.setConcepts(newEntities)
        } else {
          solvedResult.appendConcepts(newEntities)
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (solvedResult.relatedVideos.length <= 0 && fallbackToYoutubeVideos) {
      if (solvedResult.relatedConcepts.length > 0) {
        try {
          const videos = await fetchYoutubeVideos({
            youtubeAPIKey,
            searchTerm: solvedResult.relatedConcepts.map((ent) => ent.name).join("|"),
          });
          // @ts-ignore
          solvedResult.setVideos(videos)
        } catch (err) {
          console.log(err);
        }
      }
    }

    return {
      ok: true,
      data: solvedResult,
    };
  };

  return {
    solveFor,
  };
};
