// src/components/WeeklyPlanContent.tsx

import React from "react";

type Task = {
  title: string;
  completed: boolean;
};

type PlanContent = {
  today: Task[][]; // Grid of task columns
  upcoming: Task[];
};

type WeeklyPlanContentProps = {
  plan: PlanContent;
  toggleTask: (colIndex: number, taskIndex: number) => void;
};

const WeeklyPlanContent: React.FC<WeeklyPlanContentProps> = ({
  plan,
  toggleTask,
}) => {
  return (
    <div className="row d-flex flex-column gap-2 weekly-plan-content">
      {plan.today.map((col, colIndex) => (
        <div className="col d-flex flex-column gap-2" key={colIndex}>
          {col.map((task, taskIndex) => (
            <div
              className="d-flex align-items-center justify-content-between mb-2"
              key={taskIndex}
            >
              <div
                className="d-flex align-items-center"
                onClick={() => toggleTask(colIndex, taskIndex)}
                style={{ cursor: "pointer" }}
              >
                <span
                  className={`task-dot ${
                    task.completed ? "completed" : "pending"
                  }`}
                ></span>
                <span
                  className={`ms-2 text ${
                    task.completed
                      ? "text-decoration-line-through text-muted"
                      : ""
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <span
                className={`badge text-capitalize status-badge ${
                  task.completed ? "completed" : "pending"
                }`}
              >
                {task.completed ? "completed" : "pending"}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklyPlanContent;
