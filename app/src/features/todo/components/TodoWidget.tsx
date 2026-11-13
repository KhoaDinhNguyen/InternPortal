import { useTodoFilter } from "../hooks";

import NewTodoPanel from "./NewTodoPanel";
import TodoView from "./TodoView";
import Card from "@components/Card";
import CardHeader from "@components/CardHeader";
import { DismissCompleteButton, FilterButton } from "./TodoButtons";

import { authUser } from "../mockData";
import type { TodoStore } from "../types";

interface TodoWidgetProps {
  onExpand?: () => void;
  onClose?: () => void;
  todoStore: TodoStore;
}

/**
 * Renders to-do widget, includes:
 * - To-do list
 * - Filter system
 * - Remove completed to-do task
 * - Add new to-do task
 */
export default function TodoWidget({ onExpand, onClose, todoStore }: TodoWidgetProps) {
  const { todos, toggle, addTodo, removeCompletedTodos } = todoStore;
  const { filter, setFilter, filteredTodos, filterConfigs } = useTodoFilter(todos, authUser);

  return (
    <Card>
      <CardHeader
        title="Team To-Do"
        onExpand={onExpand}
        onClose={onClose}
        action={
          <div className="flex flex-wrap items-center gap-1">
            {filterConfigs.map((f) => (
              <FilterButton key={f.id} filter={filter} setFilter={setFilter} filterConfig={f} />
            ))}
          </div>
        }
      />

      {filteredTodos.some((t) => t.done) && <DismissCompleteButton dismiss={removeCompletedTodos} />}

      <div className="max-h-75 overflow-y-auto px-5">
        {filteredTodos.length === 0 ? (
          <p className="py-7 text-center">
            Nothing here — all clear!
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <TodoView key={todo.id} todo={todo} toggleComplete={toggle} authUser={authUser} />
          ))
        )}
      </div>

      <NewTodoPanel addTodo={addTodo} />
    </Card>
  );
}
