const Input = (props) => {
  const { type, placeholder, name, id } = props;

  return (
    <input
      type={type}
      name={name}
      id={id}
      className="border rounded w-full py-2 px-3 text-slate-900 placeholder: opacity-50"
      placeholder={placeholder}
    />
  );
};

export default Input;
