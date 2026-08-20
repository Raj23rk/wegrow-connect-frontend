// =====================================================
// RAZORPAY CHECKOUT SERVICE
// =====================================================

export function loadRazorpaySDK() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpaySubscriptionCheckout({
  plan,
  user,
  onSuccess,
  onError,
}) {
  const isLoaded = await loadRazorpaySDK();

  if (!isLoaded) {
    alert("Unable to load Razorpay payment SDK. Please check your network connection.");
    if (onError) onError(new Error("SDK load failed"));
    return;
  }

  // Get test key from env or fallback
  const razorpayKey =
    import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1DP5Aqq4652W8w";

  const numericPrice =
    typeof plan.price === "number"
      ? plan.price
      : parseFloat(String(plan.price || "0").replace(/[^0-9.]/g, "")) || 0;

  // Razorpay expects amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(numericPrice * 100);

  const planName = plan.name || plan.title || "Subscription Plan";
  const planType = plan.type || "STUDENT";

  const options = {
    key: razorpayKey,
    amount: amountInPaise > 0 ? amountInPaise : 100, // min 1 INR for test checkout
    currency: plan.currency || "INR",
    name: "WeGrow Skill Campus",
    description: `${planName} (${planType})`,
    image: "https://wegrow-connect.com/logo.png",
    handler: function (response) {
      console.log("RAZORPAY PAYMENT SUCCESS:", response);

      const paymentResult = {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id || `ORD-${Date.now()}`,
        signature: response.razorpay_signature || "",
        planId: plan.id || plan._id,
        planName: planName,
        planType: planType,
        amount: numericPrice,
        currency: plan.currency || "INR",
        status: "Active",
        paidAt: new Date().toISOString(),
      };

      if (onSuccess) {
        onSuccess(paymentResult);
      }
    },
    prefill: {
      name: user?.name || user?.fullName || user?.firstName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Subscriber User",
      email: user?.email || "subscriber@wegrow.com",
      contact: user?.phone || "9999999999",
    },
    notes: {
      planId: plan.id || plan._id,
      planType: planType,
    },
    theme: {
      color: "#2563eb",
    },
    modal: {
      ondismiss: function () {
        console.log("Razorpay checkout modal dismissed by user");
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Failed to open Razorpay modal:", error);
    if (onError) onError(error);
  }
}
