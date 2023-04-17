import { useState, useRef, useEffect } from 'react'
import './App.css'


function App() {

  const [todos, setTodos] = useState([])
  const [filterTodo, setFilterTodo] = useState('all')
  const [theme, setTheme] = useState('light')
  const [imgSrc, setImgSrc] = useState('/images/bg-desktop-light.jpg')
  const inputRef = useRef()

  function addTodo(e){
      e.preventDefault()
      const value = inputRef.current.value
      console.log(value)
      if (value.trim() !== ''){
      setTodos([...todos, {text: value, complete: false}])
      inputRef.current.value = ''}
    
  }

  function deleteTodo(index){
      const newTodos = [...todos]
      newTodos.splice(index, 1)
      setTodos(newTodos)
  }

  function markTodo(index){
      const newTodos = [...todos ]
      newTodos[index].complete = !newTodos[index].complete
      setTodos(newTodos)
      console.log(newTodos[index].complete)  
  }

  const clearCompleted = () => {
    const newTodos = todos.filter((todo) => !todo.complete);
    setTodos(newTodos);
  };

  const filterHandler = (todo) => {
    if(filterTodo === 'all') {
      return true
    }
    else if (filterTodo === 'active'){
      return !todo.complete
    }
    else if (filterTodo === 'completed'){
      return todo.complete
    }
  }

  const toggleTheme = () => {
    setTheme((currentTheme)=> (currentTheme === 'light' ? 'dark' : 'light'))
    const windowWidth = window.innerWidth;
    if  (windowWidth > 700 && theme === 'light'){
      setDarkMode()
      setImgSrc('/images/bg-desktop-dark.jpg');
    } else if (windowWidth > 700 && theme === 'dark' ){
      setLightMode()
      setImgSrc('/images/bg-desktop-light.jpg');
    } else if (windowWidth <= 700 && theme === 'light'){
      setDarkMode()
      setImgSrc('/images/bg-mobile-dark.jpg')
    } else {
      setLightMode()
      setImgSrc('/images/bg-mobile-light.jpg')
    }
    
  }

  const setDarkMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'dark')
  }

  const setLightMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'light')
  }

  // Photo responsive to window resize
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth > 700 && theme === 'light') {
        setImgSrc('/images/bg-desktop-light.jpg');
      } else if (windowWidth > 700 && theme === 'dark' ){
        setImgSrc('/images/bg-desktop-dark.jpg');
      } else if (windowWidth <= 700 && theme === 'light'){
        setImgSrc('/images/bg-mobile-light.jpg')
      } else {
        setImgSrc('/images/bg-mobile-dark.jpg')
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    const dragIndex = e.dataTransfer.getData("index");
    const newTodos = [...todos];  
    const draggedTodo = newTodos[dragIndex];
    newTodos.splice(dragIndex, 1);
    newTodos.splice(index, 0, draggedTodo);
    setTodos(newTodos);
  };


  const countIncomplete = todos.filter((todo)=>!todo.complete).length



  return (
    <div className={`App `}>
        <img className='todo-header-bg' src={imgSrc} />
        {/* <img className='todo-header-bg' src={theme === 'light' ? '/images/bg-desktop-light.jpg' : '/images/bg-desktop-dark.jpg'} /> */}
        <header className='todo-header'>
            <h1>TODO</h1>
            <button onClick={toggleTheme}><img src={theme === 'light' ? '/images/icon-moon.svg' : '/images/icon-sun.svg'} /></button>
        </header>
        {/* Todo input */}
        <article className='todo-input' >
            <form onSubmit={addTodo} >
            
              <div className={`todo-input-inner ${theme === 'light' ? 'light' : 'dark' }`}>
                <button className='todo-circle'></button>
                <input placeholder='Create new todo..' type='text' ref={inputRef} />
                
              </div>
            </form>
        </article>
        <main className='todo-body'>
            
            <ul>
            {todos.filter(filterHandler).map((list, index)=> 
            <div key={index} >
              <div className={`todo-task ${theme === 'light' ? '' : 'dark'}`}>
                <li className={`${list.complete ? 'done' : ''} `}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, index)}
                    >
                      <div>
                          <button className={`todo-circle ${list.complete ? 'done' : ''} `} onClick={()=> markTodo(index)}><img src='/images/icon-check.svg'/></button>
                      </div>
                      {list.text}
                      
                </li>
                {/* Delete button */}
                <button className='todo-task-delete' onClick={()=> deleteTodo(index)}><img src='/images/icon-cross.svg' /></button>
              </div>
              {/* <hr></hr> */}
            </div>
            )}
                
            </ul>
            {/* Filter section */}
            <div className={`todo-bottom ${theme === 'light' ? '' : 'dark'}`}>
                <p>{countIncomplete} items left</p>
                <div >
                    <button className={`filter-btn ${filterTodo==='all' ? 'active' : '' }`} onClick={()=>setFilterTodo('all')}>All</button>
                    <button className={`filter-btn ${filterTodo==='active' ? 'active' : '' }`} onClick={()=>setFilterTodo('active')}>Active</button>
                    <button className={`filter-btn ${filterTodo==='completed' ? 'active' : '' }`} onClick={()=>setFilterTodo('completed')}>Completed</button>
                </div>
                <button onClick={()=> clearCompleted()}>Clear Completed</button>
            </div>
            
        </main> 
        
        <footer>
            <div className={`filter-footer ${theme === 'light' ? '' : 'dark'}`}>
                    <button className={`filter-btn ${filterTodo==='all' ? 'active' : '' }`} onClick={()=>setFilterTodo('all')}>All</button>
                    <button className={`filter-btn ${filterTodo==='active' ? 'active' : '' }`} onClick={()=>setFilterTodo('active')}>Active</button>
                    <button className={`filter-btn ${filterTodo==='completed' ? 'active' : '' }`} onClick={()=>setFilterTodo('completed')}>Completed</button>
            </div>
          <p>Drag and drop to reorder list</p>
          <div class="attribution">
            Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
            Coded by <a href="#">Nate Epp</a>.
          </div>
        </footer>
    </div>
  )
}

export default App
