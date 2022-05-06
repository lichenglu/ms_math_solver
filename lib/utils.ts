import { youtube_v3 } from "googleapis";

import * as MSMathSolver from "./types";

export const parseYoutubeToMS = (
  items: youtube_v3.Schema$SearchResult[]
): Partial<MSMathSolver.MSVideo>[] => {
  return items
    .filter((item) => !!item.snippet && !!item.id)
    .map((item) => {
      return {
        name: item.snippet!.title ?? '',
        description: item.snippet!.description ?? '',
        publisher: "Youtube",
        datePublished: item.snippet!.publishedAt ?? '',
        embedHtml: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id!.videoId!}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        thumbnail: [
          {
            thumbnailUrl: item.snippet!.thumbnails?.default?.url || "",
            height: item.snippet!.thumbnails?.default?.height || 0,
            width: item.snippet!.thumbnails?.default?.width || 0,
          },
        ],
        webSearchUrl: `https://youtu.be/${item.id!.videoId!}`,
      };
    });
};
