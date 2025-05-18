import cn from 'classnames';
import { useId } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import ReactSelect, { components, createFilter, Props } from 'react-select';
import {
  ControlProps,
  CSSObjectWithLabel,
  DropdownIndicatorProps,
  GroupBase,
  StylesConfig,
} from 'react-select/dist/declarations/src';

import {
  INPUT_PLACEHOLDER_COLOR,
  SELECT_BOX_BORDER_COLOR,
  SELECT_BOX_BORDER_COLOR_FOCUSED,
  SELECT_BOX_MENU_PORTAL_Z_INDEX,
} from '@/base/constants/common';
import { ObjectLiteral } from '@/types/common';

import styles from './selectBox.module.scss';

const DropdownIndicator = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
  if (props.hasValue) return null;
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span
          className={cn('iconimgs-chevron-down', styles.selectDropdown, {
            [styles.isFocused]: props.isFocused,
          })}
          data-testid="dropdown-indicator"
        />
      </components.DropdownIndicator>
    )
  );
};

interface SelectBoxProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  noOptionsMessageString?: string;
  clearValueWhenSearch?: boolean;
  customClass?: string;
  ['data-testid']?: string;
}

const SelectBox = <
  TFieldValues extends Record<string, unknown>,
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  control,
  name,
  onChange,
  customClass,
  noOptionsMessageString,
  clearValueWhenSearch,
  ...rest
}: Props<Option, IsMulti, Group> & SelectBoxProps<TFieldValues>) => {
  const style: StylesConfig<Option, IsMulti, Group> = {
    control: (base: CSSObjectWithLabel, state: ControlProps<Option, IsMulti, Group>) => ({
      ...base,
      backgroundColor: '#2F4466',
      fontSize: '0.875rem',
      color: '#FFF !important',
      boxShadow: '0',
      borderColor: state.isFocused ? SELECT_BOX_BORDER_COLOR_FOCUSED : SELECT_BOX_BORDER_COLOR,
      borderWidth: state.isFocused ? '2px' : '1px',
      borderRadius: '0rem',
      padding: '0.0625rem',
      minHeight: '36px',
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      boxShadow: 'none',
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      fontSize: '0.875rem',
      color: INPUT_PLACEHOLDER_COLOR,
    }),
    menuPortal: (base: CSSObjectWithLabel) => ({
      ...base,
      zIndex: SELECT_BOX_MENU_PORTAL_Z_INDEX,
    }),
    singleValue: (base: CSSObjectWithLabel) => ({ ...base, whiteSpace: 'pre', fontSize: '0.875rem' }),
  };

  const instanceId = useId();

  return (
    <div className={styles.selectCustom} data-testid={rest['data-testid'] || 'select-box'}>
      <Controller
        control={control}
        name={name as Path<TFieldValues>}
        render={({ field, fieldState: { error } }) => (
          <>
            <ReactSelect
              instanceId={instanceId}
              className={cn(
                'form-control-select text-gray-400',
                customClass,
                { invalid: error?.message },
                styles.selectCustomControl,
              )}
              classNamePrefix="hook-select !border-none !text-gray-400 !rounded-default "
              {...rest}
              {...(field as ObjectLiteral)}
              styles={style}
              onChange={(newValue, actionMeta) => {
                field.onChange(newValue);
                onChange?.(newValue, actionMeta);
              }}
              onInputChange={(newValue) => {
                if (newValue && clearValueWhenSearch) field.onChange(null);
              }}
              filterOption={createFilter({ ignoreCase: true })}
              menuPlacement="auto"
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator,
              }}
              noOptionsMessage={() => noOptionsMessageString || ''}
            />
            {!rest.menuIsOpen && error?.message && <span className="text-red-500 text-[12px]">{error?.message}</span>}
          </>
        )}
      />
    </div>
  );
};
export default SelectBox;
