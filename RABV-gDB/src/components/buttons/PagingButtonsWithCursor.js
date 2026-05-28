import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import AlignmentDownload from "components/buttons/AlignmentDownload";
import MetaDataDownload from "./MetaDataDownload";

const PagingButtonsWithCursor = ({
    filters,
    totalCount,
    nextCursor,
    prevCursor,
    setParams,
    cursorReset
  }) => {

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startNum, setStartNum] = useState(1);
  const [endNum, setEndNum] = useState(10);


  const handleFirstPage = () => {
    setParams({ items_per_page: itemsPerPage, exclusion_status: "0", ...filters });
    setStartNum(1);
    setEndNum(itemsPerPage);
  };

  const handleNextPage = () => {
    setParams({ next_cursor: nextCursor, items_per_page: itemsPerPage,exclusion_status: "0", ...filters });
    setStartNum(prev => prev + itemsPerPage);
    setEndNum(prev => prev + itemsPerPage);
  };

  const handlePreviousPage = () => {
    setParams({ prev_cursor: prevCursor, items_per_page: itemsPerPage, exclusion_status: "0", ...filters });
    setStartNum(prev => prev - itemsPerPage);
    setEndNum(prev => prev - itemsPerPage);
  };

  const handleLastPage = () => {
    const start = Math.max(totalCount - itemsPerPage + 1, 1);
    setParams({ prev_cursor: 0, items_per_page: itemsPerPage, exclusion_status: "0", ...filters });
    setStartNum(start);
    setEndNum(totalCount);
  };

  const onItemsPerPageChange = (num) => {
    setItemsPerPage(num);
    setParams({ items_per_page: num, ...filters });
    setStartNum(1);
    setEndNum(num);
  };
  
  useEffect(() => {
    handleFirstPage()
  }, [cursorReset]); 
  
  return (
    <>
      <div className="d-flex align-items-center gap-1 flex-wrap">

        <Button size="sm" className="paging-buttons" disabled={!prevCursor || startNum == 1} onClick={handleFirstPage}>
          First
        </Button>

        <div className="btn-group">
          <Button size="sm" className="paging-buttons" disabled={!prevCursor || startNum == 1} onClick={handlePreviousPage}>
            Previous
          </Button>

          <Button size="sm" className="paging-buttons" disabled={!nextCursor || endNum == totalCount} onClick={handleNextPage}>
            Next
          </Button>
        </div>

        <Button size="sm" className="paging-buttons" disabled={!nextCursor || endNum == totalCount} onClick={handleLastPage}>
          Last
        </Button>

        <div className="dropdown">
          <Button
            size="sm"
            className="dropdown-toggle paging-buttons"
            data-bs-toggle="dropdown"
          >
            Items per page: {itemsPerPage}
          </Button>

          <div className="dropdown-menu">
            {[10, 25, 50].map(num => (
              <button
                key={num}
                className="dropdown-item"
                onClick={() => onItemsPerPageChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="ms-auto d-flex align-items-center gap-2">
          <div className="dropdown">
            <Button className="dropdown-toggle paging-buttons" data-bs-toggle="dropdown">
              Download
            </Button>

            <div className="dropdown-menu dropdown-menu-end">
              <div className="dropdown-item">
                <MetaDataDownload
                  filters={ {filters} }
                /> 
              </div>
              <div className="dropdown-item">
                <AlignmentDownload
                  filters={{ filters }}
                  sequences_count={totalCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='size-12-font'>
        Sequences {startNum.toLocaleString()} to {endNum.toLocaleString()} of{" "}
        {totalCount ? totalCount.toLocaleString() : "-"}
      </div>
    </>
  );
};

export default PagingButtonsWithCursor;