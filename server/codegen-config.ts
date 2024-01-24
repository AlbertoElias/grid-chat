
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.graphql",
  generates: {
    "src/gen-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        withSubscription: true,
      }
    },
  }
};

export default config;
