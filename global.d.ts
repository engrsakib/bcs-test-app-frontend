declare namespace JSX {
  interface IntrinsicElements {
    "math-field": any;
  }
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "read-only"?: string | boolean;
        },
        HTMLElement
      >;
    }
  }
}

interface Window {
  MathfieldElement?: typeof import("mathlive").MathfieldElement;
}

declare module "*.css";
declare module "*.scss";
declare module "*.sass";