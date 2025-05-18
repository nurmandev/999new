import cn from 'classnames';
import { useTheme } from 'next-themes';
import { InputHTMLAttributes } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { MAX_LENGTH, SPECIAL_CHARACTER, SPECIAL_CHARACTER_WITHOUT_EMAIL } from '@/base/constants/validation';
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
  ['data-testid']?: string;
}

const InputText = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  customClass,
  postfix,
  prefix,
  maxLength,
  dataErrorId,
  invalid,
  typeInput = EnumTypeInput.TEXT,
  isBlockSpecialCharacter,
  ...rest
}: InputTextProps<TFieldValues>) => {
  const handleChangeValue = (event: InputTextType, formOnChange: (event: InputTextType) => void) => {
    let data = '';
    if (typeInput === EnumTypeInput.EMAIL) {
      data = event.target.value.replace(SPECIAL_CHARACTER_WITHOUT_EMAIL, '').substring(0, maxLength || MAX_LENGTH);
    } else if (isBlockSpecialCharacter) {
      data = event.target.value.replace(SPECIAL_CHARACTER, '').substring(0, maxLength || MAX_LENGTH);
    } else {
      data = event.target.value.substring(0, maxLength || MAX_LENGTH);
    }
    const eventAfter = { ...event, target: { ...event.target, value: data } };
    onChange?.(eventAfter);
    formOnChange(eventAfter);
  };
  const { theme } = useTheme();

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
                'dark:bg-color-input-primary bg-color-light-bg-primary dark:text-white text-color-light-text-primary w-full text-default rounded-default placeholder:text-color-text-primary outline-none border-[1px] border-solid border-transparent focus-within:border-color-primary',
                customClass,
                {
                  'dark-autofill': theme !== 'light',
                  'light-autofill': theme === 'light',
                },
                {
                  'border-color-red border border-solid': !!error?.message,
                },
              )}
              value={(field.value ?? '') as string}
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
            {error?.message && <span className="text-color-red text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputText;
