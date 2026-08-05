import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

export const projectId = 'f7c2bdcf89cf1c1fe82b876889a34b78';

const metadata = {
    name: 'MoneyMartx',
    description: 'MoneyMartx',
    url: 'https://www.moneymartx.com',
    icons: ['https://moneymartx.com/logo.jpeg']
}

export const networks = [bsc] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
    ssr: false,
    projectId,
    networks,
})
export const config = wagmiAdapter.wagmiConfig