export type HealthcareModalModes = "add" | "edit" | "delete";

type Dependent = {
  id: string;
  first_name: string;
  last_name: string;
  relationship: "Spouse" | "Child";
};

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  dependents?: Dependent[];
};

export type ModalActions = "Add" | "Edit" | "";
