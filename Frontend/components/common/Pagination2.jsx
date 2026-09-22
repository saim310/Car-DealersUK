"use client";

import React, { useState, useEffect } from "react";

export default function Pagination2({ 
  totalPages = 1, 
  currentPage = 1, 
  onPageChange = null 
}) {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageClick = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setPage(pageNum);
      if (onPageChange) {
        onPageChange(pageNum);
      }
    }
  };

  return (
    <>
      {totalPages > 1 ? (
        <React.Fragment>
          <li onClick={() => handlePageClick(page - 1)}>
            <a className={`page-numbers style`} style={{ fontSize: "30px" }}>
              &lsaquo;
            </a>
          </li>
          {[...Array(totalPages)].slice(0, 4).map((_, index) => {
            const pageNum = index + 1;
            return (
              <li key={pageNum}>
                <a
                  className={`page-numbers ${
                    page === pageNum ? "current" : ""
                  }`}
                  onClick={() => handlePageClick(pageNum)}
                  style={{ cursor: "pointer" }}
                >
                  {pageNum}
                </a>
              </li>
            );
          })}
          {page >= 5 && (
            <li>
              <a className={`page-numbers current`}>{page}</a>
            </li>
          )}
          {totalPages >= 5 && page != totalPages && (
            <li className=" dot-pagination">
              <a className={`page-numbers dot`}>...</a>
            </li>
          )}
          <li onClick={() => handlePageClick(page + 1)}>
            <a className={`page-numbers style`} style={{ fontSize: "30px" }}>
              &rsaquo;
            </a>
          </li>
        </React.Fragment>
      ) : (
        ""
      )}
    </>
  );
}
