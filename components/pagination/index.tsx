import { LIST_PER_PAGE_SELECT } from '@/base/constants/common';
import React from 'react';
import ReactPaginate from 'react-paginate';

// components

interface IProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
  disabled?: boolean;
  currentPerPage: number;
  totalItem: number;
  showingFrom: number;
}

const PaginationPerPage: React.FC<IProps> = ({
  pageCount,
  currentPage,
  onPageChange,
  disabled = false,
  currentPerPage,
  totalItem,
  showingFrom,
}) => {

	const showTo = () => {
    const toItem = currentPage * currentPerPage;
    return toItem < totalItem ? toItem : totalItem;
  };

  const getCurrentValue = () => {
    return LIST_PER_PAGE_SELECT.find((page) => page.value === String(currentPerPage)) || LIST_PER_PAGE_SELECT[0];
  };
	
  return (
    <div className="flex flex-col items-center mt-3 px-4 md:justify-between md:items-end md:flex-row gap-[5px]">
      <div className="text-black font-normal">
        {showingFrom} to {showTo()} of {totalItem} results
      </div>
      <ReactPaginate
        pageCount={pageCount}
        previousLabel={<span className="icon-pagination iconimgs-chevron-left text-gray-400 text-12px" />}
        nextLabel={<span className="icon-pagination iconimgs-chevron-right text-gray-400 text-12px" />}
        breakLabel={'...'}
        onPageChange={onPageChange}
        breakClassName={'page-item w-[42px] h-[40px] leading-tight text-gray-500 bg-white border-r border-y border-solid border-gray-300 hover:bg-gray-100 hover:text-gray-700'}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        containerClassName={'mb-0 flex justify-center px-3 react-paginate'}
        pageClassName={`page-item w-[42px] h-[40px] leading-tight text-black font-semibold bg-white border-r border-y border-solid border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
        pageLinkClassName="block page-link h-full w-full flex items-center justify-center"
        activeClassName={'active'}
        previousClassName={`rounded-l page-item w-[42px] h-[40px] page-link leading-tight text-gray-500 bg-white border border-solid border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
        previousLinkClassName="block page-link h-full w-full flex items-center justify-center"
        nextClassName={`rounded-r page-item w-[42px] h-[40px] page-link leading-tight text-gray-500 bg-white border-l-0 border border-solid border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
        nextLinkClassName="block page-link h-full w-full flex items-center justify-center"
        breakLinkClassName="block page-link h-full w-full flex items-center justify-center"
      />
    </div>
  );
};

export default PaginationPerPage;
