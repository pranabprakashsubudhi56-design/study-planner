import React, { useState } from "react";
import { db } from "../firebase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

function TaskList({ tasks }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔥 DRAG & DROP (optimized)
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    try {
      // Update order efficiently
      const updates = items.map((task, index) =>
        updateDoc(doc(db, "tasks", task.id), {
          order: Date.now() + index
        })
      );

      await Promise.all(updates);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // ✅ TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed
    });
  };

  // ✅ EDIT
  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.name);
  };

  const saveEdit = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      name: editText
    });
    setEditingId(null);
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
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      opacity: task.completed ? 0.6 : 1,
                      ...provided.draggableProps.style
                    }}
                  >

                    {/* ✏️ EDIT MODE */}
                    {editingId === task.id ? (
                      <>
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <button onClick={() => saveEdit(task.id)}>💾 Save</button>
                      </>
                    ) : (
                      <>
                        <h3>{task.name}</h3>
                      </>
                    )}

                    <p>📅 {task.deadline}</p>
                    <p>⚡ {task.priority}</p>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button onClick={() => toggleComplete(task)}>
                        {task.completed ? "✅ Done" : "⭕ Complete"}
                      </button>

                      <button onClick={() => handleEdit(task)}>
                        ✏️ Edit
                      </button>

                      <button onClick={() => handleDelete(task.id)}>
                        🗑 Delete
                      </button>
                    </div>

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