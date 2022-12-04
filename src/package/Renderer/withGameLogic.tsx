import { GameBody, GameBodyOptions } from "@/package/types";
import { FC } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
const withGameLogic = <
  T extends GameBodyOptions,
  P extends { gameBody: GameBody<T> }
>(
  WrappedComponent: FC<P>,
  useLogic: (props: P) => void
) => {
  const Component = (props: P) => {
    useLogic(props);

    return <WrappedComponent {...props} />;
  };

  return Component;
};

export default withGameLogic;
