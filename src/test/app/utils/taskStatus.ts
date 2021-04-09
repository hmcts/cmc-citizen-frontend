import { expect } from 'chai'
import { TaskStatus } from 'utils/taskStatus'
import { TaskList } from 'drafts/tasks/taskList'

describe('TaskStatus', () => {
  it('should return default values if the task list is empty', () => {
    TaskStatus.getTaskStatus()
    expect(TaskStatus.getTaskStatus()).to.be.eql({ completed: 0, total: 0 })
  })

  it('should return 2 completed tasks and 3 total tasks', () => {
    const taskList: TaskList[] = [
      {
        name: 'Step 1',
        tasks: [
          {
            name: 'Task 1',
            startPageUrl: '/claim/',
            completed: true
          }
        ],
        isCompleted: () => {
          return false
        }
      },
      {
        name: 'Step 2',
        tasks: [
          {
            name: 'Task 2',
            startPageUrl: '/claim/',
            completed: true
          },
          {
            name: 'Task 3',
            startPageUrl: '/claim/',
            completed: false
          }
        ],
        isCompleted: () => {
          return false
        }
      },
      {
        name: 'Step 3',
        tasks: [],
        isCompleted: () => {
          return false
        }
      }
    ]
    expect(TaskStatus.getTaskStatus(taskList)).to.be.eql({ completed: 2, total: 3 })
  })

})
