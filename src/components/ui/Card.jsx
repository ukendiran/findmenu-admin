import { forwardRef } from 'react';

const Card = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`card ${className}`} {...props}>
      {children}
    </div>
  );
});

const CardHeader = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
});

const CardBody = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
});

const CardFooter = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
export default Card;