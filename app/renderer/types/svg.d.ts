// app/renderer/types/svg.d.ts
declare module "*.svg?react" {
    import * as React from 'react';
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
    export default ReactComponent;
}

declare module "*.svg" {
    const src: string;
    export default src;
}

declare module '*.svg?url' {
    const src: string;
    export default src;
}
