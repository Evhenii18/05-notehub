import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={5}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={(event) => {
        onPageChange(event.selected + 1);
      }}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageLinkClassName={css.pageLink}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakLinkClassName={css.pageLink}
      disableInitialCallback
    />
  );
};

export default Pagination;
