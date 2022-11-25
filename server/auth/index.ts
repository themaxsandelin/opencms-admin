// Dependencies
import { Router, Request, Response } from 'express';
import { ConfidentialClientApplication, CryptoProvider, ResponseMode } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: (process.env.AUTH_CLIENT_ID as string),
    authority: (process.env.AUTH_CLIENT_AUTHORITY as string),
    clientSecret: (process.env.AUTH_CLIENT_SECRET as string)
  }
};
const redirectUri = `${process.env.APP_URL}/auth/redirect`;

const msal = new ConfidentialClientApplication(msalConfig);
const cryptoProvider = new CryptoProvider();
const router = Router({ mergeParams: true });

router.get('/login', async (req: Request, res: Response) => {
  try {
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    req.session.pkceCodes = {
      challengeMethod: 'S256',
      verifier,
      challenge,
    };
    req.session.csrfToken = cryptoProvider.createNewGuid();

    req.session.authCodeUrlRequest = {
      redirectUri,
      responseMode: ResponseMode.FORM_POST,
      codeChallenge: req.session.pkceCodes.challenge,
      codeChallengeMethod: req.session.pkceCodes.challengeMethod,
      state: cryptoProvider.base64Encode(
        JSON.stringify({
          csrfToken: req.session.csrfToken,
          redirectTo: '/'
        })
      ),
      scopes: [],
    };

    req.session.authCodeRequest = {
      redirectUri,
      code: '',
      scopes: []
    };

    const authCodeUrlResponse = await msal.getAuthCodeUrl(req.session.authCodeUrlRequest);
    res.redirect(authCodeUrlResponse);
  } catch (error) {
    console.error('Login error', error);
    res.redirect('/login');
  }
});

router.post('/redirect', async (req: Request, res: Response) => {
  try {
    if (req.body.state) {
      const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));
      if (state.csrfToken === req.session.csrfToken && req.session.authCodeRequest && req.session.pkceCodes) {
        req.session.authCodeRequest.code = req.body.code;
        req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier

        const tokenResponse = await msal.acquireTokenByCode(req.session.authCodeRequest);
        req.session.accessToken = tokenResponse.accessToken;
        req.session.idToken = tokenResponse.idToken;
        req.session.account = tokenResponse.account;
        req.session.isAuthenticated = true;

        return res.redirect(state.redirectTo);
      }
    }
    res.redirect('/login');
  } catch (error) {
    console.error('Redirect auth error', error);
    res.redirect('/login');
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

export default router;
