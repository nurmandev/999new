type InstanceFlatPickr = {
  setDate: (date: Date | Date[], triggerChange?: boolean, format?: string) => void;
  toggle: () => void;
};
type InputTextType = React.ChangeEvent<HTMLInputElement>;
type InputTextareaType = React.ChangeEvent<HTMLTextAreaElement>;

export type { InstanceFlatPickr, InputTextType, InputTextareaType };
