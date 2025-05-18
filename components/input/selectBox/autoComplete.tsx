import cn from "classnames";
import clsx from "clsx";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import ReactSelect, {
  CSSObjectWithLabel,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  Props,
  StylesConfig,
  components,
} from "react-select";

import {
  INPUT_PLACEHOLDER_COLOR,
  SELECT_BOX_BORDER_COLOR,
  SELECT_BOX_BORDER_COLOR_FOCUSED,
  SELECT_BOX_MENU_PORTAL_Z_INDEX,
} from "@/base/constants/common";
import { ObjectLiteral, PaginationResponse } from "@/types/common";

import styles from "./selectBox.module.scss";

const DropdownIndicator = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>
) => {
  if (props.hasValue) return null;
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <span
          className={cn("iconimgs-chevron-down", styles.selectDropdown, {
            [styles.isFocused]: props.isFocused,
          })}
          data-testid="dropdown-indicator"
        />
      </components.DropdownIndicator>
    )
  );
};

interface AutocompleteProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  noOptionsMessageString?: string;
  ["data-testid"]?: string;
  handleSuggestion: (
    keyword: string,
    page?: number
  ) => Promise<{ data: any[]; pagination?: PaginationResponse }>;
}

const Autocomplete = <
  TFieldValues extends Record<string, unknown>,
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  handleSuggestion,
  control,
  name,
  noOptionsMessageString,
  onChange,
  ...rest
}: Props<Option, IsMulti, Group> & AutocompleteProps<TFieldValues>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyWord, setKeyWord] = useState<string>("");
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  const [paginator, setPaginator] = useState<PaginationResponse>();

  const callSuggestion = useCallback(
    debounce((inputValue = "") => {
      setKeyWord(inputValue);
      handleSuggestion(inputValue)
        .then(({ data, pagination }) => {
          setCurrentOptions([...data]);
          setPaginator(pagination);
        })
        .catch(() => setCurrentOptions([]))
        .finally(() => setIsLoading(false));
    }, 500),
    [handleSuggestion]
  );

  const handleLoadOptions = useCallback(
    (inputValue = "") => {
      setIsLoading(true);
      callSuggestion(inputValue);
    },
    [callSuggestion]
  );

  const handleLoadMoreOptions = useCallback(
    debounce(() => {
      if (isLoading || !paginator?.next) return;
      setIsLoading(true);
      handleSuggestion?.(keyWord, paginator.next)
        .then(({ data, pagination }) => {
          setCurrentOptions([...currentOptions, ...data]);
          setPaginator(pagination);
        })
        .finally(() => setIsLoading(false));
    }, 500),
    [isLoading, paginator?.next, keyWord]
  );

  const style: StylesConfig<Option, IsMulti, Group> = {
    control: (
      base: CSSObjectWithLabel,
      state: ControlProps<Option, IsMulti, Group>
    ) => ({
      ...base,
      fontSize: "1rem",
      boxShadow: "0",
      borderColor: state.isFocused
        ? SELECT_BOX_BORDER_COLOR_FOCUSED
        : SELECT_BOX_BORDER_COLOR,
      "&:hover": {
        borderColor: SELECT_BOX_BORDER_COLOR,
      },
      borderRadius: "0.375rem",
      padding: "0.0625rem",
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      fontSize: "0.875rem",
      color: INPUT_PLACEHOLDER_COLOR,
    }),
    menuPortal: (base: CSSObjectWithLabel) => ({
      ...base,
      zIndex: SELECT_BOX_MENU_PORTAL_Z_INDEX,
    }),
    input: (base: CSSObjectWithLabel) => ({ ...base, boxShadow: "none" }),
    singleValue: (base: CSSObjectWithLabel) => ({ ...base, whiteSpace: "pre" }),
  };

  useEffect(() => {
    handleLoadOptions();
  }, []);

  return (
    <div
      className={styles.selectCustom}
      data-testid={rest["data-testid"] || "select-box"}
    >
      <Controller
        control={control}
        name={name as Path<TFieldValues>}
        render={({ field, fieldState: { error } }) => (
          <>
            <ReactSelect
              onInputChange={handleLoadOptions}
              options={currentOptions}
              isLoading={isLoading}
              className={clsx(
                "form-control-select",
                { invalid: error?.message },
                styles.selectCustomControl,
                rest.className
              )}
              classNamePrefix={clsx(rest.classNamePrefix, "hook-select")}
              onMenuScrollToBottom={handleLoadMoreOptions}
              isClearable
              menuPlacement="auto"
              {...rest}
              {...(field as ObjectLiteral)}
              styles={style}
              onChange={(newValue, actionMeta) => {
                field.onChange(newValue);
                onChange?.(newValue, actionMeta);
              }}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: isLoading ? () => null : DropdownIndicator,
                LoadingMessage: () => (
                  <div className="p-1 py-2 flex justify-center">...</div>
                ),
              }}
              noOptionsMessage={() => noOptionsMessageString || ""}
            />
            {error?.message && <span className="error-msg">{error?.message}</span>}
          </>
        )}
      />
    </div>
  );
};

export default Autocomplete;
