import Button from './Button.jsx';


export default function SearchBar() {

    return(
            <div className='flex'>
                <input
                    type='text'
                    placeholder='🔍 Search a product...'
                    className='mx-2 p-1 grow border-2 rounded-md'
                />
                <div className='mx-2'>
                    <Button label='+ Add product' variant='primary' size='lg'/>
                </div>
                <div className='mx-2'>
                    <Button label='Delete' variant='danger' size='lg' />
                </div>
            </div>

    )
}