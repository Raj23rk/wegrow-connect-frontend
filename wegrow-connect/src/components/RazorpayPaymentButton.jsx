import React, { useState } from 'react';
import { API_ROOT } from '../services/config';
import { loadRazorpaySDK } from '../services/razorpay';

/**
 * Production-ready Razorpay Payment Button
 * 
 * Implements the standard 3-step checkout flow:
 * 1. Load Razorpay Checkout Script (if not present)
 * 2. POST /api/create-order -> creates Razorpay Order on server
 * 3. POST /api/verify-payment -> verifies HMAC signature on server
 */
export default function RazorpayPaymentButton({
  amount = 1, // Amount (₹500 default)
  inRupees = true, // Whether amount is in Rupees (converted to paise for Razorpay)
  currency = 'INR',
  purpose = 'COURSE_PURCHASE',
  receipt = null,
  customer = {
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '9876543210',
  },
  notes = {},
  description = 'Course Enrollment',
  companyName = 'WeGrow Skill Campus',
  logoUrl = '/favicon.ico',
  themeColor = '#3399cc',
  buttonText = null,
  disabled = false,
  className = '',
  style = {},
  children,
  onSuccess,
  onError,
  onDismiss,
}) {
  const [loading, setLoading] = useState(false);

  // Compute amount in paise (Razorpay standard: ₹1 = 100 paise)
  const numericAmount = Number(amount) || 500;
  const amountInPaise = inRupees ? Math.round(numericAmount * 100) : Math.round(numericAmount);
  const displayRupees = inRupees ? numericAmount : (numericAmount / 100);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // STEP 1: Ensure Razorpay SDK script is loaded
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded || !window.Razorpay) {
        const errorMsg = 'Failed to load Razorpay SDK. Please check your internet connection.';
        if (onError) onError(new Error(errorMsg));
        else alert(errorMsg);
        return;
      }

      // Base URL from centralized config (http://localhost:4000 locally or live API)
      const baseUrl = API_ROOT || 'http://localhost:4000';

      // STEP 2: Call backend to create Razorpay order
      const orderPayload = {
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        purpose,
        customer: {
          name: customer?.name || 'Customer',
          email: customer?.email || 'customer@example.com',
          phone: (customer?.phone || '9876543210').replace(/[^0-9]/g, '').slice(-10),
        },
        notes: notes || {},
      };

      const orderRes = await fetch(`${baseUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        const errMsg = orderData?.message || 'Error generating Razorpay order on server';
        throw new Error(errMsg);
      }

      // Unpack order response (handles direct and nested data payloads)
      const unwrappedOrder = orderData?.data || orderData;
      const orderId = unwrappedOrder?.order_id || unwrappedOrder?.orderId || orderData?.order_id;
      const orderKeyId = unwrappedOrder?.key_id || unwrappedOrder?.keyId || orderData?.key_id || import.meta.env?.VITE_RAZORPAY_KEY_ID;

      if (!orderId) {
        throw new Error(orderData?.message || 'Server did not return a valid order_id');
      }

      // STEP 3: Configure Razorpay Checkout options
      const options = {
        key: orderKeyId,
        amount: unwrappedOrder?.amount || amountInPaise,
        currency: unwrappedOrder?.currency || currency,
        name: companyName,
        description: description,
        image: logoUrl,
        order_id: orderId,
        prefill: {
          name: customer?.name || '',
          email: customer?.email || '',
          contact: (customer?.phone || '').replace(/[^0-9]/g, '').slice(-10),
        },
        theme: {
          color: themeColor,
        },
        notes: {
          purpose,
          ...notes,
        },
        handler: async function (response) {
          // STEP 4: Verify payment HMAC signature on backend
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await fetch(`${baseUrl}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyPayload),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success !== false) {
              const verifiedResult = {
                success: true,
                orderId: response.razorpay_order_id || orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                serverData: verifyData.data || verifyData,
              };

              if (onSuccess) {
                onSuccess(verifiedResult);
              } else {
                alert('✅ Payment Successful & Verified on Server!');
              }
            } else {
              const failureMsg = verifyData?.message || 'Payment signature verification failed on server.';
              if (onError) onError(new Error(failureMsg));
              else alert(`❌ ${failureMsg}`);
            }
          } catch (err) {
            console.error('Signature verification error:', err);
            const errObj = new Error(err?.message || 'Failed to verify payment with backend');
            if (onError) onError(errObj);
            else alert(`❌ ${errObj.message}`);
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay payment modal closed by user');
            if (onDismiss) onDismiss();
          },
        },
      };

      // STEP 5: Open Razorpay modal
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (resp) {
        console.error('Razorpay payment failed:', resp?.error);
        const errMsg = resp?.error?.description || 'Payment failed';
        if (onError) onError(new Error(errMsg));
        else alert(`❌ Payment failed: ${errMsg}`);
      });

      rzp.open();
    } catch (error) {
      console.error('Razorpay Payment Error:', error);
      if (onError) {
        onError(error);
      } else {
        alert(error.message || 'Payment initiation failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const defaultStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: themeColor,
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '15px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.7 : 1,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(51, 153, 204, 0.25)',
    ...style,
  };

  return (
    <button
      id="razorpay-checkout-button"
      onClick={handlePayment}
      disabled={disabled || loading}
      style={defaultStyle}
      className={className}
      type="button"
    >
      {loading ? (
        <>
          <svg
            style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children || buttonText || `Pay ₹${displayRupees.toLocaleString('en-IN')} with Razorpay`
      )}
    </button>
  );
}
