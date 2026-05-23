declare module "@/components/ClickSpark" {
  import type { ComponentType, ReactNode } from "react";

  type ClickSparkProps = {
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    extraScale?: number;
    children?: ReactNode;
  };

  const ClickSpark: ComponentType<ClickSparkProps>;

  export default ClickSpark;
}
