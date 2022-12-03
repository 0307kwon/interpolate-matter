import { HTMLAttributes } from "react";
import classes from "./NameTag.module.less";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
}

const NameTag = ({ name, ...options }: Props) => {
  return (
    <div className={classes.root} {...options}>
      <span>{name}</span>
    </div>
  );
};

export default NameTag;
