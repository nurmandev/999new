import cn from 'classnames';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import { useEffect, useRef } from 'react';
import Flatpickr, { DateTimePickerProps } from 'react-flatpickr';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { useTranslation } from '@/base/config/i18next';
import { DATE_FORMAT_VALIDATE } from '@/base/constants/common';

import styles from './inputDatePicker.module.scss';

interface InputDateRangePickerProps<TFieldValues extends FieldValues> extends DateTimePickerProps {
  startName: Path<TFieldValues>;
  endName: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  pickerClass?: string;
  postfix?: string;
  prefix?: string;
  placeholder?: string;
  disabled?: boolean;
  innerKey?: string;
  disabledDate?: string[];
}
const InputDateRangePicker = <TFieldValues extends Record<string, unknown>>({
  control,
  startName,
  endName,
  onChange,
  customClass,
  pickerClass,
  postfix,
  prefix,
  placeholder,
  disabled = false,
  innerKey,
  disabledDate,
  ...rest
}: InputDateRangePickerProps<TFieldValues>) => {
  const { t, i18n } = useTranslation('common');
  const inputRef = useRef<Flatpickr | null>(null);

  useEffect(() => {
    if (inputRef.current?.flatpickr?.altInput) inputRef.current.flatpickr.altInput.disabled = disabled;
  }, [disabled]);

  useEffect(() => {
    const listDisabledDate = disabledDate?.map((date) => new Date(date)) || [];
    if (inputRef.current?.flatpickr?.config) inputRef.current.flatpickr.config.disable = listDisabledDate;
  }, [disabledDate]);

  return (
    <div className={customClass}>
      <Controller
        control={control}
        name={startName}
        render={({ field, fieldState: { error } }) => (
          <div className={styles.dateControl}>
            <Flatpickr
              key={innerKey ?? undefined}
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
              className={cn('form-field p-0 border-0', styles.dateFormControl, pickerClass, {
                [styles.invalid]: error?.message,
              })}
              options={{
                altFormat: DATE_FORMAT_VALIDATE,
                altInput: true,
                dateFormat: DATE_FORMAT_VALIDATE,
                disableMobile: true,
                locale: i18n.language === 'en' ? 'default' : Japanese,
                wrap: true,
                ...rest.options,
              }}
              onOpen={(selectedDates, _dateStr, instance) => {
                instance.setDate(selectedDates);
              }}
              onChange={(dates: Date[], ...self) => {
                field.onChange(dates);
                onChange?.(dates, ...self);
              }}
            >
              <input
                data-testid="label-input-date-picker"
                type="text"
                data-input
                className={cn(styles.input, { [styles.error]: error?.message }, 'w-100 form-control')}
                placeholder={t('affiliate:startDate') || ''}
              />
              <div className={cn(styles.toggle)} title="toggle" data-toggle>
                <span className="iconimgs-calendar" />
              </div>
            </Flatpickr>
            {postfix && <span className="postfix">{postfix}</span>}
            {prefix && <span className="prefix">{prefix}</span>}
            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        )}
      />
      <Controller
        control={control}
        name={endName}
        render={({ field, fieldState: { error } }) => (
          <div className={styles.dateControl}>
            <Flatpickr
              key={innerKey ?? undefined}
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
              className={cn('form-field p-0 border-0', styles.dateFormControl, pickerClass, {
                [styles.invalid]: error?.message,
              })}
              options={{
                altFormat: DATE_FORMAT_VALIDATE,
                altInput: true,
                dateFormat: DATE_FORMAT_VALIDATE,
                disableMobile: true,
                locale: i18n.language === 'en' ? 'default' : Japanese,
                wrap: true,
                ...rest.options,
              }}
              onOpen={(selectedDates, _dateStr, instance) => {
                instance.setDate(selectedDates);
              }}
              onChange={(dates: Date[], ...self) => {
                field.onChange(dates);
                onChange?.(dates, ...self);
              }}
            >
              <input
                data-testid="label-input-date-picker"
                type="text"
                data-input
                className={cn(styles.input, { [styles.error]: error?.message }, 'w-100 form-control')}
                placeholder={t('affiliate:endDate') || ''}
              />
              <div className={cn(styles.toggle)} title="toggle" data-toggle>
                <span className="iconimgs-calendar" />
              </div>
            </Flatpickr>
            {postfix && <span className="postfix">{postfix}</span>}
            {prefix && <span className="prefix">{prefix}</span>}
            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        )}
      />
    </div>
  );
};

export default InputDateRangePicker;
