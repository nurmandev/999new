import cn from "classnames";
import { Japanese } from "flatpickr/dist/l10n/ja";
import { useEffect, useRef } from "react";
import Flatpickr, { DateTimePickerProps } from "react-flatpickr";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { useTranslation } from "@/base/config/i18next";
import { TIME_FORMAT_VALIDATE } from "@/base/constants/common";
import styles from "./inputTimePicker.module.scss";

interface InputTimePickerProps<TFieldValues extends FieldValues>
  extends DateTimePickerProps {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  postfix?: string;
  prefix?: string;
  placeholder?: string;
  disabled?: boolean;
}
const InputTimePicker = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  customClass,
  postfix,
  prefix,
  placeholder,
  disabled = false,
  ...rest
}: InputTimePickerProps<TFieldValues>) => {
  const { i18n } = useTranslation("common");
  const inputRef = useRef<Flatpickr | null>(null);

  useEffect(() => {
    if (inputRef.current?.flatpickr?.hourElement)
      inputRef.current.flatpickr.hourElement.value = "";
    if (inputRef.current?.flatpickr?.minuteElement)
      inputRef.current.flatpickr.minuteElement.value = "";
  }, [rest.options?.maxTime, rest.options?.minTime]);

  useEffect(() => {
    if (inputRef.current?.flatpickr?.altInput)
      inputRef.current.flatpickr.altInput.disabled = disabled;
  }, [disabled]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={styles.timeControl}>
          <Flatpickr
            {...rest}
            {...field}
            name={field.name}
            value={field.value as string | undefined}
            ref={(ref) => {
              inputRef.current = ref;
              field.ref({
                focus: () => null,
              });
            }}
            className={cn("form-field p-0", styles.timeFormControl, customClass, {
              [styles.invalid]: error?.message,
            })}
            options={{
              altFormat: TIME_FORMAT_VALIDATE,
              altInput: true,
              enableTime: true,
              noCalendar: true,
              dateFormat: TIME_FORMAT_VALIDATE,
              disableMobile: true,
              time_24hr: true,
              locale: i18n.language === "en" ? "default" : Japanese,
              wrap: true,
              ...rest.options,
            }}
            onChange={(dates: Date[], ...self) => {
              field.onChange(dates);
              onChange?.(dates, ...self);
            }}
          >
            <input
              type="text"
              data-input
              className={cn(
                styles.input,
                { [styles.error]: error?.message },
                "w-100 form-control"
              )}
              placeholder={placeholder || ""}
            />
          </Flatpickr>
          {postfix && <span className="postfix">{postfix}</span>}
          {prefix && <span className="prefix">{prefix}</span>}
          {error?.message && (
            <span className="text-red-500 text-[12px]"> {error?.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default InputTimePicker;
