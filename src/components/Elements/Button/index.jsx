import { forwardRef } from "react";

const Button = forwardRef(function Button(props, ref) {
  const { children, type, className, onClick } = props;
  return (
    <button
      className={`h-10 px-6 font-semibold rounded-md ${className}`}
      type={type}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default Button;
