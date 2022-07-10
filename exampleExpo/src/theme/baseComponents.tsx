import { Box } from "native-base";
import { InterfaceBoxProps } from "native-base/lib/typescript/components/primitives/Box";

export const Section = ({ ...props }: InterfaceBoxProps) => (
  <Box
    flexDirection={"row"}
    alignItems="center"
    justifyContent={"space-between"}
    px="s"
    mt="l"
    {...props}
  />
);
