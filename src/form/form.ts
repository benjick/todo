import create from "zustand";
import produce from "immer";
import { combine } from "zustand/middleware";

export function createForm<T>(initialFormState: T) {
  const useForm = create(
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
        setForm(id: string, form: T) {
          set({ id, form });
        },
        updateForm: (id: keyof T, value: unknown) =>
          set(
            produce((state) => {
              state.form[id] = value;
            })
          ),
      })
    )
  );
  return useForm;
}
