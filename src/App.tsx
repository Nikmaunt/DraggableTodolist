import React, {useEffect, useState, KeyboardEvent, ChangeEvent} from 'react';
import './App.css';
import {v4} from "uuid";
import randomColor from "randomcolor";
import Draggable, {DraggableData} from 'react-draggable';


function App() {

    const [todo, setTodo] = useState<any>('')
    // @ts-ignore
    const [items, setItems] = useState<any>(JSON.parse(localStorage.getItem('items')) || [])
    let [error, setError] = useState<string | null>(null)

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items))
    }, [items])

    const newItem = () => {
        if (todo.trim() !== '') {
            const newItem = {
                id: v4(),
                item: todo,
                color: randomColor({
                    luminosity: 'light',
                }),
                defaultPos: {
                    x: 400,
                    y: -400
                }
            }
            setItems((item: any) => [...items, newItem])
            setTodo('')
        } else {
            setError('Title is required')

            setTodo('')
        }
    }


    const deleteNote = (id: string) => {
        setItems(items.filter((i: any) => i.id !== id))
    }
    const updatePosition = (data: DraggableData, index: number) => {
        let newArray = [...items]
        newArray[index].defaultPos = {x: data.x, y: data.y}
        setItems(newArray)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.keyCode === 13) {
            newItem()
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTodo(e.target.value)
    }


    return (
        <div className="App">
            <div className='wrapper'>
                <input className={ error ? 'error' : 'input'} onKeyDown={onKeyPressHandler} value={todo} onChange={onChangeHandler}
                       type="text" placeholder={error ? 'Title is required' : 'Enter something...'}/>
                <button className='enter' onClick={newItem}> Enter</button>
            </div>
            {
                items.map((item: any, index: any) => {
                    return (
                        <Draggable key={index}
                                   defaultPosition={item.defaultPos}
                                   onStop={(_, data) => {
                                       updatePosition(data, index)
                                   }}>
                            <div className="todo_item" style={{backgroundColor: item.color}}>
                                {`${item.item}`}
                                <button className='delete' onClick={() => deleteNote(item.id)}>
                                    X
                                </button>
                            </div>
                        </Draggable>
                    )
                })
            }
        </div>
    );
}

export default App;
