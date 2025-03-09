const Label = (props) => {
  const { children, htmlFor } = props;

  return (
    <label htmlFor={htmlFor} className="text-slate-700 font-bold block">
      {children}
    </label>
  );
};

export default Label;
