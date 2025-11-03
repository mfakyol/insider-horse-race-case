declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export const ReactComponent: React.VFC<React.SVGProps<SVGSVGElement>>;
}

declare module "*.svg?react" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module "*.svg?url" {
  const content: string;
  export default content;
}
