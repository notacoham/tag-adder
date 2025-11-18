import { Navbar } from '../components/Navbar'
import { ManagerForm } from '../components/ManagerForm'

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <ManagerForm />
      </main>
    </div>
  )
}