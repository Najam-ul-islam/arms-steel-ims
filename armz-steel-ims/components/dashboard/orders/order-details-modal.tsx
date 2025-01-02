
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Order as PrismaOrder } from "@prisma/client";

interface OrderItem {
  id: string;
  product: {
    name: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order extends PrismaOrder {
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailsModal = ({
  open,
  onClose,
  order,
}: OrderDetailsModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload the page to restore app state
    }
  };

  if (!order) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">
            Order Details - {order.orderNumber}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div ref={printRef} className="p-8 space-y-8">
          {/* Invoice Header */}
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold text-center">Invoice</h1>
            <div className="flex justify-between text-sm mt-2">
              <p>
                <strong>Company Name:</strong> Arms Steel<br />
                <strong>Address:</strong> kallar sayedan road Raja Markeet opposite <br />unhon council ghazanabad
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {/* {new Date(order.createdAt).toLocaleString()} <br /> */}
                {new Date().toLocaleDateString()} <br />
                <strong>Invoice Number:</strong> {order.orderNumber}<br />
                <strong>NTN:</strong>
              </p>
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm">
                <strong>Type:</strong> {order.type}
              </p>
              <p className="text-sm">
                <strong>Status:</strong>{" "}
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-600 rounded-lg">
                  {order.status}
                </span>
              </p>
              <p className="text-sm">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              {/* <p className="text-sm">
                <strong>Supplier:</strong> {order.supplier}
              </p> */}
              {order.type === "SALES" ? (
                <p className="text-sm">
                  <strong>Customer:</strong>{" "}
                  {order.customer
                    ? order.customer
                    : "Customer name not available"}
                </p>
              ) : (
                <p className="text-sm">
                  <strong>Supplier:</strong>{" "}
                  {order.supplier
                    ? order.supplier
                    : "Supplier name not available"}
                </p>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left">
                    Product
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {item.product.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      Rs.{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      Rs.{item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Amount */}
          <p className="text-lg font-semibold text-right">
            Total: Rs.{order.totalAmount.toFixed(2)}
          </p>

          {/* Notes Section */}
          <div>
            <p className="font-medium text-gray-700">
              <strong>Notes:</strong>
            </p>
            <div className="mt-2 p-4 border rounded-md text-gray-800 bg-gray-50">
              {order.notes || "No notes provided."}
            </div>
          </div>

          {/* Invoice Footer */}
          {/* <div className="border-t pt-4 mt-8">
            <p className="text-center text-sm text-gray-600">
              Thank you for your business! <br />
              For inquiries, contact us at: armssteel31@gmail.com | +123 456 789
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};


