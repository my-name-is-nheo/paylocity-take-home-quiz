import { Employee } from "./types";
import { array, object, string } from "yup";
import dummyData from "../../../dummyData.json";
import {
  DEPEDENTS_COSTS_PER_YEAR,
  EMPLOYEE_BI_WEEKLY_PAYCHECK,
  EMPLOYEE_COSTS_PER_YEAR,
  PAYCHECKS_PER_YEAR,
  DISCOUNT_PERCENTAGE,
} from "./constants";
export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

export const employeeSchema = array(
  object({
    id: string().required(),
    first_name: string().min(2).required(),
    last_name: string().min(2).required(),
    dependents: array(
      object({
        first_name: string(),
        last_name: string(),
        relationship: string().oneOf(["Child", "Spouse"]),
      })
    ).nullable(),
  })
).required();

// in standard http fetching, this would've been used.
const handleResponseErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const handleErrorCatches = (error: unknown, action: HttpVerb) => {
  if (error instanceof Error) {
    console.error(`${action}: ${error.message}`);
  } else {
    console.error("An unknown error occurred");
  }
};

export const apiRequest = async (
  method: HttpVerb,
  endpoint: string,
  callback: (employees: Employee[]) => Employee[]
): Promise<Employee[] | void> => {
  // Call API Endpoint here, maybe introduce try/catch logic

  const rawStoredData = localStorage.getItem("state");

  let newlyStoredData;
  if (!rawStoredData) {
    localStorage.setItem("state", JSON.stringify(dummyData));
    newlyStoredData = localStorage.getItem("state");
  }

  const storedData = employeeSchema.validateSync(
    JSON.parse(rawStoredData || newlyStoredData || "")
  );

  const handleAction = () => {
    const modifiedData = callback(storedData as Employee[]);
    localStorage.setItem("state", JSON.stringify(modifiedData));
    return modifiedData;
  };

  switch (method) {
    case "GET":
      try {
        if (!storedData) {
          throw new Error("Unable to fetch list of employees");
        }
        return storedData as Employee[];
      } catch (error) {
        handleErrorCatches(error, method);
      }
      break;
    case "PUT":
      {
        try {
          const modifiedData = callback(storedData as Employee[]);
          if (!modifiedData) {
            throw new Error("Modified data is falsy");
          }
          localStorage.setItem("state", JSON.stringify(modifiedData));
          return modifiedData;
        } catch (error) {
          handleErrorCatches(error, method);
        }
      }
      break;
    case "POST":
      {
        try {
          const modifiedData = callback(storedData as Employee[]);
          if (!modifiedData) {
            throw new Error("Modified data is falsy");
          }
          localStorage.setItem("state", JSON.stringify(modifiedData));
          return modifiedData;
        } catch (error) {
          handleErrorCatches(error, method);
        }
      }
      break;
    case "DELETE":
      {
        try {
          const modifiedData = callback(storedData as Employee[]);
          localStorage.setItem("state", JSON.stringify(modifiedData));
          return modifiedData;
        } catch (error) {
          handleErrorCatches(error, method);
        }
      }
      break;
  }
};

export const initialCurrentEmployeeState: Employee = {
  id: "",
  first_name: "",
  last_name: "",
};

/**
 * checks if a given string starts with 'A' or 'a' in a case-insensitive manner.
 * @param {string} firstName - string to check
 * @returns {boolean} returns true if the string starts with 'A' or 'a', otherwise false.
 */
export const isEligibleForDiscount = (firstName: string) =>
  firstName.charAt(0).toLowerCase() === "a";

/**
 * calculates the discounted cost after special discount
 * @param individualCost {number}: individual cost of benefit for an employee
 * @param specialDiscount {number}: special discount percentage
 * @returns {number} - returns special discounted cost
 */
const calculateDiscountedCost = (
  individualCost: number,
  specialDiscount: number
) => individualCost - (individualCost * specialDiscount) / 100;

/**
 *  formats a numeric value as a currency string with desired currency code and currency symbol using Intl object.
 * @param {number} value - number value
 * @param {string} [locales] - represents specific geographical, political, or cultural region
 * @param {string} [style] - type of formatting
 * @param {string} [currency] - currency desired
 * @returns {number} returns annual calculated benefits after discount and before deduction
 */
export const formatUsingIntl = (
  value: number,
  locales?: string,
  style?: string,
  currency?: string
) =>
  new Intl.NumberFormat(locales ?? "en-US", {
    style: style ?? "currency",
    currency: currency ?? "USD",
  }).format(value);

/**
 *  calculate benefits of all employees
 * @param {Employee} employee - list of employees
 * @param {number} specialDiscount - special discount for anyone whose name starts with ‘A’, employee or dependent
 * @param {number} [salary] - salary of employee
 * @param {number} [individualCost] - cost of benefit for individual
 * @param {number} [dependentCost] - cost of benefit for depedents
 * @returns {number} returns annual calculated benefits after discount and before deduction
 */
export const calculateBenefits = (
  employee: Employee,
  specialDiscount?: number,
  salary?: number,
  individualCost?: number,
  dependentCost?: number
): number => {
  let employeeTotal = 0;
  let isEmployeeEligibleForDiscount = isEligibleForDiscount(
    employee.first_name
  );
  let employeeSalary =
    salary ?? EMPLOYEE_BI_WEEKLY_PAYCHECK * PAYCHECKS_PER_YEAR;
  let totalIndividualCost = isEmployeeEligibleForDiscount
    ? calculateDiscountedCost(
        individualCost ?? EMPLOYEE_COSTS_PER_YEAR,
        specialDiscount ?? DISCOUNT_PERCENTAGE
      )
    : individualCost ?? EMPLOYEE_COSTS_PER_YEAR;

  employeeTotal = employeeSalary - totalIndividualCost;

  for (const dependent of employee.dependents ?? []) {
    let isDepedentEligibleForDiscount = isEligibleForDiscount(
      dependent.first_name
    );
    let totalDependentCost = isDepedentEligibleForDiscount
      ? calculateDiscountedCost(
          dependentCost ?? DEPEDENTS_COSTS_PER_YEAR,
          specialDiscount ?? DISCOUNT_PERCENTAGE
        )
      : dependentCost ?? DEPEDENTS_COSTS_PER_YEAR;
    employeeTotal = employeeTotal - totalDependentCost;
  }
  return employeeTotal;
};
