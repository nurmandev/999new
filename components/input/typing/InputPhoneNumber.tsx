import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { ArrowDown2 } from 'iconsax-react';
import { useTheme } from 'next-themes';
import { Fragment, InputHTMLAttributes, useEffect, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { COUNTRY_CALLING_CODES } from '@/base/constants/countryCallingCode';
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
  onChangeCountryCallingCode: (data: (typeof COUNTRY_CALLING_CODES)[number]) => void;
}

const InputPhoneNumber = <TFieldValues extends Record<string, unknown>>({
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
  onChangeCountryCallingCode,
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

  const [countryCallingCodes, setCountryCallingCode] = useState(COUNTRY_CALLING_CODES);
  const [activeCountry, setActiveCountry] = useState(COUNTRY_CALLING_CODES[0]);

  useEffect(() => {
    onChangeCountryCallingCode(activeCountry);
  }, [activeCountry]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="w-full flex-1">
            <div
              className={cn(
                'dark:bg-color-input-primary bg-white rounded-default flex items-center py-[10px] px-[15px] gap-[8px] h-[46px] relative border-[1px] border-solid focus-within:border-color-primary border-transparent',
                customClass,
                {
                  'dark-autofill': theme !== 'light',
                  'light-autofill': theme === 'light',
                },
              )}
            >
              <Menu>
                <Menu.Button className="text-default flex items-center gap-[4px] cursor-pointer min-w-[45px]">
                  <div className="flex-1">+{activeCountry.countryCallingCode}</div>
                  <ArrowDown2 className="w-[11px]" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute bg-color-bg-primary w-full h-[250px] overflow-y-auto left-0 cursor-pointer rounded top-[55px]">
                    {countryCallingCodes.map((country, index) => {
                      return (
                        <Menu.Item as={Fragment} key={index}>
                          {({ active }) => (
                            <div
                              className={`${active ? 'bg-gray-700 ' : ''} ${country.countryCode === activeCountry.countryCode &&
                                'border border-color-primary border-solid'
                                } flex p-2 text-des text-gray-400 my-1 mx-1 rounded text-left`}
                              onClick={() => setActiveCountry(country)}
                            >
                              <div className="flex-1">{country.country}</div>
                              <div>+{country.countryCallingCode}</div>
                            </div>
                          )}
                        </Menu.Item>
                      );
                    })}
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className="w-[1px] h-[13px] bg-[#C3CDDB]" />
              <input
                {...rest}
                {...field}
                name={name}
                value={(field.value ?? '') as string}
                autoComplete={autoComplete}
                onChange={(event: InputTextType) => handleChangeValue(event, field.onChange)}
                className={cn(
                  'w-full focus:outline-none text-default bg-transparent dark:text-white text-color-light-text-primary',
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
export default InputPhoneNumber;
