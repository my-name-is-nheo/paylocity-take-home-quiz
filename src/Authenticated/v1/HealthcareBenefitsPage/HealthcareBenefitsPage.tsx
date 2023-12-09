import React, { useCallback, useEffect, useState } from "react";
import { HealthcareBenefitsProvider } from "./HealthcareContext";
import {
  DeleteModal,
  Button,
  paylocityLogo,
  EmptyState,
  HeaderWithImage,
  Header,
  ButtonColor,
} from "../../../common";
import { Employee, HealthcareModalModes } from "./types";
import { EmployeesForm } from "./EmployeesForm";
import {
  apiRequest,
  calculateBenefits,
  formatUsingIntl,
  initialCurrentEmployeeState,
} from "./utilities";
import { DISCOUNT_PERCENTAGE } from "./constants";

const HealthcareBenefitsPage: React.FC = () => {
  const [modalMode, setModalMode] = useState<HealthcareModalModes | null>(null);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    initialCurrentEmployeeState
  );

  const closeModal = useCallback(() => setModalMode(null), [setModalMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `/users/`,
          (employee) => employee
        );
        if (response) {
          setEmployeeData(response);
        }
      } catch (err) {
        throw new Error("Unable to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleDelete = useCallback(async () => {
    await apiRequest("DELETE", `/users/${selectedEmployee.id}`, (employees) =>
      employees.filter((employee) => employee.id !== selectedEmployee.id)
    );

    setEmployeeData((prev) =>
      prev.filter((employee) => employee.id !== selectedEmployee.id)
    );
    setSelectedEmployee(initialCurrentEmployeeState);
    setModalMode(null);
  }, [selectedEmployee, setEmployeeData, setSelectedEmployee, setModalMode]);

  return (
    <HealthcareBenefitsProvider
      modalMode={modalMode}
      setModalMode={setModalMode}
      closeModal={closeModal}
      employeeData={employeeData}
      setEmployeeData={setEmployeeData}
      selectedEmployee={selectedEmployee}
      setSelectedEmployee={setSelectedEmployee}
    >
      <div className="w-screen">
        <HeaderWithImage
          source={paylocityLogo}
          label="Paylocity Healthcare Benefits"
          imageClassName="h-10 w-10 rounded-full"
          headerClassName="text-lg font-medium text-slate-900"
        />
        <div className="flex justify-center flex-col border border-black p-4 overflow-y-auto">
          {!employeeData.length ? (
            <EmptyState
              className="flex justify-center"
              text=" No employees Registered. Add to get started!"
            />
          ) : (
            <>
              <Header
                headerClassName="font-bold underline"
                label="Employees List"
              />
              <ul>
                {employeeData.map((employee) => (
                  <div
                    key={`healthcare-benefits-page-table-${employee.id}`}
                    className="border border-black hover:border-black my-2 px-2 py-3"
                  >
                    <li className="py-2">
                      {employee.first_name} {employee.last_name}
                      <Button
                        label="Edit"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setModalMode("edit");
                        }}
                        className="ml-2 py-1"
                        color={ButtonColor.Green}
                      />
                    </li>
                    <div className="flex flex-row">
                      <div className="flex-1">
                        <Header
                          label="Information"
                          headerClassName="font-bold underline"
                        />
                        <div className="flex flex-row">
                          <div className="underline">Number of Dependents:</div>
                          <span className="mr-1" />
                          {employee.dependents?.length}
                        </div>
                        {employee.dependents?.map((dependent) => (
                          <li
                            key={`health-care-benefits-page-table-dependent-${dependent.id}`}
                          >
                            {dependent.first_name} {dependent.last_name}
                          </li>
                        ))}
                      </div>
                      <div className="flex-1">
                        <Header
                          label="Calculated Benefits"
                          headerClassName="font-bold underline"
                        />
                        {formatUsingIntl(
                          calculateBenefits(employee, DISCOUNT_PERCENTAGE)
                        )}
                        <li></li>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </>
          )}
          <div className="flex justify-center items-center pt-5">
            <Button
              label="Add Employee"
              onClick={() => setModalMode("add")}
              color={ButtonColor.Blue}
            />
          </div>
        </div>

        {(modalMode === "add" || modalMode === "edit") && <EmployeesForm />}

        {modalMode === "delete" && (
          <DeleteModal
            handleDelete={handleDelete}
            setModalMode={() => setModalMode("edit")}
            title="Delete Employee Information?"
            message="Are you sure you want to delete ? This will delete the
            dependents as well."
            icon="delete"
          />
        )}
      </div>
    </HealthcareBenefitsProvider>
  );
};

export { HealthcareBenefitsPage };
