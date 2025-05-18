import cn from 'classnames';
import { Code1 } from 'iconsax-react';
import { InputHTMLAttributes } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { UNICODE_NORMALIZATION } from '@/base/constants/common';
import { MAX_LENGTH, NUMBER_FULL_WIDTH } from '@/base/constants/validation';
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
}

const InputCodeAuthentication = <TFieldValues extends Record<string, unknown>>({
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
  const { theme } = useTheme();
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
          <div className="w-full flex-1 ">
            <div
              className={cn('bg-white dark:bg-white rounded-[10px] flex items-center p-[15px] gap-[18px] ', {
                'dark-autofill': theme !== 'light',
                'light-autofill': theme === 'light',
              })}
            >
              <Code1 width={20} />
              <div className="w-[1px] h-[13px] bg-[#C3CDDB]" />
              <input
                {...rest}
                {...field}
                name={name}
                className={cn(
                  'w-full bg-[#f5f6fa] dark:bg-[#12181F] focus:outline-none text-[14px] text-white',
                  customClass,
                  {
                    'border-red-500': !!error?.message,
                  },
                )}
                value={(field.value ?? '') as string}
                onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
              />
            </div>
            {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
          </div>
        );
      }}
    />
  );
};
export default InputCodeAuthentication;
