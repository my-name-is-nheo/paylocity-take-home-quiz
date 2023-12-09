import { FC, Fragment, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import { Button, Input, SelectField } from "../../../common";
import { ButtonColor } from "../../../common/ui/Button";
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
        <div className="flex flex-col">
          {values.dependents?.length &&
            values.dependents.map((_, index) => {
              return (
                <Fragment key={`dependents-form-item-${index}`}>
                  <div className="flex flex-row py-2 items-center">
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
                      className="h-10"
                    />
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
                      className="flex-1 h-20px self-center"
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
