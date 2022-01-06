import create from "zustand";
import produce from "immer";
import { combine } from "zustand/middleware";

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

export const useCategoryForm = create(
  combine(
    {
      id: undefined as string | undefined,
      form: initialFormState,
      open: false,
    },
    (set) => ({
      setOpen(open: boolean) {
        set({ open });
      },
      resetForm() {
        set({ id: undefined, form: initialFormState });
      },
      setForm(id: string, form: FormState) {
        set({ id, form });
      },
      updateForm: (id: keyof FormState, value: unknown) =>
        set(
          produce((state) => {
            state.form[id] = value;
          })
        ),
    })
  )
);
