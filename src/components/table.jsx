import { useState } from 'react'

const TableComponent = ({ columns, data, perPageOptions = [5, 10, 20] }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(perPageOptions[1])

  // Pagination logic
  const totalPages = Math.ceil(data.length / perPage)
  const paginatedData = data.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="w-full py-4">
      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white">
        {/* Table Head */}
        <thead>
          <tr className="text-left border-b border-gray-300">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 font-medium text-gray-800">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-300">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-gray-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        {/* Per Page Dropdown */}
        <div>
          <label className="text-gray-700 font-medium mr-2">Rows per page:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value))
              setCurrentPage(1) // Reset to first page
            }}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none bg-white"
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`bg-white px-3 py-1 border border-gray-300 rounded-md text-sm ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            Prev
          </button>

          <span className="text-gray-700 font-medium px-3">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`bg-white px-3 py-1 border border-gray-300 rounded-md text-sm ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableComponent
