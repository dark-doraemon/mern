import React, { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const AddTask = ({handleNewTaskAdded}) => {
  const [newTaskTitle,setNewTaskTitle] = useState("");

  const addTask = async () =>{
    
    if(newTaskTitle.trim() === "")
    {
      return;
    }

    try{
      const res = await api.post(`/tasks`, {
        title: newTaskTitle.trim()
      });

      toast.success(`Task ${newTaskTitle} đã được thêm vào thành công`);
      handleNewTaskAdded();
    }
    catch(error){
      console.error("Lỗi khi thêm task", error);
      toast.error("Có lỗi xảy ra khi thêm task")
    }

    setNewTaskTitle("");

  }

  const handleKeyPress = (e) =>{
    if(e.key === 'Enter'){
      addTask();
    }
  }
  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Input type="text" placeholder="Cần phải làm gì" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className='h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20'
          onKeyPress={handleKeyPress}
        />

        <Button variant='gradient' size='xl' className='px-6' disabled={newTaskTitle.trim() === ""}>
          <Plus className='size-5'/> Thêm
        </Button>
      </div>
    </Card>
  )
}

export default AddTask