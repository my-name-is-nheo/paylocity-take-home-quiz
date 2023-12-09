import { Dispatch, FC, ReactNode, SetStateAction, createContext } from "react";
import { Employee, HealthcareModalModes } from "./types";

interface HealthcareBenefitsContext {
  modalMode: HealthcareModalModes | null;
  setModalMode: Dispatch<SetStateAction<HealthcareModalModes | null>>;
  closeModal: () => void;
  employeeData: Employee[];
  setEmployeeData: Dispatch<SetStateAction<Employee[]>>;
  // TODO: update Employee instead of number
  selectedEmployee: Employee;
  setSelectedEmployee: Dispatch<SetStateAction<Employee>>;
}

const HealthcareContext = createContext<HealthcareBenefitsContext>(
  {} as HealthcareBenefitsContext
);

const HealthcareBenefitsProvider: FC<
  HealthcareBenefitsContext & { children: ReactNode }
> = ({
  setModalMode,
  modalMode,
  closeModal,
  children,
  employeeData,
  setEmployeeData,
  setSelectedEmployee,
  selectedEmployee,
}) => {
  const context: HealthcareBenefitsContext = {
    setModalMode,
    modalMode,
    closeModal,
    employeeData,
    setEmployeeData,
    setSelectedEmployee,
    selectedEmployee,
  };

  return (
    <HealthcareContext.Provider value={context}>
      {children}
    </HealthcareContext.Provider>
  );
};

export { HealthcareBenefitsProvider, HealthcareContext };
