import { FC } from "react";
import { useField } from "formik";

const SelectField: FC<{
  name: string;
  className?: string;
  labelOptions: { value: string; label: string }[];
}> = ({ name, className = undefined, labelOptions }) => {
  const [field, _, { setValue }] = useField<string>(name);

  return (
    <select
      name={name}
      id={name}
      className={className}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      value={field.value}
    >
      {labelOptions.map((option) => (
        <option
          value={option.value}
          key={`select-field-option-${name}-${option.label}-${option.label.length}`}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export { SelectField };
