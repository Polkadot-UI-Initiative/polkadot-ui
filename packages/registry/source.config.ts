import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  dir: "app/docs",
});
