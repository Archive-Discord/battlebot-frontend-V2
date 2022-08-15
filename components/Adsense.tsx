import { Adsense } from '@ctrl/react-adsense'

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'short' }) => {
	return <div className='py-5 px-2 dark:bg-battlebot-black'>
		<div
			className={`z-0 mx-auto w-full text-center text-white ${
				process.env.NODE_ENV === 'production' ? '' : 'py-12 bg-gray-700'
			}`}
			style={size === 'short' ? { height: '90px' } : { height: '330px' }}
		>
			{process.env.NODE_ENV === 'production' ? (
				<Adsense
					style={{ display: 'inline-block', width: '100%', height: size === 'short' ? '90px' : '330px'}}
					client='ca-pub-2701426579223876'
					slot='3805391793'
					format=''
				/>
			) : (
				'Advertisement'
			)}
		</div>
	</div>
}

declare global {
	interface Window {
		adsbygoogle: {
			loaded?: boolean
			push(obj: unknown): void
		}
	}
}

interface AdvertisementProps {
    size?: 'short' | 'tall'
}

export default Advertisement;
