import * as readline from 'readline';

interface PaymentRules {
  maxLimit: number;
}

interface PaymentSession {
  paymentId: string;
  cc: string;
  amount: number;
  time: string;
}

interface PaymentState {
  paymentId: string;
  availableLimit: number;
  violations: string[];
}

class PaymentAuthorizer {
  private paymentRules: PaymentRules = { maxLimit: 0 };
  private paymentSessions = new Map<string, PaymentState>();

  public async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    for await (const line of rl) {
      const operation = JSON.parse(line);
      if ('payment-rules' in operation) {
        this.handlePaymentRules(operation['payment-rules']);
      } else if ('payment-session' in operation) {
        this.handlePaymentSession(operation['payment-session']);
      } else {
        this.handlePaymentAuthorization(operation);
      }
    }
  }

  private handlePaymentRules(paymentRules: PaymentRules) {
    this.paymentRules = paymentRules;
    console.log(JSON.stringify({ paymentRules }));
  }

  private handlePaymentSession(paymentSession: PaymentSession) {
    const paymentId = paymentSession.paymentId;
    if (this.paymentSessions.has(paymentId)) {
      console.log(JSON.stringify({ paymentSession: { paymentId }, violations: ['payment-session-already-initialized'] }));
      return;
    }

    this.paymentSessions.set(paymentId, { paymentId, availableLimit: this.paymentRules.maxLimit, violations: [] });
    console.log(JSON.stringify({ paymentSession: { paymentId, availableLimit: this.paymentRules.maxLimit }, violations: [] }));
  }

  private handlePaymentAuthorization(payment: PaymentSession) {
    const paymentId = payment.paymentId;
    if (this.paymentRules.maxLimit === 0) {
      console.log(JSON.stringify({ payment, violations: ['paymentrules-not-initialized'] }));
      return;
    }

    if (!this.paymentSessions.has(paymentId)) {
      console.log(JSON.stringify({ payment, violations: ['paymentsession-not-initialized'] }));
      return;
    }

    const state = this.paymentSessions.get(paymentId)!;
    if (state.availableLimit < payment.amount) {
      console.log(JSON.stringify({ payment, violations: ['insufficient-limit'] }));
      return;
    }

    this.paymentSessions.set(paymentId, { ...state, availableLimit: state.availableLimit - payment.amount });
    console.log(JSON.stringify({ payment, violations: [] }));
  }
}

const authorizer = new PaymentAuthorizer();
authorizer.start();