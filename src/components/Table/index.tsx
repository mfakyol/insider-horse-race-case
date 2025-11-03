import clsx from "clsx";
import classes from "./styles.module.scss";

type TableProps = React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>;

function Table({ children, className, ...props }: TableProps) {
  return (
    <table className={clsx(classes.table, className)} {...props}>
      {children}
    </table>
  );
}

function TR({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={clsx(classes.tr, className)} {...props}>
      {children}
    </tr>
  );
}

function TH({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={clsx(classes.th, className)} {...props}>
      {children}
    </th>
  );
}

function TD({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={clsx(classes.td, className)} {...props}>
      {children}
    </td>
  );
}

function TBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={clsx(classes.tbody, className)} {...props}>
      {children}
    </tbody>
  );
}

function THead({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={clsx(classes.thead, className)} {...props}>
      {children}
    </thead>
  );
}

Table.TR = TR;
Table.TH = TH;
Table.TD = TD;
Table.TBody = TBody;
Table.THead = THead;
export default Table;
