// "use client";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

// interface TransactionPaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export function TransactionPagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: TransactionPaginationProps) {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   const showEllipsisStart = currentPage > 3;
//   const showEllipsisEnd = currentPage < totalPages - 2;

//   const visiblePages = pages.filter((page) => {
//     if (page === 1 || page === totalPages) return true;
//     if (page >= currentPage - 1 && page <= currentPage + 1) return true;
//     return false;
//   });

//   return (
//     <Pagination>
//       <PaginationContent>
//         <PaginationItem>
//           <PaginationPrevious
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           />
//         </PaginationItem>

//         {visiblePages.map((page, index) => {
//           if (
//             index > 0 &&
//             showEllipsisStart &&
//             visiblePages[index - 1] !== page - 1
//           ) {
//             return (
//               <PaginationItem key={`ellipsis-${page}`}>
//                 <PaginationEllipsis />
//               </PaginationItem>
//             );
//           }

//           return (
//             <PaginationItem key={page}>
//               <PaginationLink
//                 isActive={page === currentPage}
//                 onClick={() => onPageChange(page)}
//               >
//                 {page}
//               </PaginationLink>
//             </PaginationItem>
//           );
//         })}

//         {showEllipsisEnd && (
//           <PaginationItem>
//             <PaginationEllipsis />
//           </PaginationItem>
//         )}

//         <PaginationItem>
//           <PaginationNext
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           />
//         </PaginationItem>
//       </PaginationContent>
//     </Pagination>
//   );
// }