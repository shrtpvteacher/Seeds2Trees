import '../assets/styles/app.css'

const Info = ({ account, accountBalance }) => {
    return (
        <div className="info-cover my-3">
            <p  className='tag-1'><strong>Account:</strong> {account}</p>
            <p  className='tag-2'><strong>Tokens Owned:</strong> {accountBalance}</p>
        </div>
    );
}

export default Info;{/* Account Info */}
