import { memo } from "react"

const InstructionList = memo(() => {
    return (
        <div className="instruction-container">
            <div className="instruction-title">
                <h2>ИНСТРУКЦИЯ</h2>
                <button>?</button>
            </div>
            <ol className="instruction-list">
                <li>ВВЕДИТЕ КОЛИЧЕСТВО</li>
                <li>НАЖМИТЕ 'ПОЛУЧИТЬ'</li>
                <li>ВЫ БУДЕТЕ ПЕРЕНАПРАВЛЕНЫ В БОТА</li>
                <li>БОТ ДАС ВАМ ССЫЛКУ НА ИНСТРУКЦИЮ</li>
                <li>ГОТОВО</li>
            </ol>
        </div>
    )
})

export default InstructionList