export const isWebAuthnSupported = () => {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
};

export const registerBiometric = async (username: string) => {
  if (!isWebAuthnSupported()) return false;
  
  // In a real scenario, this would come from a server challenge
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);
  
  const publicKey = {
    challenge: challenge,
    rp: { name: "LaMi Dubai", id: window.location.hostname },
    user: {
      id: new TextEncoder().encode(username),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: { userVerification: "required" },
    timeout: 60000,
  };

  try {
    const credential = await navigator.credentials.create({ publicKey } as any);
    // Store credential ID in localStorage
    localStorage.setItem('lami_authn_cred_id', (credential as any).id);
    return true;
  } catch (err) {
    console.error("WebAuthn Registration Error:", err);
    return false;
  }
};

export const authenticateBiometric = async () => {
  if (!isWebAuthnSupported()) return false;
  const credId = localStorage.getItem('lami_authn_cred_id');
  if (!credId) return false;

  const publicKey = {
    challenge: new Uint8Array(32), // Should be server-provided
    allowCredentials: [{
      id: new TextEncoder().encode(credId),
      type: 'public-key',
    }],
    userVerification: 'required',
  };

  try {
    await navigator.credentials.get({ publicKey } as any);
    return true;
  } catch (err) {
    console.error("WebAuthn Auth Error:", err);
    return false;
  }
};
