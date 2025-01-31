import axios from 'axios';

interface IGetPublicKeyResponse {
  keys: {
    kty: string;
    kid: string;
    use: string;
    alg: string;
    n: string;
    e: string;
  }[];
}

export default {
  getPublicKey: async (kid: string) => {
    const response = await axios.get<IGetPublicKeyResponse>(
      'https://appleid.apple.com/auth/keys',
    );

    const key = response.data.keys.find((key) => key.kid === kid);

    if (!key) {
      throw new Error('Invalid identity token');
    }

    return key;
  },
};
