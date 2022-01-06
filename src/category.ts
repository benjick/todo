import { createForm } from "./form";

interface FormState {
  name: string;
  resetAfterDays?: number;
  closeAfterFinished?: number;
}

const initialFormState: FormState = {
  name: "",
  resetAfterDays: undefined,
  closeAfterFinished: undefined,
};

export const useCategoryForm = createForm(initialFormState);
