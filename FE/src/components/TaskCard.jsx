import React, { useState } from 'react'
import { Card } from './ui/card'
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import api from '@/lib/axios';

const TaskCard = ({ task, index, handleTasksChanged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

    const handleDeleteTask = async () => {
        try {
            const res = await api.delete(`/tasks/${task._id}`);
            toast.success(`Task ${task.title} đã được xóa thành công`);
            handleTasksChanged();
        }
        catch (error) {
            console.error("Lỗi khi xóa task", error);
            toast.error("Có lỗi xảy ra khi xóa task")
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            updateTask();
        }
    }

    const updateTask = async () => {
        try {
            setIsEditing(false);
            const res = await api.put(`/tasks/${task._id}`, {
                title: updateTaskTitle.trim()
            });
            toast.success(`Task ${task.title} đã được cập nhật thành công`);
            handleTasksChanged();
        }
        catch (error) {
            console.error("Lỗi khi cập nhật task", error);
            toast.error("Có lỗi xảy ra khi cập nhật task")
        }
    }

    const toggleTaskComplete = async () => {
        try {
            if(task.status === "active"){
                const res = await api.put(`/tasks/${task._id}`, {
                    status: "completed",
                    completedAt: new Date().toISOString(),
                });
                toast.success(`Task ${task.title} đã được cập nhật thành công`);
            }
            else{
                const res = await api.put(`/tasks/${task._id}`, {
                    status: "active",
                    completedAt: null,
                });
                toast.success(`Task ${task.title} đã được chuyển sang trạng thái chưa hoàn thành`);
            }
            handleTasksChanged();
        }
        catch (error) {
            console.error("Lỗi khi cập nhật task", error);
            toast.error("Có lỗi xảy ra khi cập nhật task")
        }

    }

    return (
        <Card className={cn("p-4 bg-gradient-card border shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
            task.status === "completed" && "opacity-75"
        )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className='flex items-center gap-4 flex-col sm:flex-row'>
                {/* Nút tròn */}
                <Button variant='ghost' size='icon' className={cn("flex-0 size-8 rounded-full transition-all duration-200",
                    task.status === 'completed' ? 'text-success hover:text-success/80' :
                        "text-muted-foreground hover:text-primary"
                )}
                    onClick={toggleTaskComplete}>
                {
                    task.status === 'completed' ?
                        (<CheckCircle2 className='size-5' />) :
                        (<Circle className='size-5' />)
                }
            </Button>

            {/* hiển thì chỉnh sửa tiều đề */}
            <div className='flex-1 min-w-0'>
                {isEditing ?
                    (<Input autoFocus type='text' placeholder="Cần phải làm gì"
                        value={updateTaskTitle}
                        onChange={(e) => setUpdateTaskTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onBlur={() => {
                            setIsEditing(false);
                            setUpdateTaskTitle(task.title)
                        }}
                        className='flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20' />) :
                    (<p className={cn("text-base transition-all duration-200",
                        task.status === 'completed' ? "line-through text-muted-foreground" : "text-foreground")}
                    >
                        {task.title}
                    </p>)
                }
                <div className='flex items-center gap-2 mt-1'>
                    <Calendar className='size-3 text-muted-foreground' />
                    <span className='text-xs text-muted-foreground'>
                        {new Date(task.createdAt).toLocaleString()}
                    </span>
                    {
                        task.completedAt && (
                            <>
                                <span className='text-xs text-muted-foreground'>-</span>
                                <Calendar className='size-3 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground'>
                                    {new Date(task.completedAt).toLocaleString()}
                                </span>
                            </>
                        )
                    }
                </div>
            </div>


            <div className='hidden gap-2 group-hover:inline-flex animate-slide-up'>
                <Button variant='ghost' size='icon' className='shrink-0 transition-colors size-8 text-muted-foreground hover:text-info' onClick={() => {
                    setIsEditing(true);
                    setUpdateTaskTitle(task.title || "");
                }}>
                    <SquarePen />
                </Button>

                <Button variant='ghost' size='icon' className='shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive' onClick={handleDeleteTask}>
                    <Trash2 />
                </Button>
            </div>
        </div>
        </Card >
    )
}

export default TaskCard