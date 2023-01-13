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
  cc: string;
  amount: number;
  time: string | number | Date;
  paymentId: string;
  availableLimit: number;
  violations: string[];
}

class PaymentAuthorizer {
  private paymentRules: PaymentRules = { maxLimit: 0 };
  private paymentSessions: Array<PaymentState> = [];
  private paymentDates: Array<Date> = [];
  private duplicatedPayments:Array<PaymentState> = [];


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
      } else if ('payment-rules-log' in operation) {
        this.handlePaymentRulesLog(operation['payment-rules-log']);
      } else if ('payment-session' in operation) {
        if(operation['payment-session'].hasOwnProperty('cc')== true && operation['payment-session'].hasOwnProperty('amount') == true && operation['payment-session'].hasOwnProperty('time') == true) {
          this.handlePaymentAuthorization(operation['payment-session']);
        } else {
        this.handlePaymentSession(operation['payment-session']);
        }
      } else if ('payment-sessions-log' in operation) {
        this.handlePaymentSessionsLog(operation['payment-sessions-log']);
      } 
    }
  }

  private handlePaymentRules(paymentRules: PaymentRules) {
    this.paymentRules = paymentRules;
    console.log(JSON.stringify({ paymentRules }));
  }

  private handlePaymentRulesLog(paymentRules: PaymentRules) {
    console.log(JSON.stringify(paymentRules));
  }

  private handlePaymentSession(paymentSession: PaymentSession) {
    const paymentId = paymentSession['payment-id'];

    // Check if session already exist: 'payment-session-already-initialized'
    let sessionIndex = this.paymentSessions.findIndex(session => session.paymentId === paymentId);
    if (sessionIndex !== -1) {
      console.log(JSON.stringify({ paymentSession: { paymentId }, violations: ['payment-session-already-initialized'] }));
      return;
    }

    this.paymentSessions.push({
      paymentId: paymentId, 
      availableLimit: this.paymentRules['max-limit'], 
      violations: [],
      time: '',
      cc: '',
      amount: 0
    });

    console.log(JSON.stringify({ paymentSession: { paymentId, availableLimit: this.paymentRules.maxLimit }, violations: [] }));
  }

  private handlePaymentSessionsLog(paymentSession: PaymentSession) {
      console.log(JSON.stringify(paymentSession));
  }

  private handlePaymentAuthorization(payment: PaymentSession) {
    
    const paymentId = payment['payment-id'];
    let violations: string[] = []

    // No payments should be accepted without a properly rules initialization: `paymentrules-not-initialized`
    if (this.paymentRules.maxLimit === 0) {
      violations.push('paymentrules-not-initialized')
    }

    const sessionIndex = this.paymentSessions.findIndex(session => session.paymentId === paymentId);

    const foundPaymentObject = this.paymentSessions.find(session => session.paymentId === paymentId);

    if(foundPaymentObject != undefined){
      foundPaymentObject.time = payment['time']
      foundPaymentObject.cc = payment['cc']
      foundPaymentObject.amount = payment['amount']
    }
    
    // No payments should be accepted without a properly initialized payment: `paymentsession-not-initialized`
    if (sessionIndex === -1) {
      violations.push('paymentsession-not-initialized')
    }

    if(violations.length>0){
      console.log(JSON.stringify({ payment, violations }));
      return;
     }

    const state = foundPaymentObject ;

    if(state != undefined) {
      // The transaction amount should not exceed the global limit: `insufficient-limit`
      if (state.availableLimit < payment.amount) {
        console.log(JSON.stringify({ payment, violations: ['insufficient-limit'] }));
        return;
      }

      this.paymentDates.push(new Date(state.time))
      this.duplicatedPayments.push({
        time: state.time,
        cc: '',
        amount: state.amount,
        paymentId: '',
        availableLimit: 0,
        violations: []
      })

      const twoMinutes = 2 * 60 * 1000;

      // The should not have been 3 transactions in a two minutes interval: `high-frequency-small-interval`
      this.paymentDates.sort((a, b) => a.getTime() - b.getTime());
      for (let i = 0; i < this.paymentDates.length - 2; i++) {
          const diff1 = this.paymentDates[i + 1].getTime() - this.paymentDates[i].getTime();
          const diff2 = this.paymentDates[i + 2].getTime() - this.paymentDates[i + 1].getTime();
          if (diff1 <= twoMinutes && diff2 <= twoMinutes) {
            this.paymentDates.pop()
            console.log(JSON.stringify({ payment, violations: ['high-frequency-small-interval'] }));
            return;
          }
      }
      
      // Same session id should not have 2 transactions with the same amount in a two minutes interval: `doubled-transaction`
      for (let i = 0; i < this.duplicatedPayments.length; i++) {
          for (let j = i + 1; j < this.duplicatedPayments.length; j++) {
              if (this.duplicatedPayments[i].paymentId === this.duplicatedPayments[j].paymentId && this.duplicatedPayments[i].amount === this.duplicatedPayments[j].amount) {
                  const diff = new Date(this.duplicatedPayments[j].time).getTime() - new Date(this.duplicatedPayments[i].time).getTime();
                  if (diff <= twoMinutes) {
                    this.duplicatedPayments.pop()
                    console.log(JSON.stringify({ payment, violations: ['doubled-transaction'] }));
                    return;
                  }
              }
          }
      }

      // update the state of payment session 
      state.cc = payment.cc;
      state.amount = payment.amount;
      state.time = payment.time;
      state.availableLimit -= payment.amount;
    }
    console.log(JSON.stringify({ state, violations: [] }));
  }
}

const authorizer = new PaymentAuthorizer();
authorizer.start();