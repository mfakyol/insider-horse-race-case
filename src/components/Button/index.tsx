import styles from "./styles.module.scss";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "success";
}

function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
