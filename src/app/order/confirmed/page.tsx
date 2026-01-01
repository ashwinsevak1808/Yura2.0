"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main_layout";
import { CheckCircle, Package, Mail, Home, Download } from "lucide-react";
import { getOrderDetailsAction } from "@/app/actions/checkout";
import { InvoiceTemplate } from "@/components/admin/InvoiceTemplate";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    paymentMethod: "",
    razorpayPaymentId: "",
    razorpayOrderId: "",
  });

  const [fullOrderData, setFullOrderData] = useState<any>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  useEffect(() => {
    // Get order details from URL params (passed from checkout)
    const orderId = searchParams.get("order_id") || "";
    const paymentMethod = searchParams.get("payment_method") || "COD";
    const razorpayPaymentId = searchParams.get("razorpay_payment_id") || "";
    const razorpayOrderId = searchParams.get("razorpay_order_id") || "";

    setOrderDetails({
      orderId,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
    });

    // Fetch full order data for invoice if orderId exists
    if (orderId) {
      setLoadingInvoice(true);
      getOrderDetailsAction(orderId)
        .then(res => {
          if (res.success && res.order) {
            setFullOrderData(res.order);
          }
        })
        .finally(() => setLoadingInvoice(false));
    }
  }, [searchParams]);

  const isOnlinePayment = orderDetails.paymentMethod === "ONLINE";

  const handleDownloadReceipt = () => {
    // Trigger browser print, which uses the InvoiceTemplate's print styles
    window.print();
  };

  // Prepare Invoice Data if available
  const invoiceData = fullOrderData ? {
    id: fullOrderData.id,
    date: new Date(fullOrderData.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }),
    customer: {
      name: fullOrderData.customer_name,
      email: fullOrderData.customer_email,
      address: [
        fullOrderData.shipping_address?.street,
        fullOrderData.shipping_address?.city,
        fullOrderData.shipping_address?.state,
        fullOrderData.shipping_address?.zipCode,
        "India"
      ].filter(Boolean).join(", ")
    },
    items: (fullOrderData.items || []).map((item: any) => ({
      name: item.product_name,
      size: item.size,
      qty: item.quantity,
      price: item.price
    })),
    subtotal: fullOrderData.subtotal,
    shipping: fullOrderData.shipping_cost,
    total: fullOrderData.total_amount,
    payment_method: fullOrderData.payment_method === 'razorpay' ? 'Online' : 'COD',
    payment_status: fullOrderData.payment_status === 'paid' ? 'Paid' : 'Pending'
  } : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

        <div className="max-w-2xl mx-auto">

          {/* Success Icon */}
          <div className="bg-white p-12 text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-medium text-black mb-4 leading-tight">
              Order Confirmed!
            </h1>

            <p className="text-base text-gray-600 font-light mb-8 max-w-md mx-auto">
              Thank you for your order. We've received your order and will send you a confirmation email shortly.
            </p>

            {isOnlinePayment && (
              <div className="inline-block bg-green-50 px-6 py-3 mb-4">
                <p className="text-xs uppercase tracking-wider text-green-700 mb-1 font-bold">
                  Payment Status
                </p>
                <p className="text-lg font-medium text-green-800">PAID ✓</p>
              </div>
            )}

            <div className="inline-block bg-gray-50 px-6 py-3 mb-8">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Order Number</p>
              <p className="text-lg font-medium text-black">
                #{orderDetails.orderId ? orderDetails.orderId.slice(0, 8).toUpperCase() : Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>

            {/* Download Receipt Button - Only for Online Payments */}
            {isOnlinePayment && orderDetails.razorpayPaymentId && (
              <div className="mt-6">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={!invoiceData}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {loadingInvoice ? "Preparing..." : "Download Official Receipt"}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Payment ID: {orderDetails.razorpayPaymentId}
                </p>
              </div>
            )}
          </div>

          {/* What's Next Section */}
          <div className="bg-white p-8 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
              What's Next?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">Order Confirmation</h3>
                  <p className="text-sm text-gray-600 font-light">
                    You'll receive an email confirmation with your order details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">Order Processing</h3>
                  <p className="text-sm text-gray-600 font-light">
                    We'll start preparing your order for shipment within 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">Delivery</h3>
                  <p className="text-sm text-gray-600 font-light">
                    Your order will be delivered within 8-14 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-8 text-center">
            <p className="text-sm text-gray-600 font-light mb-6">
              Need help with your order? Contact us at{" "}
              <a href="mailto:info.yura.co@gmail.com" className="text-black hover:underline">
                info.yura.co@gmail.com
              </a>
            </p>

            <a
              href="/collections"
              className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>

      {/* Hidden Invoice Template for Print */}
      {invoiceData && (
        <div className="invisible h-0 w-0 overflow-hidden absolute top-0 left-0">
          <InvoiceTemplate invoice={invoiceData} />
        </div>
      )}
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      }>
        <OrderConfirmedContent />
      </Suspense>
    </MainLayout>
  );
}