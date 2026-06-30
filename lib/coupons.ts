import type { Coupon } from "./cms";

export interface CouponResult {
  ok: boolean;
  discount: number; // ₹ amount taken off
  message: string;
  coupon?: Coupon;
}

/**
 * Validate a coupon code against an order amount. Pure function so it can run
 * on the checkout page (client) — the coupons come from the public CMS API.
 */
export function applyCoupon(coupons: Coupon[], rawCode: string, amount: number): CouponResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, discount: 0, message: "Enter a coupon code." };

  const coupon = coupons.find((c) => (c.title || "").trim().toUpperCase() === code);
  if (!coupon) return { ok: false, discount: 0, message: "Invalid coupon code." };
  if (coupon.status !== "Active") return { ok: false, discount: 0, message: "This coupon is no longer active." };

  if (coupon.expires) {
    const end = new Date(`${coupon.expires}T23:59:59`).getTime();
    if (!Number.isNaN(end) && Date.now() > end) {
      return { ok: false, discount: 0, message: "This coupon has expired." };
    }
  }

  if (coupon.minAmount && amount < coupon.minAmount) {
    return { ok: false, discount: 0, message: `Minimum order ₹${coupon.minAmount} required for this coupon.` };
  }

  const raw = coupon.type === "Percent" ? (amount * coupon.value) / 100 : coupon.value;
  const discount = Math.max(0, Math.min(Math.round(raw), amount));
  if (discount <= 0) return { ok: false, discount: 0, message: "This coupon gives no discount on this order." };

  return {
    ok: true,
    discount,
    message: `Coupon applied — you saved ₹${discount.toLocaleString("en-IN")}!`,
    coupon,
  };
}

/** Time left until a coupon expires (for a countdown), or null. */
export function couponTimeLeft(coupon: Coupon): number | null {
  if (!coupon.expires) return null;
  const end = new Date(`${coupon.expires}T23:59:59`).getTime();
  if (Number.isNaN(end)) return null;
  return Math.max(0, end - Date.now());
}
