import { ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';

type BreadcrumbsProps = {
  data: { title: string; href: string }[];
  endpoint: { title: string; href: string };
};

export const Breadcrumbs = ({ data, endpoint }: BreadcrumbsProps) => {
  return (
    <div className="flex items-center gap-[10px] py-[5px] px-[10px] dark:bg-color-card-header-primary bg-white rounded-[5px] w-fit">
      {data.map((item, index) => {
        return (
          <div key={index} className="flex items-center gap-[10px]">
            <Link href={item.href} className="text-[#99a4b0] text-[14px] dark:hover:text-white">
              {item.title}
            </Link>
            <ArrowRight2 size={12} className="text-[#99a4b0]" />
          </div>
        );
      })}
      <Link
        href={endpoint.href}
      >
        <h1 className="dark:text-white text-color-light-text-primary hover:text-color-light-text-primary text-[14px] dark:hover:text-white">{endpoint.title}</h1>
      </Link>
    </div>
  );
};
