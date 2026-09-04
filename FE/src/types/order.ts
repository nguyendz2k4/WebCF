/**
 * Order & Receipt Types for Aura Coffee Solutions
 * Provides typed interface architecture for current manual flow and future backend integration.
 */

export type OrderPaymentMethod = 'vietqr' | 'cod';

export type OrderVerificationStatus =
  | 'pending_verification' // Default initial state for manual bank-transfer / COD
  | 'confirmed'            // Staff verified payment / inventory
  | 'processing'           // Warehousing / preparation
  | 'dispatched'           // In transit
  | 'cancelled';           // Cancelled by staff or customer

export interface AuraOrderReceiptState {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  province: string;
  paymentMethod: OrderPaymentMethod;
  totalAmount: number;
  formattedTotal: string;
  status: OrderVerificationStatus;
  createdAt: string;
  /**
   * Explanatory notes indicating manual review status.
   * Does NOT claim online payment success.
   */
  verificationNote: string;
}
