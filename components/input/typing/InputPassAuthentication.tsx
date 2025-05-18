import cn from 'classnames';
import { Eye, EyeSlash } from 'iconsax-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { InputHTMLAttributes, useState } from 'react';
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
  autoComplete?: string;
}

const InputPassAuthentication = <TFieldValues extends Record<string, unknown>>({
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
  const [showPass, setShowPass] = useState(false);

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
                'bg-white dark:bg-color-input-primary rounded-default flex items-center py-[10px] px-[15px] gap-[18px] border-[1px] border-solid focus-within:border-color-primary border-transparent',
                {
                  'dark-autofill': theme !== 'light',
                  'light-autofill': theme === 'light',
                },
              )}
            >
              <Image width={20} height={20} src="/img/icon/icon-pass.png" alt="pass" />
              <div className="w-[1px] h-[13px] bg-[#C3CDDB]" />
              <input
                {...rest}
                {...field}
                name={name}
                type={showPass ? EnumTypeInput.TEXT : EnumTypeInput.PASSWORD}
                value={(field.value ?? '') as string}
                autoComplete={autoComplete}
                onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
                className={cn(
                  'w-full bg-transparent focus:outline-none text-default text-black dark:text-white',
                  customClass,
                  {
                    'border-color-red': !!error?.message,
                  },
                )}
              />
              {showPass ? (
                <Eye variant="Bold" className="text-[#C4C4C4]" onClick={() => setShowPass(!showPass)} />
              ) : (
                <EyeSlash variant="Bold" className="text-[#C4C4C4]" onClick={() => setShowPass(!showPass)} />
              )}
            </div>

            {error?.message && <span className="text-color-red text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputPassAuthentication;
