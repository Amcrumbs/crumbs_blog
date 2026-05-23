declare module "@/components/DotField" {
  import type { ComponentType, HTMLAttributes } from "react";

  type DotFieldProps = HTMLAttributes<HTMLDivElement> & {
    dotRadius?: number;
    dotSpacing?: number;
    cursorRadius?: number;
    cursorForce?: number;
    bulgeOnly?: boolean;
    bulgeStrength?: number;
    glowRadius?: number;
    sparkle?: boolean;
    waveAmplitude?: number;
    gradientFrom?: string;
    gradientTo?: string;
    glowColor?: string;
  };

  const DotField: ComponentType<DotFieldProps>;

  export default DotField;
}
