import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HealthcareBenefitsProvider } from "./HealthcareContext";
import {
  DeleteModal,
  Button,
  EmptyState,
  HeaderWithImage,
  Header,
  ButtonColor,
} from "../../../common";
import { Employee, HealthcareModalModes } from "./types";
import { EmployeesForm } from "./EmployeesForm";
import paylocityLogo from "../../../common/assets/paylocity.png";
import {
  apiRequest,
  calculateBenefits,
  formatUsingIntl,
  initialCurrentEmployeeState,
  isEligibleForDiscount,
} from "./utilities";
import { DISCOUNT_PERCENTAGE, PAYCHECKS_PER_YEAR } from "./constants";
import { orderBy } from "lodash";

const HealthcareBenefitsPage: React.FC = () => {
  const [modalMode, setModalMode] = useState<HealthcareModalModes | null>(null);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
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

  const sortedEmployeeData = useMemo(
    () => orderBy(employeeData, (employee) => employee.first_name, [sortBy]),
    [sortBy, employeeData]
  );

  const handleSortBy = useCallback(
    () => setSortBy((prevSortBy) => (prevSortBy === "asc" ? "desc" : "asc")),
    []
  );

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
          {!sortedEmployeeData.length ? (
            <EmptyState
              className="flex justify-center"
              text=" No employees Registered. Add to get started!"
            />
          ) : (
            <>
              <Header
                headerClassName="font-bold underline"
                label={`Employees List ${sortBy === "asc" ? "☝️" : "👇"}`}
                onLabelClick={handleSortBy}
              />
              <ul className="h-[500px]">
                {sortedEmployeeData.map((employee) => (
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
                          label="Additional Information"
                          headerClassName="font-bold underline"
                        />
                        <div className="flex flex-row">
                          <div className="underline">Number of Dependents:</div>
                          <span className="mr-1" />
                          {employee.dependents?.length}
                        </div>
                        <div className="overflow-y-scroll max-h-[200px]">
                          {employee.dependents?.map((dependent) => (
                            <li
                              key={`health-care-benefits-page-table-dependent-${dependent.id}`}
                            >
                              {dependent.first_name} {dependent.last_name}{" "}
                              {isEligibleForDiscount(dependent.first_name) &&
                                "*"}
                            </li>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Header
                          label="Calculated Benefits"
                          headerClassName="font-bold underline"
                        />
                        <div className="flex-1">
                          Biweekly Paycheck:{" "}
                          {formatUsingIntl(
                            calculateBenefits(employee, DISCOUNT_PERCENTAGE) /
                              PAYCHECKS_PER_YEAR
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="flex justify-center items-center pt-5">
          <Button
            label="Add Employee"
            onClick={() => setModalMode("add")}
            color={ButtonColor.Blue}
          />
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
