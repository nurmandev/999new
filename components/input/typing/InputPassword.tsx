import cn from 'classnames';
import { Eye, EyeSlash } from 'iconsax-react';
import { useTheme } from 'next-themes';
import { InputHTMLAttributes, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { MAX_LENGTH, REGEX_JAPANESE_CHARACTERS, SPECIAL_CHARACTER } from '@/base/constants/validation';
import { EnumTypeInput } from '@/base/types/common';
import { InputTextType } from '@/base/types/form';

interface InputTextProps<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  maxLength?: number;
  dataErrorId?: string;
  invalid?: boolean;
  isBlockSpecialCharacter?: boolean;
  isAutoComplete?: string;
  isAutoFocus?: boolean;
  ['data-testid']?: string;
}

const InputPassword = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  customClass,
  maxLength,
  dataErrorId,
  invalid,
  isBlockSpecialCharacter,
  isAutoFocus = false,
  isAutoComplete = 'off',
  ...rest
}: InputTextProps<TFieldValues>) => {
  const [showPass, setShowPass] = useState(false);
  const { theme } = useTheme();

  const handleChangeValue = (event: InputTextType, formOnChange: (event: InputTextType) => void) => {
    let data = '';
    if (isBlockSpecialCharacter) {
      data = event.target.value.replace(SPECIAL_CHARACTER, '').substring(0, maxLength || MAX_LENGTH);
    } else {
      data = event.target.value.substring(0, maxLength || MAX_LENGTH);
    }
    const eventAfter = {
      ...event,
      target: {
        ...event.target,
        value: data
          .replace(REGEX_JAPANESE_CHARACTERS, '')
          .substring(0, maxLength || MAX_LENGTH)
          .trim(),
      },
    };
    onChange?.(eventAfter);
    formOnChange(eventAfter);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex-1 w-full">
          <div
            className={cn(
              'dark:bg-color-input-primary bg-color-light-bg-primary rounded-default flex items-center px-[10px] py-[10px] gap-[18px] text-default border-[1px] border-solid border-transparent focus-within:border-color-primary',
              customClass,
              {
                'dark-autofill': theme !== 'light',
                'light-autofill': theme === 'light',
              },
            )}
          >
            <input
              {...rest}
              {...field}
              name={name}
              autoComplete={isAutoComplete}
              autoFocus={isAutoFocus}
              type={showPass ? EnumTypeInput.TEXT : EnumTypeInput.PASSWORD}
              value={(field.value ?? '') as string}
              onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
              className={cn(
                'w-full bg-transparent focus:outline-none text-default dark:text-white text-black',

                {
                  'border-red-500': !!error?.message,
                },
              )}
            />
            {showPass ? (
              <Eye className="dark:text-[#C4C4C4] text-black cursor-pointer" onClick={() => setShowPass(!showPass)} />
            ) : (
              <EyeSlash
                className="dark:text-[#C4C4C4] text-black cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              />
            )}
          </div>

          {error?.message && <span className="text-red-500 text-des"> {error?.message}</span>}
        </div>
      )}
    />
  );
};
export default InputPassword;
