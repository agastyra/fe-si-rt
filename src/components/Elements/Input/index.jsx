import Input from "./Input";
import Label from "./Label";

const InputForm = (props) => {
  const { label, type, placeholder, name, id, error } = props;

  return (
    <div className="mb-6">
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} placeholder={placeholder} name={name} id={id} />
        {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default InputForm;
