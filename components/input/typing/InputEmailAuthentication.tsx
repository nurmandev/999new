import cn from 'classnames';
import Image from 'next/image';
import { InputHTMLAttributes } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { MAX_LENGTH, SPECIAL_CHARACTER, SPECIAL_CHARACTER_WITHOUT_EMAIL } from '@/base/constants/validation';
import { EnumTypeInput } from '@/base/types/common';
import { InputTextType } from '@/base/types/form';
import { useTheme } from 'next-themes';

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
  autoComplete?: string;
}

const InputEmailAuthentication = <TFieldValues extends Record<string, unknown>>({
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
  autoComplete,
  ...rest
}: InputTextProps<TFieldValues>) => {
  const { theme } = useTheme();
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

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="w-full flex-1">
            <div
              className={cn(
                'bg-white dark:bg-color-input-primary rounded-default flex items-center h-[46px] py-[10px] px-[15px] gap-[18px] border-[1px] border-solid focus-within:border-color-primary border-transparent',
                {
                  'dark-autofill': theme !== 'light',
                  'light-autofill': theme === 'light',
                },
              )}
            >
              <Image width={20} height={20} src="/img/icon/icon-mail.png" alt="mail" />
              <div className="w-[1px] h-[13px] bg-[#C3CDDB]" />
              <input
                {...rest}
                {...field}
                name={name}
                value={(field.value ?? '') as string}
                autoComplete={autoComplete}
                onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
                className={cn(
                  'w-full bg-white dark:bg-color-bg-primary focus:outline-none text-default gap-[18px] text-black dark:text-white',
                  customClass,
                  {
                    'border-color-red': !!error?.message,
                  },
                )}
              />
            </div>
            {error?.message && <span className="text-color-red text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputEmailAuthentication;
