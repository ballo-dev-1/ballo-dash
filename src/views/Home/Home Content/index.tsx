"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./style.scss";
import { CirclePlus, CircleXIcon, Pencil, Save, Trash } from "lucide-react";

const timeFrames = ["weekly", "monthly", "quarterly", "annual"] as const;
type TimeFrame = (typeof timeFrames)[number];

type Task = {
  id: string;
  title: string;
  completed: boolean;
  platform: string;
  contentType: string;
  budget: string;
  kpi: string;
};

type PlanContent = {
  today: Task[];
};

type TabContent = {
  plan: PlanContent;
};

// const initialData: Record<TimeFrame, TabContent> = {
//   weekly: {
//     plan: {
//       today: [
//         {
//           id: crypto.randomUUID(),
//           title: "Schedule LinkedIn Thought Leadership Post",
//           completed: false,
//           contentType: "Carousel",
//           platform: "LinkedIn",
//           budget: "K150",
//           kpi: "100 reactions",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Design UI mockups for mobile onboarding",
//           completed: false,
//           contentType: "UX Design",
//           platform: "Canva",
//           budget: "K400",
//           kpi: "3 screens",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Send client performance reports",
//           completed: false,
//           contentType: "Report",
//           platform: "Ballo Dashboard",
//           budget: "K50",
//           kpi: "100% delivery",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Optimize Google Ads keywords",
//           completed: false,
//           contentType: "Search Ads",
//           platform: "Google Ads",
//           budget: "K300",
//           kpi: "15% CTR",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Publish blog: 'Top 5 AI Trends 2025'",
//           completed: false,
//           contentType: "Blog",
//           platform: "Website",
//           budget: "K200",
//           kpi: "300 reads",
//         },
//       ],
//     },
//   },
//   monthly: {
//     plan: {
//       today: [
//         {
//           id: crypto.randomUUID(),
//           title: "Launch brand awareness campaign for Zamtel",
//           completed: false,
//           contentType: "Facebook Ads",
//           platform: "Facebook",
//           budget: "K3,000",
//           kpi: "500K impressions",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Host Instagram Live for product demo",
//           completed: false,
//           contentType: "Live Stream",
//           platform: "Youtube",
//           budget: "K500",
//           kpi: "300 viewers",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Onboard 2 new SMEs to social media plan",
//           completed: false,
//           contentType: "Client Onboarding",
//           platform: "Website",
//           budget: "K250",
//           kpi: "2 SMEs onboarded",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Redesign landing page CTA sections",
//           completed: false,
//           contentType: "Web Dev",
//           platform: "Website",
//           budget: "K800",
//           kpi: "10% conversion lift",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Develop content calendar for July",
//           completed: false,
//           contentType: "Planning",
//           platform: "Google Sheet",
//           budget: "K100",
//           kpi: "30-day schedule",
//         },
//       ],
//     },
//   },
//   quarterly: {
//     plan: {
//       today: [
//         {
//           id: crypto.randomUUID(),
//           title: "Run influencer partnership campaign",
//           completed: false,
//           contentType: "Influencer",
//           platform: "LinkedIn",
//           budget: "K5,000",
//           kpi: "1M reach",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Conduct SEO audit across all client sites",
//           completed: false,
//           contentType: "SEO",
//           platform: "Google Analytics",
//           budget: "K1,500",
//           kpi: "15% organic uplift",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Deploy CRM upgrade for SME accounts",
//           completed: false,
//           contentType: "CRM Dev",
//           platform: "Website",
//           budget: "K2,500",
//           kpi: "100% migration",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Produce 6 video case studies",
//           completed: false,
//           contentType: "Video Production",
//           platform: "Canva",
//           budget: "K4,000",
//           kpi: "6 completed",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Launch WhatsApp automation tool beta",
//           completed: false,
//           contentType: "Product Dev",
//           platform: "Ballo Ads",
//           budget: "K2,000",
//           kpi: "100 test users",
//         },
//       ],
//     },
//   },
//   annual: {
//     plan: {
//       today: [
//         {
//           id: crypto.randomUUID(),
//           title: "Deliver 12-month client growth report",
//           completed: false,
//           contentType: "Report",
//           platform: "Email",
//           budget: "K1,000",
//           kpi: "10 clients reviewed",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Build new SaaS dashboard for analytics",
//           completed: false,
//           contentType: "Product Dev",
//           platform: "Website",
//           budget: "K15,000",
//           kpi: "MVP deployed",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Scale content strategy to 5 countries",
//           completed: false,
//           contentType: "Content Strategy",
//           platform: "Facebook",
//           budget: "K20,000",
//           kpi: "5 markets live",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Launch Ballo Innovations Bootcamp",
//           completed: false,
//           contentType: "Training",
//           platform: "Website",
//           budget: "K8,000",
//           kpi: "200 participants",
//         },
//         {
//           id: crypto.randomUUID(),
//           title: "Host annual partners retreat",
//           completed: false,
//           contentType: "Event",
//           platform: "LinkedIn",
//           budget: "K12,000",
//           kpi: "30 attendees",
//         },
//       ],
//     },
//   },
// };

const initialData: Record<TimeFrame, TabContent> = {
  weekly: { plan: { today: [] } },
  monthly: { plan: { today: [] } },
  quarterly: { plan: { today: [] } },
  annual: { plan: { today: [] } },
};

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekDateRange(date: Date): string {
  const day = date.getDay();
  const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diffToMonday));
  const sunday = new Date(date.setDate(monday.getDate() + 6));
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return `${monday.toLocaleDateString(
    undefined,
    options
  )} – ${sunday.toLocaleDateString(undefined, options)}`;
}

function SortableRow({
  task,
  index,
  toggleTaskCompletion,
  isEditing,
  onEdit,
  onCancel,
  onChange,
  onSave,
  onDelete,
  editFormData,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={task.completed ? "table-success" : ""}
    >
      <td>
        {!isEditing && (
          <span
            {...attributes}
            {...listeners}
            className="drag-handle"
            style={{ cursor: "grab" }}
            title="Drag"
          >
            ⠿
          </span>
        )}
      </td>
      <td className="d-flex px-4 align-items-center" style={{ border: "none" }}>
        <span
          onPointerDown={(e) => {
            e.stopPropagation();
            toggleTaskCompletion(index);
          }}
          style={{ cursor: "pointer" }}
          className={`task-dot ${task.completed ? "completed" : "pending"}`}
        ></span>
        {isEditing ? (
          <input
            type="text"
            className="ms-2 form-control"
            value={editFormData.title}
            onChange={(e) =>
              onChange({ ...editFormData, title: e.target.value })
            }
            style={{ minWidth: 120 }}
          />
        ) : (
          <span
            className={`ms-2 text ${
              task.completed ? "text-decoration-line-through text-muted" : ""
            }`}
          >
            {task.title}
          </span>
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editFormData.contentType}
            onChange={(e) =>
              onChange({ ...editFormData, contentType: e.target.value })
            }
          />
        ) : (
          task.contentType
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editFormData.platform}
            onChange={(e) =>
              onChange({ ...editFormData, platform: e.target.value })
            }
          />
        ) : (
          task.platform
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editFormData.budget}
            onChange={(e) =>
              onChange({ ...editFormData, budget: e.target.value })
            }
          />
        ) : (
          task.budget
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editFormData.kpi}
            onChange={(e) => onChange({ ...editFormData, kpi: e.target.value })}
          />
        ) : (
          task.kpi
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <button
              className="btn btn-sm me-2 p-0"
              onClick={() => onSave(index)}
            >
              <Save color="seagreen" />
            </button>
            <button className="btn btn-sm me-2 p-0" onClick={onCancel}>
              <CircleXIcon />
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-sm border-0"
              onClick={() => onEdit(index, task)}
            >
              <Pencil />
            </button>
            <button className="btn btn-sm p-0" onClick={() => onDelete(index)}>
              <Trash color="indianred" />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default function WeeklyPlanTabs() {
  const [planData, setPlanData] = useState(initialData);
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>("weekly");

  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Task>({
    id: "",
    title: "",
    completed: false,
    contentType: "",
    platform: "",
    budget: "",
    kpi: "",
  });

  const sensors = useSensors(useSensor(PointerSensor));
  const framePlan = planData[selectedTimeFrame].plan;

  const getTimeframeLabel = (frame: TimeFrame): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString("default", { month: "long" });
    const weekNumber = getWeekNumber(now);
    const quarter = Math.floor(now.getMonth() / 3) + 1;

    switch (frame) {
      case "weekly":
        return `Week ${weekNumber}: ${getWeekDateRange(now)}`;
      case "monthly":
        return `${month} ${year}`;
      case "quarterly":
        return `Q${quarter} ${year}`;
      case "annual":
        return `${year}`;
    }
  };

  const toggleTaskCompletion = (taskIndex: number) => {
    setPlanData((prev) => {
      const updated = { ...prev };
      const task = updated[selectedTimeFrame].plan.today[taskIndex];
      task.completed = !task.completed;
      return updated;
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = framePlan.today.findIndex((t) => t.id === active.id);
    const newIndex = framePlan.today.findIndex((t) => t.id === over.id);

    const newTasks = arrayMove(framePlan.today, oldIndex, newIndex);
    setPlanData((prev) => {
      const updated = { ...prev };
      updated[selectedTimeFrame].plan.today = newTasks;
      return updated;
    });
  };

  const handleEdit = (idx: number, task: Task) => {
    setEditRowIndex(idx);
    setEditFormData({ ...task });
  };

  const handleCancel = () => {
    setEditRowIndex(null);
    setEditFormData({
      id: "",
      title: "",
      completed: false,
      contentType: "",
      platform: "",
      budget: "",
      kpi: "",
    });
  };

  const handleChange = (data: Task) => {
    setEditFormData(data);
  };

  const handleSave = (idx: number) => {
    setPlanData((prev) => {
      const updated = { ...prev };
      updated[selectedTimeFrame].plan.today[idx] = { ...editFormData };
      return updated;
    });
    handleCancel();
  };

  const confirmDeleteTask = () => {
    if (deleteIndex === null) return;
    setPlanData((prev) => {
      const updated = { ...prev };
      updated[selectedTimeFrame].plan.today = updated[
        selectedTimeFrame
      ].plan.today.filter((_, idx) => idx !== deleteIndex);
      return updated;
    });
    setShowDeleteModal(false);
    setDeleteIndex(null);
    handleCancel();
  };

  const openDeleteModal = (idx: number) => {
    setDeleteIndex(idx);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: "",
      completed: false,
      contentType: "",
      platform: "",
      budget: "",
      kpi: "",
    };
    setPlanData((prev) => {
      const updated = { ...prev };
      updated[selectedTimeFrame].plan.today.unshift(newTask);
      return updated;
    });
    setEditRowIndex(0);
    setEditFormData(newTask);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <div className="container text-center py-5 home-content-wrapper">
      <h2 className="heading">
        VISION WITHOUT EXECUTION <br /> IS HALLUCINATION!
      </h2>

      <div className="nav nav-tabs-1 justify-content-center my-4 border-0 select-btns">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            type="button"
            className={`mx-2 nav-link ${
              selectedTimeFrame === frame ? "active" : ""
            }`}
            onClick={() => setSelectedTimeFrame(frame)}
          >
            {frame.charAt(0).toUpperCase() + frame.slice(1)}
          </button>
        ))}
      </div>

      <div className="timeframe-content-wrapper">
        <div className="rounded-4 shadow timeframe-content bg-white">
          <div className="d-flex justify-content-center align-items-center mb-3 position-relative gap-2">
            <p className="fw-semibold timeframe-label">
              {getTimeframeLabel(selectedTimeFrame)}
            </p>
            {/* <button
              className="btn btn-primary btn-sm add-plan"
              onClick={handleAddTask}
            >
              +
            </button> */}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>
                    <CirclePlus
                      onClick={handleAddTask}
                      // color="forestgreen"
                      className=""
                    />
                  </th>
                  <th>Plan</th>
                  <th>Content Type</th>
                  <th>Platform</th>
                  <th>Budget</th>
                  <th>KPIs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={framePlan.today.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {framePlan.today.map((task, idx) => (
                      <SortableRow
                        key={task.id}
                        index={idx}
                        task={task}
                        toggleTaskCompletion={toggleTaskCompletion}
                        isEditing={editRowIndex === idx}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onChange={handleChange}
                        onSave={handleSave}
                        onDelete={openDeleteModal}
                        editFormData={
                          editRowIndex === idx ? editFormData : task
                        }
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this goal?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDeleteTask}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
