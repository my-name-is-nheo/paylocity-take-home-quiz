import { ButtonHTMLAttributes, FC, useCallback, useContext } from "react";
import { Formik, Form } from "formik";
import { InferType, array, object, string } from "yup";
import { nanoid } from "nanoid";
import { HealthcareContext } from "./HealthcareContext";
import { Input, Button, Icon } from "../../../common";
import { Employee } from "./types";
import { HttpMethod, apiRequest } from "./utilities";
import { DependentsForm } from "./DependentsForm";
import { ButtonColor } from "../../../common/ui/Button";

const SCHEMA = object({
  first_name: string().min(2, "Two letters!").required("Required Field!"),
  last_name: string().min(2, "Two letters!").required("Required Field!"),
  dependents: array(
    object({
      //TODO: update validation to be more specific
      first_name: string(),
      last_name: string(),
      relationship: string().oneOf(["Child", "Spouse"], "Invalid Relationship"),
    })
  ),
});

export type EmployeesFormSchema = InferType<typeof SCHEMA>;

export const emptyDependant = {
  first_name: "",
  last_name: "",
  relationship: "Child",
};
const EmployeesForm: FC = () => {
  const {
    modalMode,
    setModalMode,
    setEmployeeData,
    selectedEmployee,
    closeModal,
  } = useContext(HealthcareContext);

  const initialValues: EmployeesFormSchema = {
    first_name: modalMode === "add" ? "" : selectedEmployee?.first_name ?? "",
    last_name: modalMode === "add" ? "" : selectedEmployee?.last_name ?? "",
    dependents:
      modalMode === "add"
        ? [emptyDependant]
        : selectedEmployee?.dependents ?? [emptyDependant],
  };

  const handleModalSubmit = useCallback(
    async (data: EmployeesFormSchema) => {
      const modifiedData = {
        ...data,
        dependents: data.dependents?.filter((dependent) => {
          const hasNotEmptyNames =
            dependent.hasOwnProperty("first_name") &&
            dependent.hasOwnProperty("last_name") &&
            !!dependent.first_name &&
            !!dependent.last_name;

          return hasNotEmptyNames;
        }),
      };

      if (modalMode === "add") {
        const response = await apiRequest(
          HttpMethod.POST,
          `/employees`,
          (storedData) => {
            storedData.push({
              ...modifiedData,
              dependents: modifiedData.dependents?.map((dependent) => ({
                ...dependent,
                id: nanoid(),
              })),
              id: nanoid(),
            } as Employee);

            return storedData;
          }
        );
        if (response) {
          setEmployeeData(response);
        }
      }

      if (modalMode === "edit") {
        const response = await apiRequest(
          HttpMethod.PUT,
          `/employees/${selectedEmployee.id}`,
          (storedData) => {
            const modifiedRecordIndex = storedData.findIndex(
              ({ id }) => id === selectedEmployee.id
            );

            if (modifiedRecordIndex === -1) {
              throw new Error("Cannot find matching Record");
            } else {
              storedData[modifiedRecordIndex] = {
                ...modifiedData,
                id: selectedEmployee.id,
              } as Employee;
            }

            return storedData;
          }
        );
        if (response) {
          setEmployeeData(response);
        }
      }

      closeModal();
    },
    [setEmployeeData, modalMode, closeModal]
  );

  const formButtons: {
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    label: string;
    color?: ButtonColor;
    onClick?: () => void;
  }[] = [
    {
      type: "submit",
      label: modalMode === "add" ? "Create" : "Save",
      color: ButtonColor.Green,
    },
    {
      color: ButtonColor.Red,
      type: "button",
      label: "Cancel",
      onClick: closeModal,
    },
    ...(modalMode?.includes("edit")
      ? [
          {
            label: "Delete",
            onClick: () => setModalMode("delete"),
            color: ButtonColor.Red,
          },
        ]
      : []),
  ];

  const employeeInputFieldInfo = [
    { name: "first_name", label: "First Name", placeHolder: "Jane" },
    { name: "last_name", label: "Last Name", placeHolder: "McJane" },
  ];

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                <Icon icon="profile" alt="employees-form-profile-logo" />
              </div>
              <h3
                className="text-base font-semibold leading-6 text-gray-900"
                id="modal-title"
              >
                {modalMode === "add" ? "Add " : "Edit "}
                Employee
              </h3>
              <div>
                <Formik<EmployeesFormSchema>
                  validationSchema={SCHEMA}
                  initialValues={initialValues}
                  onSubmit={handleModalSubmit}
                >
                  {() => (
                    <Form className="flex flex-col items-center">
                      {employeeInputFieldInfo.map((info) => (
                        <Input
                          key={`employees-form-input-${info.placeHolder}`}
                          name={info.name}
                          placeHolder={info.placeHolder}
                          label={info.label}
                        />
                      ))}
                      <h4 className="font-semibold">Dependent(s)</h4>
                      <DependentsForm />
                      <div className="flex self-center">
                        {formButtons.map(({ type, label, color, onClick }) => (
                          <div
                            className="mx-1 my-2"
                            key={`employees-form-button-${label}-${label.length}`}
                          >
                            <Button
                              type={type}
                              label={label}
                              color={color}
                              onClick={onClick}
                            />
                          </div>
                        ))}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployeesForm };
