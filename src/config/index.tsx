import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

export const projectId = '1230a5b83282f5ffb02c715153c73680';

const metadata = {
    name: 'stakepro',
    description: 'stakepro',
    url: 'https://www.stakepro.org',
    icons: ['https://stakepro.org/logo.jpeg']
}

export const networks = [bsc] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
    ssr: false,
    projectId,
    networks,
})
export const config = wagmiAdapter.wagmiConfig