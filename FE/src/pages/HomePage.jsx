import AddTask from '@/components/AddTask'
import DateTimeFilter from '@/components/DateTimeFilter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StatsAndFilters from '@/components/StatsAndFilters'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import api from '@/lib/axios'
import { visibleTaskLimit as visibleTasksLimit } from '@/lib/data'

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page,setPage] = useState(1);


  useEffect(() => {
    fetchTasks();
  }, [dateQuery])

  useEffect(() =>{
    setPage(1)
  },[filter,dateQuery])

  

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`)
      setTaskBuffer(res.data.tasks);
      setActiveCount(res.data.activeCount);
      setCompleteCount(res.data.completeCount);
    }
    catch (error) {
      toast.error("Có lỗi xảy ra khi truy xuất tasks")
    }
  }

  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });


  const handelTaskChanged = () =>{
    fetchTasks();
  }

  const handleNext = () =>{
    if(page < totalPages){
      setPage((prev) => prev + 1);
    }
  }

  const handlePrev = () =>{
    if(page > 1){
      setPage((prev) => prev - 1);
    }
  }

  const handlePageChanged = (page) => {
    setPage(page);
  }

  const visibleTasks = filteredTasks.slice((page - 1) * visibleTasksLimit,visibleTasksLimit * page)
  const totalPages = Math.ceil(filteredTasks.length / visibleTasksLimit);

  if(visibleTasks.length === 0)
  {
    handlePrev();
  }


  
  return (
    <>
      <div className="min-h-screen w-full bg-white relative">
        {/* Pink Glow Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)
      `,
            backgroundSize: "100% 100%",
          }}
        />
        {/* Your Content/Components */}
        <div className='container pt-8 mx-auto relative z-10'>
          <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>
            <Header />

            <AddTask handleNewTaskAdded={handelTaskChanged}/>

            <StatsAndFilters
              filter={filter}
              setFilter={setFilter}
              completedTasksCount={completeCount}
              activeTasksCount={activeCount} />

            <TaskList tasks={visibleTasks} filter={filter} handleTasksChanged={handelTaskChanged}/>


            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
              <TaskListPagination page={page} totalPages={totalPages} handleNext={handleNext} handlePrev={handlePrev} handlePageChanged={handlePageChanged}/>
              <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
            </div>

            <Footer completedTaskCount={completeCount} activeTaskCount={activeCount} />

          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage