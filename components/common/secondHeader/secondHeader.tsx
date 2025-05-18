import cn from "classnames";

import styles from "./secondHeader.module.scss";

type SecondHeaderProps = {
  children?: any;
  title?: string;
  customClass?: string;
  customTitleClass?: string;
};

function SecondHeader({
  children,
  title,
  customClass,
  customTitleClass,
}: SecondHeaderProps) {
  return (
    <div
      className={cn(
        styles.topContent,
        "flex wrap justify-between items-center -mx-4 md:-mx-10 py-3 px-4 md:px-10 gap-[10px]",
        customClass
      )}
    >
      <h3
        className={cn(styles.title, customTitleClass, "m-0 self-center text-xl font-semibold whitespace-nowrap")}
        dangerouslySetInnerHTML={{ __html: title || "" }}
      />
      <div className={cn(styles.actionGroup, "flex content-end items-center")}>
        {children}
      </div>
    </div>
  );
}

export default SecondHeader;
