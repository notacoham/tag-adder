import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { ManagerForm } from '../components/ManagerForm'
import { SpecialistForm } from '../components/SpecialistForm'

export const Home = () => {
  const [activeTab, setActiveTab] = useState('manager')

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
      <main className="flex-1 px-4 py-10 flex justify-center">
        <div className="w-full max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-4 sm:p-8">
            {activeTab === 'manager' ? <ManagerForm /> : <SpecialistForm />}
          </div>
        </div>
      </main>
    </div>
  )
}