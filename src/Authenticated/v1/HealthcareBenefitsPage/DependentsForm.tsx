import { FC, Fragment, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import { Button, Input, SelectField, ButtonColor } from "../../../common";
import { EmployeesFormSchema, emptyDependant } from "./EmployeesForm";

const DependentsForm: FC = () => {
  const { values, setValues } = useFormikContext<EmployeesFormSchema>();

  useEffect(() => {
    if (!values.dependents?.length) {
      setValues((prev) => ({ ...prev, dependents: [emptyDependant] }));
    }
  }, [values.dependents]);
  return (
    <FieldArray
      name="dependents"
      render={({ push, remove }) => (
        <div className="flex flex-col overflow-y-scroll max-h-[300px]">
          {values.dependents?.length &&
            values.dependents.map((_, index) => {
              return (
                <Fragment key={`dependents-form-item-${index}`}>
                  <div className="flex flex-col py-2 items-center min-w-[200px] md:flex-row">
                    {[
                      {
                        name: `dependents[${index}].first_name`,
                        label: "First Name",
                        placeHolder: "First...",
                      },
                      {
                        name: `dependents[${index}].last_name`,
                        label: "Last Name",
                        placeHolder: "Last...",
                      },
                    ].map((info) => (
                      <Input
                        name={info.name}
                        placeHolder={info.placeHolder}
                        label={info.label}
                        key={`dependents-form-input-${info.name}-${index}`}
                      />
                    ))}
                    <SelectField
                      name={`dependents[${index}].relationship`}
                      className="flex-1 h-[26px] self-center  border border-gray-300"
                      labelOptions={[
                        {
                          value: "Child",
                          label: "Child",
                        },
                        {
                          value: "Spouse",
                          label: "Spouse",
                        },
                      ]}
                    />
                    <Button
                      type="button"
                      label="Remove"
                      onClick={() => {
                        if (
                          values.dependents &&
                          values.dependents.length >= 1
                        ) {
                          // Check if removing the last dependent
                          const isLastDependent =
                            index === values.dependents.length - 1;

                          // Remove the dependent
                          remove(index);

                          // If it was the last dependent, add a new empty one if dependents list is empty
                          if (isLastDependent) {
                            setValues((prev) => {
                              const previousDependent = prev.dependents?.slice(
                                0,
                                -1
                              );
                              if (!previousDependent?.length) {
                                return {
                                  ...prev,
                                  dependents: [emptyDependant],
                                };
                              }
                              return {
                                ...prev,
                                dependents: prev.dependents?.slice(0, -1),
                              };
                            });
                          }
                        }
                      }}
                      color={ButtonColor.Red}
                      className="h-10 ml-2"
                    />
                  </div>
                  {index === (values.dependents?.length || 0) - 1 && (
                    <Button
                      type="button"
                      label="Add Dependent"
                      onClick={() => push(emptyDependant)}
                      color={ButtonColor.Blue}
                    />
                  )}
                </Fragment>
              );
            })}
        </div>
      )}
    />
  );
};

export { DependentsForm };
