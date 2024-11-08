import React, { useState, useRef } from 'react';
import '98.css';

const WorkerService = () => {
    const [workerId, setWorkerId] = useState(''); // ID работника
    const [worker, setWorker] = useState(null); // Данные о работнике
    const [field, setField] = useState(''); // Поле для обновления
    const [value, setValue] = useState(''); // Значение для обновления
    const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке
    const [isLoading, setIsLoading] = useState(false); // Статус загрузки
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
    const [mode, setMode] = useState(null); // Выбор режима (получить информацию, удалить или обновить)
    const [successMessage, setSuccessMessage] = useState(''); // Сообщение об успешном удалении работника

    // Состояния для перетаскивания иконки
    const [iconPosition, setIconPosition] = useState({ x: 20, y: 20 });
    const [dragging, setDragging] = useState(false);
    const iconRef = useRef(null); // Ссылка на иконку
    const windowRef = useRef(null); // Ссылка на окно

    const [workerData, setWorkerData] = useState({
        name: '',
        coordinates: { x: '', y: '' },
        creationDate: '',
        salary: '',
        startDate: '',
        status:'',
        position: '',
        person: {
            birthday: '',
            passportID: '',
            hairColor: '',
            nationality: '',
        },
    });

    // Перетаскивание иконки
    const startDrag = (e) => {
        setDragging(true);
        e.preventDefault();
    };

    const onDrag = (e) => {
        if (dragging) {
            setIconPosition({
                x: e.clientX - iconRef.current.clientWidth / 2,
                y: e.clientY - iconRef.current.clientHeight / 2,
            });
        }
    };

    const stopDrag = () => {
        setDragging(false);
    };

    const handleCreateWorker = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/worker/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workerData),
            });

            if (!response.ok) {
                const result = await response.json();
                setErrorMessage(result.message || 'Не удалось создать работника.');
            } else {
                const result = await response.json();
                setSuccessMessage('Работник успешно создан!');
                setWorkerData({
                    name: '',
                    coordinates: { x: '', y: '' },
                    creationDate: '',
                    salary: '',
                    startDate: '',
                    status:'',
                    position: '',
                    person: {
                        birthday: '',
                        passportID: '',
                        hairColor: '',
                        nationality: '',
                    },
                });
            }
        } catch (error) {
            setErrorMessage('Ошибка соединения: ' + error.message);
        }

        setIsLoading(false);
    };

    const handleGetWorker = async () => {
        if (!workerId) {
            setErrorMessage('Пожалуйста, введите ID работника.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(''); // Очищаем старое сообщение об ошибке

        try {
            const response = await fetch(`http://localhost:8080/api/worker/get/${workerId}`);

            if (!response.ok) {
                const result = await response.json();
                setErrorMessage(result.message || 'Что-то пошло не так.');
                setWorker(null);
            } else {
                const result = await response.json();
                setWorker(result.worker);
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage('Ошибка соединения: ' + error.message);
            setWorker(null);
        }

        setIsLoading(false);
    };

    // Функция для обработки удаления работника
    const handleDeleteWorker = async () => {
        if (!workerId) {
            setErrorMessage('Пожалуйста, введите ID работника для удаления.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(''); // Очищаем старое сообщение об ошибке
        setSuccessMessage(''); // Очищаем старое сообщение об успешном удалении

        try {
            const response = await fetch(`http://localhost:8080/api/worker/delete/${workerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json();
                setErrorMessage(result.message || 'Не удалось удалить работника.');
            } else {
                const result = await response.json();
                setErrorMessage('');
                setWorker(null);
                setSuccessMessage(`Работник с ID ${workerId} был удален.`);
            }
        } catch (error) {
            setErrorMessage('Ошибка соединения: ' + error.message);
        }

        setIsLoading(false);
    };

    // Функция для обработки обновления данных работника
    const handleUpdateWorker = async () => {
        if (!workerId || !field || !value) {
            setErrorMessage('Пожалуйста, введите все данные для обновления.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(''); // Очищаем старое сообщение об ошибке
        setSuccessMessage(''); // Очищаем старое сообщение об успешном обновлении

        try {
            const updateDetails = {
                field,
                value,
            };

            const response = await fetch(`http://localhost:8080/api/worker/update/${workerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateDetails),
            });

            if (!response.ok) {
                const result = await response.json();
                setErrorMessage(result.message || 'Не удалось обновить данные работника.');
            } else {
                const result = await response.json();
                setErrorMessage('');
                setSuccessMessage(`Данные работника с ID ${workerId} были обновлены.`);
            }
        } catch (error) {
            setErrorMessage('Ошибка соединения: ' + error.message);
        }

        setIsLoading(false);
    };

    // Открытие и закрытие модального окна
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Закрытие окна с информацией о работнике
    const closeWorkerInfoWindow = () => setMode(null);

    return (
        <div style={{ backgroundImage: 'url(/Win98-Desk.png)', backgroundSize: 'cover', height: '100vh' }} onMouseMove={onDrag}>

            {/* Иконка с перетаскиванием */}
            <div
                ref={iconRef}
                onClick={openModal}
                className="app-icon"
                style={{
                    position: 'absolute',
                    top: iconPosition.y + 'px',
                    left: iconPosition.x + 'px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: 'white',
                }}
                onMouseDown={startDrag}
                onMouseUp={stopDrag}
            >
                <img
                    src="/icon.png"
                    alt="App Icon"
                    style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid #000',
                        backgroundColor: 'transparent', // Убираем фон
                        borderRadius: '4px',
                        padding: '4px',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                    }}
                />
                <div>Worker Service</div>
            </div>

            {/* Модальное окно для выбора режима */}
            {isModalOpen && (
                <div
                    className="window"
                    style={{
                        position: 'absolute',
                        top: '120px',
                        left: '20px',
                        maxWidth: '400px',
                        padding: '10px',
                        zIndex: 10,
                        background: 'white',
                        borderRadius: '5px',
                    }}
                >
                    <div className="title-bar">
                        <div className="title-bar-text">Выберите режим</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={closeModal}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <button
                            onClick={() => {
                                setMode('getWorker'); // Устанавливаем режим получения информации
                                closeModal(); // Закрываем окно выбора режима
                            }}
                            className="button"
                            style={{width: '100%', marginBottom: '10px'}}
                        >
                            Получить информацию о работнике
                        </button>
                        <button
                            onClick={() => {
                                setMode('deleteWorker'); // Устанавливаем режим удаления работника
                                closeModal(); // Закрываем окно выбора режима
                            }}
                            className="button"
                            style={{width: '100%', marginBottom: '10px'}}
                        >
                            Удалить работника
                        </button>
                        <button
                            onClick={() => {
                                setMode('updateWorker'); // Устанавливаем режим обновления
                                closeModal(); // Закрываем окно выбора режима
                            }}
                            className="button"
                            style={{width: '100%', marginBottom: '10px'}}
                        >
                            Обновить данные работника
                        </button>
                        <button
                            onClick={() => {
                                setMode('createWorker');
                                closeModal(); // Закрываем окно выбора режима
                            }}
                            className="button"
                            style={{width: '100%', marginBottom: '10px'}}
                        >
                           Создать работника
                        </button>
                    </div>
                </div>
            )}

            {/* Окно с информацией о работнике */}
            {mode === 'getWorker' && (
                <div
                    className="window"
                    style={{
                        position: 'absolute',
                        top: '180px',
                        left: '20px',
                        maxWidth: '400px',
                        padding: '10px',
                        zIndex: 10,
                        background: 'white',
                        borderRadius: '5px',
                    }}
                >
                    <div className="title-bar">
                        <div className="title-bar-text">Информация о работнике</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={closeWorkerInfoWindow}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <div>
                            <label>Введите ID работника:</label>
                            <input
                                type="text"
                                value={workerId}
                                onChange={(e) => setWorkerId(e.target.value)}
                                className="input"
                                placeholder="Введите ID"
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <button
                            onClick={handleGetWorker}
                            className="button"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            Получить информацию
                        </button>

                        {isLoading && <p>Загрузка...</p>}

                        {errorMessage && (
                            <div style={{ color: 'red', marginTop: '10px' }}>
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {worker && (
                            <div style={{ marginTop: '10px' }}>
                                <h3>Информация о работнике</h3>
                                <pre>{JSON.stringify(worker, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Окно для удаления работника */}
            {mode === 'deleteWorker' && (
                <div
                    className="window"
                    style={{
                        position: 'absolute',
                        top: '180px',
                        left: '20px',
                        maxWidth: '400px',
                        padding: '10px',
                        zIndex: 10,
                        background: 'white',
                        borderRadius: '5px',
                    }}
                >
                    <div className="title-bar">
                        <div className="title-bar-text">Удалить работника</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={closeWorkerInfoWindow}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <div>
                            <label>Введите ID работника для удаления:</label>
                            <input
                                type="text"
                                value={workerId}
                                onChange={(e) => setWorkerId(e.target.value)}
                                className="input"
                                placeholder="Введите ID"
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <button
                            onClick={handleDeleteWorker}
                            className="button"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            Удалить работника
                        </button>

                        {isLoading && <p>Загрузка...</p>}

                        {errorMessage && (
                            <div style={{ color: 'red', marginTop: '10px' }}>
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div style={{ color: 'green', marginTop: '10px' }}>
                                <p>{successMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Окно для обновления данных работника */}
            {mode === 'updateWorker' && (
                <div
                    className="window"
                    style={{
                        position: 'absolute',
                        top: '180px',
                        left: '20px',
                        maxWidth: '400px',
                        padding: '10px',
                        zIndex: 10,
                        background: 'white',
                        borderRadius: '5px',
                    }}
                >
                    <div className="title-bar">
                        <div className="title-bar-text">Обновить данные работника</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={closeWorkerInfoWindow}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <div>
                            <label>Введите ID работника:</label>
                            <input
                                type="text"
                                value={workerId}
                                onChange={(e) => setWorkerId(e.target.value)}
                                className="input"
                                placeholder="Введите ID"
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <div>
                            <label>Поле для обновления:</label>
                            <input
                                type="text"
                                value={field}
                                onChange={(e) => setField(e.target.value)}
                                className="input"
                                placeholder="Поле"
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <div>
                            <label>Новое значение:</label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="input"
                                placeholder="Значение"
                                style={{ width: '100%', marginBottom: '10px' }}
                            />
                        </div>
                        <button
                            onClick={handleUpdateWorker}
                            className="button"
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            Обновить данные
                        </button>

                        {isLoading && <p>Загрузка...</p>}

                        {errorMessage && (
                            <div style={{ color: 'red', marginTop: '10px' }}>
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div style={{ color: 'green', marginTop: '10px' }}>
                                <p>{successMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {mode === 'createWorker' && (
                <div
                    className="window"
                    style={{
                        position: 'absolute',
                        top: '180px',
                        left: '20px',
                        maxWidth: '400px',
                        padding: '10px',
                        zIndex: 10,
                        background: 'white',
                        borderRadius: '5px',
                    }}
                >
                    <div className="title-bar">
                        <div className="title-bar-text">Создать работника</div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={closeWorkerInfoWindow}></button>
                        </div>
                    </div>
                    <div className="window-body">
                        <form onSubmit={handleCreateWorker}>
                            <label>
                                Имя:
                                <input
                                    type="text"
                                    value={workerData.name}
                                    onChange={(e) =>
                                        setWorkerData({...workerData, name: e.target.value})
                                    }
                                />
                            </label>
                            <label>
                                X:
                                <input
                                    type="integer"
                                    value={workerData.coordinates.x}
                                    onChange={(e) =>
                                        setWorkerData({...workerData,  coordinates: {
                                                ...workerData.coordinates,
                                                x: e.target.value
                                            }})
                                    }
                                />
                            </label>
                            <label>
                                Y:
                                <input
                                    type="integer"
                                    value={workerData.coordinates.y}
                                    onChange={(e) =>
                                        setWorkerData({...workerData,  coordinates: {
                                                ...workerData.coordinates,
                                                y: e.target.value
                                            }})
                                    }
                                />
                            </label>
                            <label>
                                Зарплата:
                                <input
                                    type="text"
                                    value={workerData.salary}
                                    onChange={(e) =>
                                        setWorkerData({...workerData, salary: e.target.value})
                                    }
                                />
                            </label>
                            <label>
                                Статус:
                                <select
                                    value={workerData.status}
                                    onChange={(e) =>
                                        setWorkerData({...workerData, status: e.target.value})
                                    }
                                >
                                    <option value={"HIRED"}>Нанят</option>
                                    <option value={"RECOMMENDED_FOR_PROMOTION"}>Рекомендуемо повышение</option>
                                    <option value={"REGULAR"}>Штатный</option>
                                    <option value={"PROBATION"}>PROBATION</option>
                                </select>
                            </label>
                            <label>
                                Дата выхода в штат:
                                <input
                                    type="date"
                                    value={workerData.startDate}
                                    onChange={(e) =>
                                        setWorkerData({...workerData, startDate: e.target.value})
                                    }
                                />
                            </label>
                            <label>
                                Должность:
                                <select
                                    value={workerData.position}
                                    onChange={(e) =>
                                        setWorkerData({...workerData, position: e.target.value})
                                    }
                                >
                                    <option value={"HEAD_OF_DEPARTMENT"}>Глава департамента</option>
                                    <option value={"LEAD_DEVELOPER"}>Тимлид</option>
                                    <option value={"COOK"}>Повар</option>
                                </select>
                            </label>
                            <label>
                                День рождения:
                                <input
                                    type="date"
                                    value={workerData.person.birthDate}
                                    onChange={(e) =>
                                        setWorkerData({...workerData,  person: {
                                                ...workerData.person,
                                                birthday: e.target.value
                                            }})
                                    }
                                />
                            </label>
                            <label>
                                ID Паспорта:
                                <input
                                    type="text"
                                    value={workerData.person.passportID}
                                    onChange={(e) =>
                                        setWorkerData({...workerData,  person: {
                                                ...workerData.person,
                                                passportID: e.target.value
                                            }})
                                    }
                                />
                            </label>
                            <label>
                                Цвет волос:
                                <select
                                    value={workerData.person.hairColor}
                                    onChange={(e) =>
                                        setWorkerData({...workerData,  person: {
                                                ...workerData.person,
                                                hairColor: e.target.value
                                            }})
                                    }
                                >
                                    <option value={'RED'}>Красный</option>
                                    <option value={'BLACK'}>Черный</option>
                                    <option value={'ORANGE'}>Оранжевый</option>
                                    <option value={'WHITE'}>Белый</option>
                                </select>
                            </label>
                            <label>
                                Национальность:
                                <select
                                    value={workerData.person.nationality}
                                    onChange={(e) =>
                                        setWorkerData({...workerData,  person: {
                                                ...workerData.person,
                                                nationality: e.target.value
                                            }})
                                    }
                                >
                                    <option value={'RUSSIAN'}>Русский</option>
                                    <option value={'FRANCE'}>Лягушатник</option>
                                    <option value={'INDIA'}>Индус с ютуба</option>
                                </select>
                            </label>
                            <button type="submit">Создать</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default WorkerService;
