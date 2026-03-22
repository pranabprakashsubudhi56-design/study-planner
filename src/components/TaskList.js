import React from "react";
import { db } from "../firebase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { doc, updateDoc } from "firebase/firestore";

function TaskList({ tasks }) {

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    // 🔥 UPDATE ORDER IN FIREBASE
    for (let i = 0; i < items.length; i++) {
      await updateDoc(doc(db, "tasks", items[i].id), {
        order: i
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>

            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <h3>{task.name}</h3>
                    <p>📅 {task.deadline}</p>
                    <p>⚡ {task.priority}</p>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;