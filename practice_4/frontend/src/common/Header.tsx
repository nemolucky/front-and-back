interface Props {
	onOpen: () => void
}

export function Header({ onOpen }: Props) {
	return (
		<header className='flex justify-between'>
			<h1 className='text-3xl font-bold mb-8 text-gray-800'>Products</h1>
			<div className=''>
				<button
					className='bg-gray-500 text-white py-2 px-4 rounded-lg'
					onClick={onOpen}
				>
					<span className='mr-2'>+</span>
					Create
				</button>
			</div>
		</header>
	)
}
