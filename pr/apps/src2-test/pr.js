async function checkCanMakePayment(request) {
  if (!request.canMakePayment) {
    return;
  }

  try {
    const result = await request.canMakePayment();
    info(result ? "Can make payment" : "Cannot make payment");
  } catch (e) {
    error('Can make payment: ' + e.toString());
  }
}

async function checkHasEnrolledInstrument(request) {
  if (!request.hasEnrolledInstrument) {
    return;
  }

  try {
    const result = await request.hasEnrolledInstrument();
    info(result ? "Has enrolled instrument" : "No enrolled instrument");
  } catch (e) {
    error('Has enrolled instrument: ' + e.toString());
  }
}

function buildPaymentRequest() {
  if (!window.PaymentRequest) {
    error('PaymentRequest API is not supported.');
    return null;
  }

  const supportedInstruments = [{
    supportedMethods: 'https://rsolomakhin.github.io/pr/apps/src2',
  }];

  const details = {
    total: {
      label: 'Payment',
      amount: {
        currency: 'USD',
        value: '1.00'
      }
    }
  };

  let request = null;

  try {
    request = new PaymentRequest(supportedInstruments, details);
  } catch (e) {
    error('Payment request: ' + e.toString());
    return null;
  }

  checkCanMakePayment(request);
  checkHasEnrolledInstrument(request);

  return request;
}

let request = buildPaymentRequest();

async function onBuyClicked() { // eslint-disable-line no-unused-vars
  if (!request) {
    return;
  }

  clearAllMessages();

  try {
    const instrumentResponse = await request.show()
    await instrumentResponse.complete('success');
    done('This is a demo website. No payment will be processed.', instrumentResponse);
  } catch (e) {
    error(e.toString());
    request = buildPaymentRequest();
  }
}
