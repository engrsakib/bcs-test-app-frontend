import DashboardLayout from "./dashboard/layout";
import DashboardPage from "./dashboard/page";
import PermissonPages from "./dashboard/permission/page";

export default function Home() {
  return (
    <div>
     
      <DashboardLayout>
             {/* <DashboardPage>
        
      </DashboardPage> */}
      <PermissonPages></PermissonPages>
      </DashboardLayout>
    </div>
  )
}
