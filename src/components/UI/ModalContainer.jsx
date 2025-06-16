import { IoCloseOutline } from "react-icons/io5";
import './modal-container.css'


const ModalContainer = ({ title, content, closeModal }) => {
    return (
        <div className="modal-container">
            <div className="modal-title">
                <h1 className="modal-title-h1">{title}</h1>
                <button onClick={closeModal}className="modal-title-button"><IoCloseOutline /></button>
            </div>
            {content}
        </div>
    )
}

export default ModalContainer;