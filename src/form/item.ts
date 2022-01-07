import { createForm } from "./form";

interface FormState {
  name: string;
  category: string;
  timerMinutes?: number;
}

const initialFormState: FormState = {
  name: "",
  category: "",
  timerMinutes: undefined,
};

export const useItemForm = createForm(initialFormState);
