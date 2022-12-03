import { FC } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
const withGameLogic = <P extends {}>(
  WrappedComponent: FC<P>,
  useLogic: () => void
) => {
  const Component = (props: P) => {
    useLogic();

    return <WrappedComponent {...props} />;
  };

  return Component;
};

export default withGameLogic;
