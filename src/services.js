import Onboard from 'bnc-onboard'

const networkId = 42;
const dappId = '12153f55-f29e-4f11-aa07-90f10da5d778';

export function initOnboard(subscriptions) {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: 'metamask' },
      ]
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ]
  })
}