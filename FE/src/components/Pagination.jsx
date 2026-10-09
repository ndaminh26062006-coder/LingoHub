import './Pagination.css';

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  console.log('Pagination props:', { currentPage, lastPage });
  if (lastPage <= 1) {
    console.log('Pagination hidden: lastPage <= 1');
    return null; // Don't show if only 1 page
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page buttons

    if (lastPage <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < lastPage - 2) pages.push('...');
      if (!pages.includes(lastPage)) pages.push(lastPage);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        className="pagination__btn pagination__btn--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Trước
      </button>

      {/* Page numbers */}
      <div className="pagination__numbers">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="pagination__dots">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              className={`pagination__num ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        className="pagination__btn pagination__btn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        Tiếp →
      </button>

      {/* Info */}
      <span className="pagination__info">
        Trang {currentPage} / {lastPage}
      </span>
    </div>
  );
}
