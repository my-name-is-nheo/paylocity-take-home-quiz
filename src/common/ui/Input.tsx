import { FC } from "react";
import { ErrorMessage, Field } from "formik";

const Input: FC<{
  name: string;
  placeHolder: string;
  label: string;
}> = ({ name, placeHolder, label }) => (
  <div className="flex flex-1 flex-row py-5 px-2 items-center">
    <label className="flex-1 text-sm pr-3 font-bold">
      {label}
      <ErrorMessage name={name} className="text-xs text-rose-600" />
    </label>
    <Field
      name={name}
      placeholder={placeHolder}
      className="flex-1 self-center pl-1 border border-gray-300"
    />
  </div>
);

export { Input };
