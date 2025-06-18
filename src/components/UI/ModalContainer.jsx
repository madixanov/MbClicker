import './modal-container.css'
import close from '../../assets/icons/delete-sign.png'

const ModalContainer = ({ title, content, closeModal }) => {
    return (
        <div className="modal-container">
            <div className="modal-title">
                <h1 className="modal-title-h1">{title}</h1>
                <button type='button' onClick={closeModal}className="modal-title-button">
                    <img src={close} alt="Закрыть" />
                </button>
            </div>
            {content}
        </div>
    )
}

export default ModalContainer;