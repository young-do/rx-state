import { useEffect, useState } from 'react';
import { useRxValue } from './hooks/useRxState';
import { Todo, todoList$ } from './store/states';
import { dispatch } from 'rxjs-store-core';
import { AddTodo, ChangeTodoListStatus, DeleteTodoList } from './store/action';

function App() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Todo['status'] | null>(null);
  const todoList = useRxValue(todoList$);
  const filteredTodoList = todoList.filter(todo => {
    if (filter === null) return true;
    return todo.status === filter;
  });

  const addTodo = () => {
    if (text) {
      dispatch(AddTodo(text));
      setText('');
    }
  };
  const changeTodoStatus = (id: number, status: Todo['status']) => () => {
    const nextStatus = status === 'active' ? 'completed' : 'active';
    dispatch(ChangeTodoListStatus([{ id, status: nextStatus }]));
  };
  const changeAllCompleted = () => {
    dispatch(
      ChangeTodoListStatus(
        todoList$.value.filter(todo => todo.status === 'active').map(todo => ({ id: todo.id, status: 'completed' })),
      ),
    );
  };
  const deleteTodo = (id: number) => () => {
    dispatch(DeleteTodoList([id]));
  };
  const deleteAllCompleted = () => {
    const idList = todoList$.value.filter(todo => todo.status === 'completed').map(todo => todo.id);
    dispatch(DeleteTodoList(idList));
  };

  useEffect(() => {
    const changeFilterByHash = () => {
      const hash = location.hash;
      setFilter(hash === '#/active' ? 'active' : hash === '#/completed' ? 'completed' : null);
    };
    window.onhashchange = changeFilterByHash;
    changeFilterByHash();
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          onKeyPress={e => {
            e.key === 'Enter' && addTodo();
          }}
        />
      </header>
      <section className="main">
        <input id="toggle-all" className="toggle-all" type="checkbox" onClick={changeAllCompleted} />
        <label htmlFor="toggle-all">Mark all as complete</label>

        <ul className="todo-list">
          {filteredTodoList.map(todo => {
            return (
              <li key={todo.id} className={todo.status === 'completed' ? 'completed' : ''}>
                <div className="view">
                  <input
                    id={`toggle-todo-${todo.id}`}
                    className="toggle"
                    type="checkbox"
                    checked={todo.status === 'completed'}
                    onClick={changeTodoStatus(todo.id, todo.status)}
                    readOnly
                  />
                  <label htmlFor={`toggle-todo-${todo.id}`}>{todo.text}</label>
                  <button className="destroy" onClick={deleteTodo(todo.id)} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">{filteredTodoList.length}</span>
        <ul className="filters">
          <li>
            <a href="#/" className={filter === null ? 'selected' : ''}>
              All
            </a>
          </li>
          <li>
            <a href="#/active" className={filter === 'active' ? 'selected' : ''}>
              Active
            </a>
          </li>
          <li>
            <a href="#/completed" className={filter === 'completed' ? 'selected' : ''}>
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed" onClick={deleteAllCompleted}>
          Clear completed
        </button>
      </footer>
    </section>
  );
}

export default App;
