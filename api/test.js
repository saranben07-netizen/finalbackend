import crypto from 'crypto';

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const digest = hmac.digest('base64');
  return digest === signature;
}

verifySignature()