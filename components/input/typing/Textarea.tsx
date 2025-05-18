import cn from 'classnames';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

import { TEXTAREA_ROWS_NUM_DEFAULT } from '@/base/constants/common';
import { MAX_LENGTH, SPECIAL_CHARACTER } from '@/base/constants/validation';
import { InputTextareaType } from '@/base/types/form';

import styles from './typing.module.scss';

interface TextareaProps<TFieldValues extends FieldValues> extends TextareaAutosizeProps {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  customClass?: string;
  postfix?: string;
  prefix?: string;
  maxLength?: number;
  isBlockInputWithMaxLength?: boolean;
  isShowLength?: boolean;
  isBlockSpecialCharacter?: boolean;
  ['data-testid']?: string;
}

const Textarea = <TFieldValues extends Record<string, unknown>>({
  control,
  name,
  onChange,
  customClass,
  postfix,
  prefix,
  maxLength,
  isBlockInputWithMaxLength,
  isShowLength,
  isBlockSpecialCharacter,
  minRows,
  ...rest
}: TextareaProps<TFieldValues>) => {
  const handleChangeValue = (event: InputTextareaType, formOnChange: (event: InputTextareaType) => void) => {
    let data = event.target.value;
    if (isBlockSpecialCharacter) {
      data = data.replace(SPECIAL_CHARACTER, '');
    }
    if (isBlockInputWithMaxLength) {
      data = data.substring(0, maxLength || MAX_LENGTH);
    }
    const eventAfter = { ...event, target: { ...event.target, value: data } };
    onChange?.(eventAfter);
    formOnChange(eventAfter);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <>
          <div className={cn('textarea-custom', { 'is-invalid': !!error?.message }, styles.wrapTextarea)}>
            <div className={cn(styles.pullWrap)}></div>
            <TextareaAutosize
              {...rest}
              name={name}
              minRows={minRows || TEXTAREA_ROWS_NUM_DEFAULT}
              className={cn(
                'input-base focus:ring-blue-500 focus:border-blue-500 block w-full outline-0 shadow-none',
                customClass,
                {
                  'border-red-500': !!error?.message,
                },
              )}
              value={(field.value ?? '') as string}
              onChange={(event: InputTextareaType) => handleChangeValue(event, field.onChange)}
            />
            {isShowLength && (
              <div className="count-label" data-testid="textarea-count-label">
                <span
                  className={cn('input-count', {
                    'error-input-count': maxLength && String(field.value || '').length > maxLength,
                  })}
                >
                  {String(field.value || '').length}
                </span>
                {maxLength ? `/${maxLength}` : ''}
              </div>
            )}
          </div>
          {postfix && (
            <span data-testid="textarea-postfix" className="postfix">
              {postfix}
            </span>
          )}
          {prefix && (
            <span data-testid="textarea-prefix" className="prefix">
              {prefix}
            </span>
          )}
          {error?.message && <span className="text-red-500 text-[12px]"> {error?.message}</span>}
        </>
      )}
    />
  );
};
export default Textarea;
