import cn from 'classnames';
import { InputHTMLAttributes } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { UNICODE_NORMALIZATION } from '@/base/constants/common';
import { MAX_LENGTH, NUMBER_FULL_WIDTH } from '@/base/constants/validation';
import { EnumTypeInput } from '@/base/types/common';
import { InputTextType } from '@/base/types/form';

interface InputTextProps<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  postfix?: string;
  prefix?: string;
  maxLength?: number;
  dataErrorId?: string;
  invalid?: boolean;
  typeInput?: EnumTypeInput;
  isBlockSpecialCharacter?: boolean;
  isShowError?: boolean;
  ['data-testid']?: string;
}

const InputNumber = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  onBlur,
  customClass,
  postfix,
  prefix,
  maxLength,
  dataErrorId,
  invalid,
  typeInput = EnumTypeInput.TEXT,
  isBlockSpecialCharacter,
  isShowError = true,
  ...rest
}: InputTextProps<TFieldValues>) => {
  const handleChangeValue = (event: InputTextType, formOnChange: (event: InputTextType) => void) => {
    const numberMatched = (event.target.value ?? '').match(NUMBER_FULL_WIDTH);
    const value = numberMatched
      ? numberMatched
          .join('')
          .normalize(UNICODE_NORMALIZATION)
          .substring(0, maxLength || MAX_LENGTH)
      : '';
    const eventAfter = { ...event, target: { ...event.target, value } };
    onChange?.(eventAfter);
    formOnChange(eventAfter);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="flex-1 w-full">
            <input
              {...rest}
              {...field}
              name={name}
              className={cn(
                'dark:text-white text-color-light-text-primary w-full text-default rounded-default bg-transparent placeholder:text-color-text-primary outline-none',
                customClass,
                {
                  'border-color-red': !!error?.message,
                },
              )}
              value={(field.value ?? '') as string}
              onBlur={(event) => onBlur && onBlur(event)}
              onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
            />
            {postfix && (
              <span data-testid={`${rest['data-testid'] || ''}-input-postfix`} className="postfix">
                {postfix}
              </span>
            )}
            {prefix && (
              <span data-testid={`${rest['data-testid'] || ''}-input-prefix`} className="prefix">
                {prefix}
              </span>
            )}
            {isShowError && error?.message && <span className="text-color-red text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputNumber;
