import cn from "classnames";

interface IDiedModal {
    open: boolean;
    onSubmit: () => void;
    onClose: () => void;
}

export const DiedModal = ({open, onClose, onSubmit}: IDiedModal) => {
    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            ></div>

            <div
                className={cn(
                    "fixed inset-0 flex items-center justify-center z-50 transition-transform",
                    open ? "scale-100 opacity-100" : "scale-95 opacity-0"
                )}
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                    <h2 className="text-xl font-semibold mb-4">Вы погибли!</h2>
                    <p className="mb-6">Хотите возродиться?</p>
                    <div className="flex justify-around">
                        <button
                            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                            onClick={onSubmit}
                        >
                            Возродиться
                        </button>
                        <button
                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                            onClick={onClose}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
