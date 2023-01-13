# payment authorization module

Module to authorize credit and debit payments that validates certain rules listed as violations in the output 


## Business Rules

* No payments should be accepted without a properly rules initialization: `paymentrules-not-initialized`
* No payments should be accepted without a properly initialized payment:
`paymentsession-not-initialized`
* The transaction amount should not exceed the global limit: `insufficient-limit`
* There should not be more than 3 payments on a 2-minute interval:
`high-frequency-small-interval` (the input order cannot be relied upon since
transactions can eventually be out of order respectively to their times)
* There should not be more than 1 similar transactions (same amount and credit card) in a
2 minutes interval: `doubled-transaction`


### How to run

```
npm install
```
```
tsc index.ts
```
```
node index.js
```


#### Input

The input is a JSON following the next structure 

```json
{"payment-rules": {"max-limit": 100}}
```
```json
{"payment-session": {"payment-id": 89087653}}
```
```json
{"payment-session": {"payment-id": 89087653, "cc": "visa", "amount": 120, "time": "2022-02-13T10:00:00.000Z"}}
```
