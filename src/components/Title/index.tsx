import clsx from "clsx";
import styles from "./styles.module.scss";

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  bgColor?: string;
  size?: "large" | "medium";
}

function Title({
  children,
  className,
  style,
  bgColor,
  size = "large",
  ...props
}: TitleProps) {
  return (
    <div
      className={clsx(styles.title, className, styles[size])}
      style={{ ...style, backgroundColor: bgColor }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Title;
