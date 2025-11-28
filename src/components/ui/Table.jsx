import { forwardRef } from 'react';

const Table = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div className="table-container">
      <table ref={ref} className={`table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
});

const TableHeader = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <thead ref={ref} className={className} {...props}>
      {children}
    </thead>
  );
});

const TableBody = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  );
});

const TableRow = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <tr ref={ref} className={className} {...props}>
      {children}
    </tr>
  );
});

const TableHead = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <th ref={ref} className={className} {...props}>
      {children}
    </th>
  );
});

const TableCell = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <td ref={ref} className={className} {...props}>
      {children}
    </td>
  );
});

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
export default Table;